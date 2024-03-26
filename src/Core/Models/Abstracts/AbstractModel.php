<?php

namespace ACPT_Lite\Core\Models\Abstracts;

use ACPT\Utils\PHP\Objects;
use ACPT_Lite\Core\Helper\Uuid;
use ReflectionClass;

/**
 * AbstractModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractModel
{
    /**
     * @var string
     */
    protected $id;

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * Hydrate an entity from an array of params
     *
     * @param array $data
     *
     * @return static
     * @throws \Exception
     */
    public static function hydrateFromArray( array $data )
    {
        $reflection = new \ReflectionClass(static::class);

        return self::HydrateReflectionClassFromData($reflection, $data);
    }

	/**
	 * @param \ReflectionClass $reflection
	 * @param array $data
	 *
	 * @return mixed
	 * @throws \ReflectionException
	 */
	private static function HydrateReflectionClassFromData( \ReflectionClass $reflection, array $data)
	{
		$constructorParams = $reflection->getConstructor()->getParameters();

		$id = null;
		$values = [];
		$keys = [];

		foreach ($constructorParams as $constructorParam){

			if($constructorParam->getName() === 'id' and isset($data[$constructorParam->getName()])){
				$id = $data[$constructorParam->getName()];
			}

			if($constructorParam->getName() !== 'id'){
				$keys[] = $constructorParam->getName();

				if(isset($data[$constructorParam->getName()])){
					$value = $data[$constructorParam->getName()];
				} elseif ($constructorParam->allowsNull()) {
					$value = null;
				} else {
					throw new \DomainException('Wrong or missing parameters');
				}

				$class = ($constructorParam->getType() and !$constructorParam->getType()->isBuiltin()) ? new ReflectionClass($constructorParam->getType()->getName()) : null;

				if ($class and is_array($value)){
					$values[] = self::HydrateReflectionClassFromData($class, $value);
				} else {
					$values[] = $value;
				}
			}
		}

		unset($data['id']);

		$diff = array_diff(array_keys($data), $keys);
		if(!empty($diff)){
			//@TODO in prod log the error and return null??
			throw new \DomainException('Wrong or missing parameters');
		}

		$className = $reflection->getName();

		if(!$id){
			$id = Uuid::v4();
		}

		return new $className($id, ...$values);
	}

    /**
     * @param $id
     * @param $collection
     *
     * @return bool
     */
    protected function existsInCollection($id, $collection)
    {
        foreach ($collection as $item){
            if ($item->getId() === $id) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param $id
     * @param $collection
     */
    protected function removeFromCollection($id, $collection)
    {
        if($this->existsInCollection($id, $collection)){
            foreach ($collection as $index => $item){
                if ($id === $item->getId()) {
                    unset($collection[$index]);
                }
            }
        }
    }

	/**
	 * @return array
	 */
	protected function getConstants()
	{
		try {
			$oClass = new \ReflectionClass(static::class);

			return $oClass->getConstants();
		} catch (\Exception $exception){
			return [];
		}
	}

	/**
	 * @return mixed
	 * @throws \ReflectionException
	 */
	public function toStdObject()
	{
		$stdObject = json_decode(json_encode($this));

		return Objects::cast(\stdClass::class, $stdObject);
	}

	/**
	 * @return array
	 * @throws \ReflectionException
	 */
	public function toArray()
	{
		$stdClass = $this->toStdObject();

		return Objects::stdObjToArray($stdClass);
	}
}