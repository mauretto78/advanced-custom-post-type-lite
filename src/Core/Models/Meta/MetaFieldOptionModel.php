<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * MetaBoxFieldOptionModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaFieldOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

    /**
     * @var string
     */
    private string $label;

    /**
     * @var string
     */
    private string $value;

    /**
     * @var int
     */
    private int $sort;

	/**
	 * @var bool
	 */
    private bool $isDefault = false;

	/**
	 * MetaBoxFieldModel constructor.
	 *
	 * @param string $id
	 * @param MetaFieldModel $metaField
	 * @param string $label
	 * @param string $value
	 * @param int $sort
	 * @param bool $isDefault
	 */
    public function __construct(
        string $id,
        MetaFieldModel $metaField,
	    string $label,
	    string $value,
        int $sort,
		bool $isDefault = false
    ) {
        parent::__construct($id);
        $this->metaField = $metaField;
        $this->label = $label;
        $this->value = $value;
        $this->sort  = $sort;
        $this->isDefault  = $isDefault;
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
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

	/**
	 * @return bool
	 */
	public function isDefault(): bool
	{
		return $this->isDefault;
	}

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaField()->getBox()->getId(),
            'fieldId' => $this->getMetaField()->getId(),
            'label' => $this->label,
            'value' => $this->value,
            'sort' => (int)$this->sort,
            'isDefault' => $this->isDefault()
        ];
    }

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldOptionModel
	 */
	public function duplicateFrom( MetaFieldModel $duplicateFrom ): MetaFieldOptionModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
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
			'label' => [
				'required' => true,
				'type' => 'string',
			],
			'value' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'isDefault' => [
				'required' => false,
				'type' => 'boolean',
			],
		];
	}
}