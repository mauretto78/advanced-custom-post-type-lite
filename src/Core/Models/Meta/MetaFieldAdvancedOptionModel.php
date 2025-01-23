<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * MetaBoxFieldAdvancedOptionModel
 *
 * @since      1.0.130
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaFieldAdvancedOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

    /**
     * @var string
     */
    private string $key;

    /**
     * @var string
     */
    private string $value;

    /**
     * MetaBoxFieldModel constructor.
     *
     * @param string         $id
     * @param MetaFieldModel $metaField
     * @param string         $key
     * @param string         $value
     */
    public function __construct(
        $id,
	    MetaFieldModel $metaField,
        $key,
        $value = null
    ) {
        parent::__construct($id);
        $this->metaField = $metaField;
        $this->key       = $key;
        $this->value     = $value ?? '';
    }

    /**
     * @return MetaFieldModel
     */
    public function getMetaField(): MetaFieldModel
    {
        return $this->metaField;
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

	/**
	 * @return mixed|string
	 */
    public function getUnserializedValue()
    {
	    if(is_serialized($this->value)){
		    return unserialize($this->value);
	    }

	    return $this->value;
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaField()->getBox()->getId(),
            'fieldId' => $this->getMetaField()->getId(),
            'key' => $this->getKey(),
            'value' => $this->getUnserializedValue(),
        ];
    }

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldAdvancedOptionModel
	 */
	public function duplicateFrom( MetaFieldModel $duplicateFrom ): MetaFieldAdvancedOptionModel
	{
		$duplicate            = clone $this;
		$duplicate->id        = Uuid::v4();
		$duplicate->metaField = $duplicateFrom;

		return $duplicate;
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'boxId' => [
				'required' => false,
				'type' => 'string',
			],
			'fieldId' => [
				'required' => false,
				'type' => 'string',
			],
			'metaField' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => MetaFieldModel::class
			],
			'key' => [
				'required' => true,
				'type' => 'string',
			],
			'value' => [
				'required' => true,
				'type' => 'string|integer',
			],
		];
	}
}