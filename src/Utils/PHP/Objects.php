<?php

namespace ACPT_Lite\Utils\PHP;

class Objects
{
	/**
	 * @param $destination
	 * @param $sourceObject
	 * @param $depth
	 *
	 * @return mixed
	 * @throws \ReflectionException
	 */
	public static function cast($destination, $sourceObject, $depth = 0)
	{
		// avoid fatal errors
		if(!is_object($sourceObject)){
			return null;
		}

		$maxDepth = 10; // avoid infinite loops

		if (is_string($destination)) {
			$destination = new $destination();
		}

		$sourceReflection = new \ReflectionObject($sourceObject);
		$destinationReflection = new \ReflectionObject($destination);
		$sourceProperties = $sourceReflection->getProperties();

		foreach ($sourceProperties as $sourceProperty) {
			$sourceProperty->setAccessible(true);
			$name = $sourceProperty->getName();
			$value = $sourceProperty->getValue($sourceObject);

			if ($destinationReflection->hasProperty($name)) {
				$propDest = $destinationReflection->getProperty($name);
				$propDest->setAccessible(true);
				$propDest->setValue($destination, $value);
			} elseif(is_object($value) and ($depth <= $maxDepth) ){
				$depth++;
				$destination->$name = self::cast(new $destination(), $value, $depth);
			} elseif(is_array($value) and ($depth <= $maxDepth)){

				$depth++;
				$arrayOfValues = [];

				foreach ($value as $v){
					$arrayOfValues[] = self::cast(new $destination(), $v, $depth);
				}

				$destination->$name = $arrayOfValues;
			} else {
				$destination->$name = $value;
			}
		}

		return $destination;
	}

	/**
	 * @param $object
	 *
	 * @return array
	 */
	public static function stdObjToArray($object)
	{
		return json_decode(json_encode($object), true);
	}
}
