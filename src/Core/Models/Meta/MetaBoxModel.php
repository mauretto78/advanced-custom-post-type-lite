<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class MetaBoxModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var MetaGroupModel
	 */
	private MetaGroupModel $group;

	/**
	 * @var string
	 */
	private string $name;

	/**
	 * @var string
	 */
	private ?string $label;

	/**
	 * @var int
	 */
	private int $sort;

	/**
	 * @var MetaFieldModel[]
	 */
	private array $fields = [];

	/**
	 * MetaBox constructor.
	 *
	 * @param string $id
	 * @param MetaGroupModel $group
	 * @param string $name
	 * @param int $sort
	 * @param string|null $label
	 */
	public function __construct(
		string $id,
		MetaGroupModel $group,
		string $name,
		int $sort,
		string $label = null
	) {
		parent::__construct($id);
		$this->group = $group;
		$this->name = $name;
		$this->label = $label;
		$this->sort = $sort;
		$this->fields = [];
	}

	/**
	 * @param MetaGroupModel $group
	 */
	public function changeGroup( MetaGroupModel $group )
	{
		$this->group = $group;
	}

	/**
	 * @return MetaGroupModel
	 */
	public function getGroup(): MetaGroupModel
	{
		return $this->group;
	}

	/**
	 * @param string $name
	 */
	public function changeName( $name )
	{
		$this->name = $name;
	}

	/**
	 * @return string
	 */
	public function getName(): string
	{
		return $this->name;
	}

	/**
	 * @return string
	 */
	public function getLabel(): ?string
	{
		return $this->label;
	}

	/**
	 * @return string
	 */
	public function getUiName(): string
	{
		if($this->getLabel()){
			return $this->getLabel();
		}

		return $this->getName();
	}

	/**
	 * @param string $label
	 */
	public function changeLabel( $label )
	{
		$this->label = $label;
	}

	/**
	 * @param $sort
	 */
	public function changeSort($sort)
	{
		$this->sort = $sort;
	}

	/**
	 * @return int
	 */
	public function getSort()
	{
		return $this->sort;
	}

	/**
	 * @return MetaFieldModel[]
	 */
	public function getFields(): array
	{
		return $this->fields;
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
	 * @param $fieldId
	 * @param MetaFieldModel[] $fields
	 *
	 * @return MetaFieldModel|null
	 */
	public function findAFieldById($fieldId, $fields = null): ?MetaFieldModel
	{
		$fields = $fields ?? $this->getFields();

		foreach($fields as $field) {
			if($field->getId() === $fieldId){
				return $field;
			}

			foreach ($field->getChildren() as $child){
				return $this->findAFieldById($child->getId(), $field->getChildren());
			}

			foreach ($field->getBlocks() as $block){
				foreach ($block->getFields() as $field){
					return $this->findAFieldById($field->getId(), $block->getFields());
				}
			}
		}

		return null;
	}

	/**
	 * @param $fieldName
	 * @param MetaFieldModel[] $fields
	 *
	 * @return MetaFieldModel|null
	 */
	public function findAFieldByName($fieldName, $fields = null): ?MetaFieldModel
	{
		$fields = $fields ?? $this->getFields();

		foreach($fields as $field) {
			if($field->getName() === $fieldName){
				return $field;
			}
		}

		return null;
	}

	/**
	 * @param $fieldName
	 * @param null $fields
	 */
	public function removeAField($fieldName, &$fields = null)
	{
		$fields = $fields ?? $this->getFields();

		foreach($fields as $fieldIndex => $field) {
			if($field->getName() === $fieldName){
				unset($fields[$fieldIndex]);
			}

			foreach ($field->getChildren() as $child){
				$fields = $field->getChildren();
				$this->removeAField($child->getName(), $fields);
			}

			foreach ($field->getBlocks() as $block){
				foreach ($block->getFields() as $field){
					$fields = $block->getFields();
					$this->removeAField($field->getName(), $fields);
				}
			}
		}

		$this->fields = $fields;
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
	 * @return MetaBoxModel
	 */
	public function duplicate(): MetaBoxModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicatedFields = $duplicate->getFields();
		$duplicate->fields = [];

		foreach ($duplicatedFields as $field){
			$duplicatedFieldModel = $field->duplicateFrom($duplicate);
			$duplicate->addField($duplicatedFieldModel);
		}

		return $duplicate;
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'UIName' => $this->getUiName(),
			'sort' => $this->getSort(),
			'fields' => $this->getFields(),
		];
	}

	/**
	 * @param string $format
	 *
	 * @return array
	 */
	public function arrayRepresentation(string $format = 'full'): array
	{
		if($format === 'mini'){
			return [
				'id' => $this->getId(),
				"name" => $this->getName(),
				"label" => $this->getLabel(),
				"UIName" => $this->getUIName(),
				"sort" => (int)$this->getSort(),
				"count" => count($this->getFields()),
			];
		}

		if($format === 'full'){

			$fieldsArray = [];

			foreach ($this->getFields() as $fieldModel){
				$fieldsArray[] = $fieldModel->arrayRepresentation($format);
			}

			return [
				"id" => $this->getId(),
				"name" => $this->getName(),
				"label" => $this->getLabel(),
				"UIName" => $this->getUIName(),
				"sort" => (int)$this->getSort(),
				"fields" => $fieldsArray
			];
		}
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
			'group' => [
				'required' => true,
				'type' => 'object',
				'instanceOf' => MetaGroupModel::class,
			],
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'new_name' => [
				'required' => false,
				'type' => 'string',
			],
			'UIName' => [
				'required' => false,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'fields' => [
				'required' => false,
				'type' => 'array',
			],
		];
	}
}