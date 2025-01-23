<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * MetaBoxFieldAdvancedOptionModel
 *
 * @since      1.0.170
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaFieldBlockModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var MetaFieldModel
	 */
	private MetaFieldModel $metaField;

	/**
	 * @var string
	 */
	protected string $name;

	/**
	 * @var string
	 */
	protected string $label;

	/**
	 * @var int
	 */
	protected int $sort;

	/**
	 * @var MetaFieldModel[]
	 */
	private array $fields = [];

	/**
	 * MetaBoxFieldBlockModel constructor.
	 *
	 * @param $id
	 * @param MetaFieldModel $metaField
	 * @param $name
	 * @param $sort
	 * @param null $label
	 */
	public function __construct(
		string $id,
		MetaFieldModel $metaField,
		string $name,
		int $sort,
		string $label = null
	)
	{
	    if(!Strings::alphanumericallyValid($name)){
		    throw new \DomainException($name . ' is not valid name');
	    }

		parent::__construct($id);
		$this->metaField = $metaField;
		$this->name      = $name;
		$this->sort      = $sort;
		$this->label     = $label;
		$this->fields    = [];
	}

	/**
	 * @param $name
	 * @param $sort
	 * @param null $label
	 */
	public function edit(
		$name,
		$sort,
		$label = null
	)
	{
	    if(!Strings::alphanumericallyValid($name)){
		    throw new \DomainException($name . ' is not valid name');
	    }

		$this->label    = $label;
		$this->name     = $name;
		$this->sort     = $sort;
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
	public function getName(): string
	{
		return $this->name;
	}

	/**
	 * @param string $name
	 */
	public function changeName( string $name )
	{
		$this->name = $name;
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
	public function getLabelOrName(): string
	{
		if($this->getLabel()){
			return $this->getLabel();
		}

		return $this->getName();
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @param MetaFieldModel $field
	 *
	 * @return bool
	 */
	public function hasField(MetaFieldModel $field): bool
	{
		return $this->existsInCollection($field->getId(), $this->fields);
	}

	/**
	 * @param MetaFieldModel $field
	 */
	public function addField(MetaFieldModel $field)
	{
		if(!$this->existsInCollection($field->getId(), $this->fields)){
			$this->fields[] = $field;
		}
	}

	/**
	 * @param MetaFieldModel $field
	 */
	public function removeField(MetaFieldModel $field)
	{
		$this->fields = $this->removeFromCollection($field->getId(), $this->fields);
	}

	/**
	 * @return MetaFieldModel[]|array
	 */
	public function getFields()
	{
		return $this->fields;
	}

	/**
	 * @param $name
	 *
	 * @return MetaFieldModel|null
	 */
	public function getField($name): ?MetaFieldModel
	{
		foreach ($this->getFields() as $child){
			if($name === $child->getName()){
				return $child;
			}
		}

		return null;
	}

	/**
	 * @param $index
	 * @param MetaFieldModel $fieldModel
	 */
	public function setField($index, MetaFieldModel $fieldModel): void
	{
		$this->fields[$index] = $fieldModel;
	}

	/**
	 * @param MetaFieldModel[] $fields
	 */
	public function setFields(array $fields)
	{
		$this->fields = $fields;
	}

	/**
	 * @return string
	 */
	public function getNormalizedName(): string
	{
		return Strings::toDBFormat($this->name);
	}

	/**
	 * @return string
	 */
	public function getUiName(): string
	{
		$name = (!empty($this->label)) ? $this->label : $this->name;

		return Strings::toHumanReadableFormat($this->getMetaField()->getBox()->getUILabel()) . ' - ' . Strings::toHumanReadableFormat($this->getMetaField()->getName()) . ' #' . Strings::toHumanReadableFormat($name);
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'groupId' => $this->getMetaField()->getBox()->getGroup()->getId(),
			'boxId' => $this->getMetaField()->getBox()->getId(),
			'fieldId' => $this->getMetaField()->getId(),
			'name' => $this->name,
			'label' => $this->label,
			'sort' => (int)$this->sort,
			'fields' => $this->fields
		];
	}

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldBlockModel
	 */
	public function duplicateFrom( MetaFieldModel $duplicateFrom ): MetaFieldBlockModel
	{
		$duplicate            = clone $this;
		$duplicate->id        = Uuid::v4();
		$duplicate->metaField = $duplicateFrom;

		foreach ($duplicate->getFields() as $index => $field){
			$childModel = $field->duplicateFromBlock($duplicate);
			$duplicate->setField($index, $childModel);
		}

		return $duplicate;
	}

	/**
	 * @return MetaFieldBlockModel
	 */
	public function duplicate()
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicatedFields = $duplicate->getFields();
		$duplicate->fields = [];

		foreach ($duplicatedFields as $field){
			$duplicatedFieldModel = $field->duplicate();
			$duplicate->addField($duplicatedFieldModel);
		}

		return $duplicate;
	}

	/**
	 * @param string $format
	 *
	 * @return array
	 */
	public function arrayRepresentation($format = 'full')
	{
		if($format === 'mini'){
			$metaArray[] = [
				"name" => $this->getName(),
				"count" => count($this->getFields()),
			];
		}

		$fieldsArray = [];

		foreach ($this->getFields() as $fieldModel){
			$fieldsArray[] = $fieldModel->arrayRepresentation();
		}

		return [
			'id' => $this->id,
			'groupId' => $this->getMetaField()->getBox()->getGroup()->getId(),
			'boxId' => $this->getMetaField()->getBox()->getId(),
			'fieldId' => $this->getMetaField()->getId(),
			'name' => $this->name,
			'label' => $this->label,
			'sort' => (int)$this->sort,
			'fields' => $fieldsArray
		];
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
			'groupId' => [
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
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'fields' => [
				'required' => false,
				'type' => 'array',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
		];
	}
}