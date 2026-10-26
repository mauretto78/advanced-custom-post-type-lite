<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Helper\Strings;

class Objects
{
    /**
     * @param mixed $destination
     * @param mixed $sourceObject
     * @param mixed $depth
     *
     * @return mixed
     * @throws \ReflectionException
     */
    public static function cast($destination, $sourceObject, $depth = 0)
    {
        // avoid fatal errors
        if (!is_object($sourceObject)) {
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
            } elseif (is_object($value) && ($depth <= $maxDepth)) {
                $depth++;
                $destination->$name = self::cast(new $destination(), $value, $depth);
            } elseif (is_array($value) && ($depth <= $maxDepth)) {
                if (Arrays::arrayIsList($value)) {
                    $arrayOfValues = $value;
                } else {
                    $arrayOfValues = Arrays::toObject($value);
                }

                $destination->$name = $arrayOfValues;
            } else {
                if (is_string($value) && Strings::isJson($value)) {
                    $value = json_decode($value);
                }

                $destination->$name = $value;
            }
        }

        return $destination;
    }

    /**
     * @param mixed $object
     *
     * @return array<mixed>
     */
    public static function stdObjToArray($object): array
    {
        $encoded = json_encode($object);

        if (empty($encoded)) {
            return [];
        }

        return json_decode($encoded, true);
    }
}
