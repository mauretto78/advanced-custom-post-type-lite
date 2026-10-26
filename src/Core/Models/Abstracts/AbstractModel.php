<?php

namespace ACPT_Lite\Core\Models\Abstracts;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Traits\CollectionsTrait;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Utils\PHP\Objects;
use ReflectionClass;

/**
 * AbstractModel
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractModel
{
    use CollectionsTrait;

    /**
     * @var string
     */
    protected string $id;

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * AbstractModel constructor.
     *
     * @param string $id
     */
    public function __construct(string $id)
    {
        $this->id = $id;
    }

    /**
     * Hydrate an entity from an array of params
     *
     * @param array<string, mixed> $data
     *
     * @return static
     * @throws \Exception
     */
    public static function hydrateFromArray(array $data): AbstractModel
    {
        /** @var \ReflectionClass<static> $reflection */
        $reflection = new \ReflectionClass(static::class);
        $validator = new ArgumentsArrayValidator();
        $rules = static::validationRules();

        // An empty XML leaf element (e.g. <description></description>) is
        // indistinguishable from an empty *array* once round-tripped through
        // XMLFormatter::xmlToArray() - both become []. For a key whose
        // schema only allows 'string' (not 'array'), an empty array is
        // unambiguously meant to be an empty string, so coerce it back
        // before validating/hydrating instead of failing import.
        foreach ($rules as $key => $rule) {
            if (($data[$key] ?? null) === [] && trim((string)($rule['type'] ?? '')) === 'string') {
                $data[$key] = '';
            }
        }

        if (!$validator->validate($rules, $data)) {
            throw new \InvalidArgumentException($validator->errorMessage());
        }

        return self::HydrateReflectionClassFromData($reflection, $data);
    }

    /**
     * @param \ReflectionClass<object>     $reflection
     * @param array<string, mixed> $data
     *
     * @return mixed
     * @throws \ReflectionException
     */
    private static function HydrateReflectionClassFromData(\ReflectionClass $reflection, array $data)
    {
        $constructorParams = $reflection->getConstructor()->getParameters();

        $id = null;
        $values = [];
        $keys = [];

        foreach ($constructorParams as $constructorParam) {
            if ($constructorParam->getName() === 'id' && isset($data[$constructorParam->getName()])) {
                $id = $data[$constructorParam->getName()];
            }

            if ($constructorParam->getName() !== 'id') {
                $keys[] = $constructorParam->getName();

                if (isset($data[$constructorParam->getName()])) {
                    $value = $data[$constructorParam->getName()];
                } elseif ($constructorParam->allowsNull()) {
                    $value = null;
                } else {
                    throw new \DomainException(static::class . ': wrong or missing parameter [' . $constructorParam->getName(). ']');
                }

                $type = $constructorParam->getType();
                $class = null;

                if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                    /** @var class-string $typeName */
                    $typeName = $type->getName();
                    $class = new ReflectionClass($typeName);
                }

                if ($class && is_array($value)) {
                    $values[] = self::HydrateReflectionClassFromData($class, $value);
                } else {
                    $values[] = $value;
                }
            }
        }

        unset($data['id']);

        $diff = array_diff(array_keys($data), $keys);
        if (!empty($diff)) {
            //@TODO in prod log the error and return null??
            throw new \DomainException('Wrong or missing parameters' . print_r($diff, true));
        }

        $className = $reflection->getName();

        if (!$id) {
            $id = Uuid::v4();
        }

        return new $className($id, ...$values);
    }

    /**
     * @param AbstractModel $model
     *
     * @return bool
     */
    public function isEqualsTo(AbstractModel $model): bool
    {
        return $this->getId() === $model->getId();
    }

    /**
     * @return array<string, mixed>
     */
    protected function getConstants(): array
    {
        try {
            $oClass = new \ReflectionClass(static::class);

            return $oClass->getConstants();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }

    /**
     * @return \stdClass
     * @throws \ReflectionException
     */
    public function toStdObject(): \stdClass
    {
        $stdObject = json_decode(json_encode($this) ?: 'null');

        return Objects::cast(\stdClass::class, $stdObject);
    }

    /**
     * @return array<mixed>
     * @throws \ReflectionException
     */
    public function toArray(): array
    {
        $stdClass = $this->toStdObject();

        return Objects::stdObjToArray($stdClass);
    }

    /**
     * @return array<string, mixed>
     */
    abstract public static function validationRules(): array;
}
