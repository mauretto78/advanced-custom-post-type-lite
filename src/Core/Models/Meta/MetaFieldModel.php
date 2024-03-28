<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class MetaFieldModel extends AbstractModel implements \JsonSerializable
{
	const DATE_TYPE = 'Date';
	const EMAIL_TYPE = 'Email';
	const SELECT_TYPE = 'Select';
	const TEXTAREA_TYPE = 'Textarea';
	const TEXT_TYPE = 'Text';

	/**
	 * @var MetaBoxModel
	 */
	private MetaBoxModel $box;

	/**
	 * @var string
	 */
	private string $name;

	/**
	 * @var string
	 */
	private ?string $label = null;

	/**
	 * @var string
	 */
	private string $type;

	/**
	 * @var string
	 */
	private ?string $defaultValue = null;

	/**
	 * @var string
	 */
	private ?string $description  = null;

	/**
	 * @var bool
	 */
	private bool $showInArchive = false;

	/**
	 * @var bool
	 */
	private bool $isRequired = false;

	/**
	 * @var bool
	 */
	private bool $quickEdit = false;

	/**
	 * @var bool
	 */
	private bool $filterableInAdmin = false;

	/**
	 * @var string|null
	 */
	private ?string $belongsToLabel = null;

	/**
	 * @var string|null
	 */
	private ?string $findLabel = null;

	/**
	 * @var int
	 */
	private int $sort;

	/**
	 * @var MetaFieldOptionModel[]
	 */
	private array $options = [];

	/**
	 * @var MetaFieldModel[]
	 */
	private array $children = [];

	/**
	 * @var string
	 */
	private ?string $parentId = null;

	/**
	 * @var string
	 */
	private ?string $blockId = null;

	/**
	 * MetaFieldModel constructor.
	 *
	 * @param string $id
	 * @param MetaBoxModel $box
	 * @param string $name
	 * @param string $type
	 * @param bool $showInArchive
	 * @param bool $isRequired
	 * @param int $sort
	 * @param string|null $defaultValue
	 * @param string|null $description
	 * @param string|null $label
	 *
	 * @throws \ReflectionException
	 */
	public function __construct(
		string $id,
		MetaBoxModel $box,
		string $name,
		string $type,
		bool $showInArchive,
		bool $isRequired,
		int $sort,
		?string $defaultValue = null,
		?string $description = null,
		?string $label = null
	) {
		parent::__construct($id);
		$this->box = $box;
		$this->name    = $name;
		$this->setType($type);
		$this->showInArchive        = $showInArchive;
		$this->isRequired           = $isRequired;
		$this->sort                 = $sort;
		$this->defaultValue         = $defaultValue;
		$this->description          = $description;
		$this->label                = $label;
		$this->options              = [];
		$this->children             = [];
	}

	/**
	 * @param MetaBoxModel $box
	 */
	public function changeBox(MetaBoxModel $box)
	{
		$this->box = $box;
	}

	/**
	 * @return MetaBoxModel
	 */
	public function getBox(): MetaBoxModel
	{
		return $this->box;
	}

	/**
	 * @param $name
	 */
	public function changeName($name)
	{
		if(!Strings::alphanumericallyValid($name)){
			throw new \DomainException($name . ' is not valid name');
		}

		$this->name = $name;
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return $this->name;
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
	 * @return string
	 */
	/**
	 * @return string
	 */
	public function getNormalizedName()
	{
		return Strings::toDBFormat($this->name);
	}

	/**
	 * @param $type
	 *
	 * @throws \ReflectionException
	 */
	private function setType($type)
	{
		if(!in_array($type, $this->getValidTypes())){
			throw new \DomainException($type . ' is not a valid field type for this meta box field');
		}

		$this->type = $type;
	}

	/**
	 * @return array
	 */
	public function getValidTypes(): array
	{
		return $this->getConstants();
	}

	/**
	 * @param $type
	 *
	 * @throws \ReflectionException
	 */
	public function changeType($type)
	{
		$this->setType($type);
	}

	/**
	 * @return string
	 */
	public function getType()
	{
		return $this->type;
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @return string|null
	 */
	public function getDefaultValue(): ?string
	{
		return $this->defaultValue;
	}

	/**
	 * @return string|null
	 */
	public function getDescription(): ?string
	{
		return $this->description;
	}

	/**
	 * @return string|null
	 */
	public function getLabel(): ?string
	{
		return $this->label;
	}

	/**
	 * @return bool
	 */
	public function isShowInArchive(): bool
	{
		return $this->showInArchive;
	}

	/**
	 * @return bool
	 */
	public function isRequired(): bool
	{
		return $this->isRequired;
	}

	/**
	 * @return bool
	 */
	public function isForQuickEdit(): bool
	{
		return $this->quickEdit;
	}

	/**
	 * @param bool $quickEdit
	 */
	public function setQuickEdit($quickEdit )
	{
		$this->quickEdit = $quickEdit;
	}

	/**
	 * @return bool
	 */
	public function isFilterableInAdmin(): bool
	{
		return $this->filterableInAdmin;
	}

	/**
	 * @param bool $filterableInAdmin
	 */
	public function setFilterableInAdmin($filterableInAdmin )
	{
		$this->filterableInAdmin = $filterableInAdmin;
	}

	/**
	 * @param MetaFieldOptionModel $option
	 */
	public function addOption(MetaFieldOptionModel $option)
	{
		if(!$this->existsInCollection($option->getId(), $this->options)){
			$this->options[] = $option;
		}
	}

	/**
	 * @param MetaFieldOptionModel $option
	 */
	public function removeOption(MetaFieldOptionModel $option)
	{
		$this->options = $this->removeFromCollection($option->getId(), $this->options);
	}

	/**
	 * Clear all options
	 */
	public function clearOptions()
	{
		$this->options = [];
	}

	/**
	 * @return MetaFieldOptionModel[]
	 */
	public function getOptions()
	{
		return $this->options;
	}

	/**
	 * @return array
	 */
	public function getOptionValues()
	{
		$values = [];

		foreach ($this->getOptions() as $option){
			$values[] = $option->getValue();
		}

		return $values;
	}

	/**
	 * @param $value
	 *
	 * @return string|null
	 */
	public function getOptionLabel($value)
	{
		if(empty($this->getOptions())){
			return null;
		}

		foreach ($this->getOptions() as $option){
			if($option->getValue() === $value){
				return $option->getLabel();
			}
		}

		return null;
	}

	/**
	 * @return bool
	 */
	public function hasChildren()
	{
		return !empty($this->children);
	}

	/**
	 * @param MetaFieldModel $field
	 */
	public function addChild(MetaFieldModel $field)
	{
		if(!$this->existsInCollection($field->getId(), $this->children)){
			$this->children[] = $field;
		}
	}

	/**
	 * @param MetaFieldModel $field
	 */
	public function removeChild(MetaFieldModel $field)
	{
		$this->children = $this->removeFromCollection($field->getId(), $this->children);
	}

	/**
	 * Clear all children
	 */
	public function clearChildren()
	{
		$this->children = [];
	}

	/**
	 * @return MetaFieldModel[]
	 */
	public function getChildren(): array
	{
		return $this->children;
	}

	/**
	 * @param $name
	 *
	 * @return MetaFieldModel|null
	 */
	public function getChild($name): ?MetaFieldModel
	{
		foreach ($this->getChildren() as $child){
			if($name === $child->getName()){
				return $child;
			}
		}

		return null;
	}

	/**
	 * @param string $parentId
	 */
	public function setParentId( $parentId )
	{
		$this->parentId = $parentId;
	}

	/**
	 * @return string
	 */
	public function getParentId(): ?string
	{
		return $this->parentId;
	}

	/**
	 * @return MetaFieldModel|null
	 */
	public function getParentField(): ?MetaFieldModel
	{
		if(!$this->hasParent()){
			return null;
		}

		return $this->getBox()->findAFieldById($this->getParentId());
	}

	/**
	 * @return bool
	 */
	public function hasParent(): bool
	{
		return $this->getParentId() !== null;
	}

	/**
	 * @return string
	 */
	public function getDbName()
	{
		return Strings::toDBFormat($this->getBox()->getName()).'_'.Strings::toDBFormat($this->name);
	}

	/**
	 * @return string
	 */
	public function getUiName()
	{
		$uiName = Strings::toHumanReadableFormat($this->getBox()->getUiName()) . ' - ' . Strings::toHumanReadableFormat($this->name);

		if($this->getParentId()){
			$uiName .= ' [children]';
		}

		return $uiName;
	}

	/**
	 * @return MetaFieldModel
	 */
	public function duplicate(): MetaFieldModel
	{
		return $this->duplicateFrom($this->getBox());
	}

	/**
	 * @param MetaBoxModel $duplicateFrom
	 *
	 * @return MetaFieldModel
	 */
	public function duplicateFrom(MetaBoxModel $duplicateFrom): MetaFieldModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->box = $duplicateFrom;

		$duplicatedOptions = $duplicate->getOptions();

		$duplicatedChildren = $duplicate->getChildren();

		$duplicate->options = [];
		$duplicate->children = [];

		foreach ($duplicatedOptions as $option){
			$optionFieldModel = $option->duplicateFrom($duplicate);
			$duplicate->addOption($optionFieldModel);
		}

		foreach ($duplicatedChildren as $child){
			$childModel = $child->duplicateFromParent($duplicate);
			$duplicate->addChild($childModel);
		}

		return $duplicate;
	}

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldModel
	 */
	public function duplicateFromParent(MetaFieldModel $duplicateFrom): MetaFieldModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->parentId = $duplicateFrom->getId();

		return $duplicate;
	}

	/**
	 * @return string
	 */
	public function getGroup(): ?string
	{
		return 'basic';
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'boxId' => $this->getBox()->getId(),
			'boxName' => $this->getBox()->getName(),
			'db_name' => $this->getDbName(),
			'ui_name' => $this->getUiName(),
			'name' => $this->name,
			'label' => $this->label,
			'type' => $this->type,
			'group' => $this->getGroup(),
			'belongsToLabel' => $this->getBelongsToLabel(),
			'findLabel' => $this->getFindLabel(),
			'defaultValue' => $this->defaultValue,
			'description' => $this->description,
			'isRequired' => (bool)$this->isRequired,
			'showInArchive' => (bool)$this->showInArchive,
			'quickEdit' => (bool)$this->quickEdit,
			'filterableInAdmin' => (bool)$this->filterableInAdmin,
			'sort' => (int)$this->sort,
			'options' => $this->options,
			'hasChildren' => $this->hasChildren(),
			'children' => $this->getChildren(),
			'parentId' => $this->getParentId(),
			'parentName' => ($this->hasParent() ? $this->getParentField()->getName() : null),
		];
	}

	/**
	 * @param MetaBoxModel $box
	 * @param $fieldIndex
	 * @param $data
	 * @param $arrayOfFieldNames
	 * @param $arrayOfBlockNames
	 *
	 * @return MetaFieldModel
	 * @throws \Exception
	 */
	public static function fullHydrateFromArray(MetaBoxModel $box, $fieldIndex, $data, &$arrayOfFieldNames, &$arrayOfBlockNames)
	{
		$fieldModel = self::hydrateFromArray([
			'id' => (isset($data["id"]) ? $data["id"] : Uuid::v4()),
			'box' => $box,
		    'name' => $data['name'],
		    'label' => $data['label'] ?? null,
		    'type' => $data['type'],
			'sort' => ($fieldIndex+1),
			'showInArchive' => $data['showInArchive'] ?? $data['show_in_archive'] ?? false,
			'isRequired' => $data['isRequired'] ?? $data['is_required'] ?? false,
		    'defaultValue' => $data['defaultValue'] ?? $data['default_value'] ?? null,
		    'description' => $data['description'] ?? null,
		]);

		$fieldModel->changeName(Strings::getTheFirstAvailableName($fieldModel->getName(), $arrayOfFieldNames));
		$arrayOfFieldNames[] = $fieldModel->getName();

		if(isset($data['parentId']) and !empty($data['parentId']) and (!isset($data['blockId']) or empty($data['blockId']))){
			$fieldModel->setParentId($data['parentId']);
		}

		if(isset($data['parent_id']) and !empty($data['parent_id']) and (!isset($data['block_id']) or empty($data['block_id']))){
			$fieldModel->setParentId($data['parent_id']);
		}

		if(isset($data['quickEdit'])){
			$fieldModel->setQuickEdit($data['quickEdit']);
		}

		if(isset($data['quick_edit'])){
			$fieldModel->setQuickEdit($data['quick_edit']);
		}

		if(isset($data['filterableInAdmin'])){
			$fieldModel->setFilterableInAdmin($data['filterableInAdmin']);
		}

		if(isset($data['filterable_in_admin'])){
			$fieldModel->setFilterableInAdmin($data['filterable_in_admin']);
		}

		if(isset($data['options']) and is_array($data['options'])){
			foreach ($data['options'] as $indexOption => $option){

				$optionModel = MetaFieldOptionModel::hydrateFromArray([
					'id' => (isset($option["id"]) ? $option["id"] : Uuid::v4()),
					'metaField' => $fieldModel,
					'label' => @$option['label'],
					'value' => @$option['value'],
					'isDefault' => @$option['isDefault'],
					'sort' => ($indexOption+1),
				]);

				$fieldModel->addOption($optionModel);
			}
		}

		if(isset($data['children']) and is_array($data['children'])){
			foreach ($data['children'] as $childIndex => $child){
				$child['parentId'] = $fieldModel->getId();
				$childModel = self::fullHydrateFromArray($box, $childIndex, $child, $arrayOfFieldNames, $arrayOfBlockNames);
				$fieldModel->addChild($childModel);
			}
		}

		return $fieldModel;
	}

	/**
	 * @return string|null
	 */
	public function getBelongsToLabel(): ?string {
		return $this->belongsToLabel;
	}

	/**
	 * @param string|null $belongsToLabel
	 */
	public function setBelongsToLabel( ?string $belongsToLabel ): void
	{
		$this->belongsToLabel = $belongsToLabel;
	}

	/**
	 * @return string|null
	 */
	public function getFindLabel(): ?string {
		return $this->findLabel;
	}

	/**
	 * @param string|null $findLabel
	 */
	public function setFindLabel( ?string $findLabel ): void
	{
		$this->findLabel = $findLabel;
	}

	/**
	 * @param string $format
	 *
	 * @return array
	 */
	public function arrayRepresentation(string $format = 'full'): array
	{
		$childrenArray = [];
		$optionsArray = [];

		foreach ($this->getChildren() as $childModel){
			$childrenArray[] = $childModel->arrayRepresentation();
		}

		foreach ($this->getOptions() as $optionModel){
			$optionsArray[] = [
				'id' => $optionModel->getId(),
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
				'sort' => (int)$optionModel->getSort(),
			];
		}

		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'type' => $this->getType(),
			'belongsToLabel' => $this->getBelongsToLabel(),
			'findLabel' => $this->getFindLabel(),
			'defaultValue' => $this->getDefaultValue(),
			'description' => $this->getDescription(),
			'showInArchive' => (bool)$this->isShowInArchive(),
			'isRequired' => (bool)$this->isRequired(),
			'sort' => (int)$this->getSort(),
			'options' => $optionsArray,
			'children' => $childrenArray,
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
			'box' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => MetaBoxModel::class
			],
			'boxId' => [
				'required' => false,
				'type' => 'string',
			],
			'boxName' => [
				'required' => false,
				'type' => 'string',
			],
			'db_name' => [
				'required' => false,
				'type' => 'string',
			],
			'ui_name' => [
				'required' => false,
				'type' => 'string',
			],
			'UIName' => [
				'required' => false,
				'type' => 'string',
			],
			'fieldsCount' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'new_name' => [
				'required' => false,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'type' => [
				'required' => true,
				'type' => 'string',
				'enum' => [
					MetaFieldModel::DATE_TYPE,
					MetaFieldModel::EMAIL_TYPE,
					MetaFieldModel::SELECT_TYPE,
					MetaFieldModel::TEXT_TYPE,
					MetaFieldModel::TEXTAREA_TYPE,
				],
			],
			'blockId' => [
				'required' => false,
				'type' => 'string',
			],
			'blockName' => [
				'required' => false,
				'type' => 'string',
			],
			'parentId' => [
				'required' => false,
				'type' => 'string',
			],
			'parentName' => [
				'required' => false,
				'type' => 'string',
			],
			'showInArchive' => [
				'required' => false,
				'type' => 'boolean',
			],
			'required' => [
				'required' => false,
				'type' => 'boolean',
			],
			'isRequired' => [
				'required' => false,
				'type' => 'boolean',
			],
			'quickEdit' => [
				'required' => false,
				'type' => 'boolean',
			],
			'filterableInAdmin' => [
				'required' => false,
				'type' => 'boolean',
			],
			'defaultValue' => [
				'required' => false,
				'type' => 'string',
			],
			'description' => [
				'required' => false,
				'type' => 'string',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'hasManyRelation' => [
				'required' => false,
				'type' => 'boolean',
			],
			'hasChildren' => [
				'required' => false,
				'type' => 'boolean',
			],
			'isATextualField' => [
				'required' => false,
				'type' => 'boolean',
			],
			'isFilterable' => [
				'required' => false,
				'type' => 'boolean',
			],
			'advancedOptions' => [
				'required' => false,
				'type' => 'array',
			],
			'options' => [
				'required' => false,
				'type' => 'array',
			],
			'validationRules' => [
				'required' => false,
				'type' => 'array',
			],
			'relations' => [
				'required' => false,
				'type' => 'array',
			],
			'visibilityConditions' => [
				'required' => false,
				'type' => 'array',
			],
			'children' => [
				'required' => false,
				'type' => 'array',
			],
			'blocks' => [
				'required' => false,
				'type' => 'array',
			],
			'isSaved' => [
				'required' => false,
				'type' => 'boolean',
			],
			'belongsToLabel' => [
				'required' => false,
				'type' => 'string',
			],
			'findLabel' => [
				'required' => false,
				'type' => 'string',
			],
			'group' => [
				'required' => false,
				'type' => 'string',
			],
		];
	}
}