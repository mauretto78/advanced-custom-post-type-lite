<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\MetaRepository;

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
	private ?string $label = null;

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
	 * @param $index
	 * @param MetaFieldModel $fieldModel
	 */
	public function setField($index, MetaFieldModel $fieldModel): void
	{
		$this->fields[$index] = $fieldModel;
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

    /**
     * @param MetaGroupModel $groupModel
     * @return MetaBoxModel
     */
    public function duplicateFrom(MetaGroupModel $groupModel): MetaBoxModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->group = $groupModel;
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), MetaRepository::getBoxNames()));
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
			'groupId' => $this->getGroup()->getId(),
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
				'groupId' => $this->getGroup()->getId(),
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
				'groupId' => $this->getGroup()->getId(),
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
			'groupId' => [
				'required' => false,
				'type' => 'string',
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