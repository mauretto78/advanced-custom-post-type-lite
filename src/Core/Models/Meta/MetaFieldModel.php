<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Permission\PermissionModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Traits\PermissionTrait;
use ACPT_Lite\Core\ValueObjects\RelatedEntityValueObject;
use ACPT_Lite\Utils\PHP\JSON;
use ACPT_Lite\Utils\Wordpress\Translator;

class MetaFieldModel extends AbstractModel implements \JsonSerializable
{
	use PermissionTrait;

	const ADDRESS_TYPE = 'Address';
	const ADDRESS_MULTI_TYPE = 'AddressMulti';
	const CHECKBOX_TYPE = 'Checkbox';
	const CLONE_TYPE = 'Clone';
	const COLOR_TYPE = 'Color';
	const COUNTRY_TYPE = 'Country';
	const CURRENCY_TYPE = 'Currency';
	const DATE_TYPE = 'Date';
	const DATE_RANGE_TYPE = 'DateRange';
	const DATE_TIME_TYPE = 'DateTime';
	const EDITOR_TYPE = 'Editor';
	const EMAIL_TYPE = 'Email';
	const EMBED_TYPE = 'Embed';
	const FILE_TYPE = 'File';
	const FLEXIBLE_CONTENT_TYPE = 'FlexibleContent';
	const GALLERY_TYPE = 'Gallery';
	const HTML_TYPE = 'HTML';
	const ICON_TYPE = 'Icon';
	const IMAGE_TYPE = 'Image';
	const LENGTH_TYPE = 'Length';
	const LIST_TYPE = 'List';
	const NUMBER_TYPE = 'Number';
	const PASSWORD_TYPE = 'Password';
	const PHONE_TYPE = 'Phone';
	const POST_TYPE = 'Post';
	const POST_OBJECT_TYPE = 'PostObject';
	const POST_OBJECT_MULTI_TYPE = 'PostObjectMulti';
	const RADIO_TYPE = 'Radio';
	const RANGE_TYPE = 'Range';
	const RATING_TYPE = 'Rating';
	const REPEATER_TYPE = 'Repeater';
	const SELECT_TYPE = 'Select';
	const SELECT_MULTI_TYPE = 'SelectMulti';
	const TABLE_TYPE = 'Table';
	const TERM_OBJECT_TYPE = 'TermObject';
	const TERM_OBJECT_MULTI_TYPE = 'TermObjectMulti';
	const TEXTAREA_TYPE = 'Textarea';
	const TEXT_TYPE = 'Text';
	const TIME_TYPE = 'Time';
	const TOGGLE_TYPE = 'Toggle';
	const URL_TYPE = 'Url';
	const USER_TYPE = 'User';
	const USER_MULTI_TYPE = 'UserMulti';
	const VIDEO_TYPE = 'Video';
	const WEIGHT_TYPE = 'Weight';

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
	 * @var MetaFieldAdvancedOptionModel[]
	 */
	private array $advancedOptions = [];

	/**
	 * @var MetaFieldOptionModel[]
	 */
	private array $options = [];

	/**
	 * @var MetaFieldRelationshipModel[]
	 */
	private array $relations = [];

	/**
	 * @var MetaFieldVisibilityModel[]
	 */
	private array $visibilityConditions = [];

	/**
	 * @var ValidationRuleModel[]
	 */
	private array $validationRules = [];
	
	/**
	 * @var MetaFieldModel[]
	 */
	private array $children = [];

	/**
	 * @var MetaFieldBlockModel[]
	 */
	private array $blocks = [];

	/**
	 * @var string
	 */
	private ?string $parentId = null;

	/**
	 * @var string
	 */
	private ?string $blockId = null;

    /**
     * @var MetaFieldModel
     */
    private $forgedBy = null;

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
		$defaultValue = null,
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
		$this->defaultValue         = (is_array($defaultValue)) ? json_encode($defaultValue) : $defaultValue;
		$this->description          = $description;
		$this->label                = $label;
		$this->advancedOptions      = [];
		$this->options              = [];
		$this->relations            = [];
		$this->visibilityConditions = [];
		$this->validationRules      = [];
		$this->children             = [];
		$this->blocks               = [];
		$this->permissions          = [];
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
	public function setQuickEdit($quickEdit)
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
	 * @param ValidationRuleModel $rule
	 */
	public function addValidationRule(ValidationRuleModel $rule)
	{
		if(!$this->existsInCollection($rule->getId(), $this->validationRules)){
			$this->validationRules[] = $rule;
		}
	}

	/**
	 * @param ValidationRuleModel $rule
	 */
	public function removeValidationRule(ValidationRuleModel $rule)
	{
		$this->validationRules = $this->removeFromCollection($rule->getId(), $this->validationRules);
	}

	/**
	 * Clear all validation rules
	 */
	public function clearValidationRules()
	{
		$this->validationRules = [];
	}

	/**
	 * @return ValidationRuleModel[]
	 */
	public function getValidationRules()
	{
		return $this->validationRules;
	}

	/**
	 * @param MetaFieldAdvancedOptionModel $option
	 */
	public function addAdvancedOption(MetaFieldAdvancedOptionModel $option)
	{
		if(!$this->existsInCollection($option->getId(), $this->advancedOptions)){
			$this->advancedOptions[] = $option;
		}
	}

	/**
	 * @param MetaFieldAdvancedOptionModel $option
	 */
	public function removeAdvancedOption(MetaFieldAdvancedOptionModel $option)
	{
		$this->advancedOptions = $this->removeFromCollection($option->getId(), $this->advancedOptions);
	}

	/**
	 * Clear all advanced options
	 */
	public function clearAdvancedOptions()
	{
		$this->advancedOptions = [];
	}

	/**
	 * @return MetaFieldAdvancedOptionModel[]
	 */
	public function getAdvancedOptions()
	{
		$sortingMap = [
			0 => "uom_default_value",
			1 => "headline",
			2 => "width",
			3 => "columns",
			4 => "hide_blank_radio",
			5 => "hide_url_label",
			6 => "before",
			7 => "after",
			8 => "min",
			9 => "max",
			10 => "step",
			11 => "pattern",
			12 => "minimum_blocks",
			13 => "maximum_blocks",
			14 => "accepts",
			15 => "multiple",
			16 => "max_size",
			17 => "min_size",
			18 => "css",
			19 => "leading_field",
			20 => "layout",
			21 => "filter_post_type",
			22 => "filter_post_status",
			23 => "filter_taxonomy",
			24 => "filter_role",
			25 => "cols",
			26 => "rows",
			27 => "date_format",
			28 => "time_format",
			29 => "vertical_alignment",
			30 => "sync_taxonomy",
			31 => "set_thumbnail",
            32 => "algorithm",
		];

		$sortedAdvancedOptions = [];

		foreach ($sortingMap as $index => $key){
			if($this->getAdvancedOptionModel($key)){
				$sortedAdvancedOptions[$index] = $this->getAdvancedOptionModel($key);
			}
		}

		return $sortedAdvancedOptions;
	}

	/**
	 * @param $key
	 *
	 * @return mixed|null
	 */
	public function getAdvancedOptionModel($key)
	{
		foreach ($this->advancedOptions as $advancedOption){
			if ($advancedOption->getKey() === $key) {
				return $advancedOption;
			}
		}

		return null;
	}

	/**
	 * @param $key
	 *
	 * @return mixed|null
	 */
	public function getAdvancedOption($key)
	{
		foreach ($this->advancedOptions as $advancedOption){
			if ($advancedOption->getKey() === $key and $advancedOption->getValue() !== '') {
				return $advancedOption->getValue();
			}
		}

		return null;
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
				return Translator::translateString($option->getLabel());
			}
		}

		return null;
	}

	/**
	 * @param MetaFieldRelationshipModel $relation
	 */
	public function addRelation(MetaFieldRelationshipModel $relation)
	{
		if(!$this->existsInCollection($relation->getId(), $this->relations)){
			$this->relations[] = $relation;
		}
	}

	/**
	 * @param MetaFieldRelationshipModel $relation
	 */
	public function removeRelation(MetaFieldRelationshipModel $relation)
	{
		$this->relations = $this->removeFromCollection($relation->getId(), $this->relations);
	}

	/**
	 * Clear all relations
	 */
	public function clearRelations()
	{
		$this->relations = [];
	}

	/**
	 * @return MetaFieldRelationshipModel[]
	 */
	public function getRelations()
	{
		return $this->relations;
	}

	/**
	 * @return bool
	 */
	public function hasManyRelation()
	{
		if(empty($this->relations)){
			return false;
		}

		/** @var MetaFieldRelationshipModel $relation */
		foreach ($this->relations as $relation){
			if($relation->isMany()){
				return true;
			}
		}

		return false;
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
	 * @param $index
	 * @param MetaFieldModel $fieldModel
	 */
	public function setChild($index, MetaFieldModel $fieldModel): void
	{
		$this->children[$index] = $fieldModel;
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

		foreach ($this->getBlocks() as $block){
			foreach ($block->getFields() as $child){
				if($name === $child->getName()){
					return $child;
				}
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
	public function getRootParentField(): ?MetaFieldModel
	{
		if(!$this->hasParent()){
			return null;
		}

		$parent = $this->getParentField();

		if($parent === null){
			return null;
		}

		if($parent->hasParent()){
			return $parent->getParentField();
		}

		return $parent;
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
	 * @return bool
	 */
	public function hasParentBlock(): bool
	{
		return $this->getBlockId() !== null;
	}

	/**
	 * @return string
	 */
	public function getBlockId(): ?string
	{
		return $this->blockId;
	}

	/**
	 * @param ?string $blockId
	 */
	public function setBlockId( ?string $blockId )
	{
		$this->blockId = $blockId;
	}

	/**
	 * @param $name
	 *
	 * @return MetaFieldBlockModel|null
	 */
	public function getBlock($name): ?MetaFieldBlockModel
	{
		if(!$this->hasBlocks()){
			return null;
		}

		foreach ($this->getBlocks() as $blockModel){
			if($blockModel->getName() === $name){
				return $blockModel;
			}
		}

		return null;
	}

	/**
	 * @return MetaFieldBlockModel[]
	 */
	public function getBlocks(): array
	{
		return $this->blocks;
	}

	/**
	 * @param $index
	 * @param MetaFieldBlockModel $blockModel
	 */
	public function setBlock($index, MetaFieldBlockModel $blockModel): void
	{
		$this->blocks[$index] = $blockModel;
	}

	/**
	 * @param MetaFieldBlockModel $block
	 */
	public function addBlock(MetaFieldBlockModel $block)
	{
		if(!$this->existsInCollection($block->getId(), $this->blocks)){
			$this->blocks[] = $block;
		}
	}

	/**
	 * @param MetaFieldBlockModel $block
	 */
	public function removeBlock(MetaFieldBlockModel $block)
	{
		$this->blocks = $this->removeFromCollection($block->getId(), $this->blocks);
	}

	/**
	 * @return bool
	 */
	public function isNestedInABlock(): bool
	{
		return $this->getBlockId() !== null;
	}

	/**
	 * @return MetaFieldBlockModel|null
	 */
	public function getParentBlock(): ?MetaFieldBlockModel
	{
		if(!$this->isNestedInABlock()){
			return null;
		}

		foreach ($this->getBox()->getFields() as $field){
			foreach ($field->getBlocks() as $blockModel) {
				if($this->getBlockId() === $blockModel->getId()){
					return $blockModel;
				}
			}
		}

		return null;
	}

	/**
	 * @return bool
	 */
	public function hasBlocks(): bool
	{
		return !empty($this->blocks);
	}

	/**
	 * @param MetaFieldVisibilityModel $condition
	 */
	public function addVisibilityCondition(MetaFieldVisibilityModel $condition)
	{
		if(!$this->existsInCollection($condition->getId(), $this->visibilityConditions)){
			$this->visibilityConditions[] = $condition;
		}
	}

	/**
	 * @param MetaFieldVisibilityModel $condition
	 */
	public function removeVisibilityCondition(MetaFieldVisibilityModel $condition)
	{
		$this->visibilityConditions = $this->removeFromCollection($condition->getId(), $this->visibilityConditions);
	}

	/**
	 * Clear all visibility conditions
	 */
	public function clearVisibilityConditions()
	{
		$this->visibilityConditions = [];
	}

	/**
	 * @return MetaFieldVisibilityModel[]
	 */
	public function getVisibilityConditions(): array
	{
		return $this->visibilityConditions;
	}

	/**
	 * @return bool
	 */
	public function hasVisibilityConditions(): bool
	{
		return count($this->visibilityConditions) > 0;
	}

    /**
     * Get the parent clone field
     *
     * @return MetaFieldModel|null
     */
    public function getForgedBy(): ?MetaFieldModel
    {
        return $this->forgedBy ?? null;
    }

	/**
	 * @return bool
	 */
	public function isATextualField(): bool
	{
		$textualTypes = [
			self::CHECKBOX_TYPE,
			self::COLOR_TYPE,
			self::RADIO_TYPE,
			self::SELECT_TYPE,
			self::SELECT_MULTI_TYPE,
			self::EMAIL_TYPE,
			self::NUMBER_TYPE,
			self::RANGE_TYPE,
			self::PHONE_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
		];

		return in_array($this->type, $textualTypes);
	}

	/**
	 * @return bool
	 */
	public function canBeQuickEdited(): bool
	{
		$textualTypes = [
			self::CHECKBOX_TYPE,
			self::COLOR_TYPE,
			self::RADIO_TYPE,
			self::SELECT_TYPE,
			self::SELECT_MULTI_TYPE,
			self::EMAIL_TYPE,
			self::NUMBER_TYPE,
			self::RANGE_TYPE,
			self::PASSWORD_TYPE,
			self::PHONE_TYPE,
			self::POST_OBJECT_TYPE,
			self::POST_OBJECT_MULTI_TYPE,
			self::TERM_OBJECT_TYPE,
			self::TERM_OBJECT_MULTI_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::USER_TYPE,
			self::USER_MULTI_TYPE,
		];

		return in_array($this->type, $textualTypes);
	}

	/**
	 * @return bool
	 */
	public function isFilterable(): bool
	{
		$filterableTypes = [
			self::COLOR_TYPE,
			self::DATE_TYPE,
			self::DATE_TIME_TYPE,
			self::EMAIL_TYPE,
			self::NUMBER_TYPE,
			self::RANGE_TYPE,
			self::PHONE_TYPE,
			self::RADIO_TYPE,
			self::SELECT_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
		];

		return in_array($this->type, $filterableTypes);
	}

	/**
	 * @return string
	 */
	public function getDbName()
	{
		$dbName = '';

		if($this->getBelongsToLabel() === MetaTypes::OPTION_PAGE and $this->getFindLabel() !== null){
			$dbName .= Strings::toDBFormat($this->getFindLabel()). '_';
		}

		$dbName .= Strings::toDBFormat($this->getBox()->getName()).'_'.Strings::toDBFormat($this->name);

		return $dbName;
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
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), MetaRepository::getFieldNames()));

		$duplicatedOptions = $duplicate->getOptions();
		$duplicatedAdvancedOptions = $duplicate->getAdvancedOptions();
		$duplicatedChildren = $duplicate->getChildren();
		$duplicatedVisibilityConditions = $duplicate->getVisibilityConditions();
		$duplicatedBlocks = $duplicate->getBlocks();
		$validationRules = $duplicate->getValidationRules();
		$duplicatedRelations = $duplicate->getRelations();

		$duplicate->options = [];
		$duplicate->advancedOptions = [];
		$duplicate->relations = [];
		$duplicate->children = [];
		$duplicate->visibilityConditions = [];
		$duplicate->blocks = [];
		$duplicate->validationRules = [];

		foreach ($duplicatedRelations as $relation){
			$relationModel = $relation->duplicateFrom($duplicate);
			$duplicate->addRelation($relationModel);
		}

		foreach ($duplicatedOptions as $option){
			$optionFieldModel = $option->duplicateFrom($duplicate);
			$duplicate->addOption($optionFieldModel);
		}

		foreach ($duplicatedBlocks as $block){
			$blockFieldModel = $block->duplicateFrom($duplicate);
			$duplicate->addBlock($blockFieldModel);
		}

		foreach ($duplicatedAdvancedOptions as $advancedOption){
			$advancedOptionFieldModel = $advancedOption->duplicateFrom($duplicate);
			$duplicate->addAdvancedOption($advancedOptionFieldModel);
		}

		foreach ($duplicatedChildren as $child){
			$childModel = $child->duplicateFromParent($duplicate);
			$duplicate->addChild($childModel);
		}

		foreach ($duplicatedVisibilityConditions as $condition){
			$visibilityConditionModel = $condition->duplicateFrom($duplicate);
			$duplicate->addVisibilityCondition($visibilityConditionModel);
		}

		foreach ($validationRules as $rule){
			$ruleModel = $rule->duplicate();
			$duplicate->addValidationRule($ruleModel);
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
	 * @param MetaFieldBlockModel $block
	 *
	 * @return MetaFieldModel
	 */
	public function duplicateFromBlock(MetaFieldBlockModel $block): MetaFieldModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->blockId = $block->getId();

		return $duplicate;
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'boxId' => $this->getBox()->getId(),
			'groupId' => $this->getBox()->getGroup()->getId(),
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
			'advancedOptions' => $this->getAdvancedOptions(),
			'options' => $this->options,
			'relations' => $this->relations,
			'blocks' => $this->blocks,
			'blockId' => $this->getBlockId(),
			'blockName' => ($this->getParentBlock() !== null ? $this->getParentBlock()->getName() : null),
			'validationRules' => $this->validationRules,
			'visibilityConditions' => $this->visibilityConditions,
			'hasManyRelation' => $this->hasManyRelation(),
			'hasChildren' => $this->hasChildren(),
			'children' => $this->getChildren(),
			'parentId' => $this->getParentId(),
			'parentName' => ($this->getParentField() !== null ? $this->getParentField()->getName() : null),
			'isATextualField' => $this->isATextualField(),
			'canHaveAfterAndBefore' => $this->canHaveAfterAndBefore(),
			'isFilterable' => $this->isFilterable(),
			'permissions' => $this->getPermissions(),
			'forgedBy' => $this->getForgedBy(),
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
        $defaultValue = $data['defaultValue'] ?? $data['default_value'] ?? null;

	    // Clone fields special handling
        $clonedFields = $data['clonedFields'] ?? $data['cloned_fields'] ?? [];

        if($data['type'] === self::CLONE_TYPE and is_array($clonedFields) and !empty($clonedFields)){

            $defaultValueArray = [];

            foreach ($clonedFields as $clonedField){
                $boxName = $clonedField['box_name'] ?? $clonedField['boxName'] ?? null;
                $fieldName = $clonedField['field_name'] ?? $clonedField['fieldName'] ?? null;

                if($boxName !== null and $fieldName !== null){
                    $clonedFieldModel = MetaRepository::getMetaFieldByName([
                        'boxName' => $boxName,
                        'fieldName' => $fieldName,
                    ]);

                    if(!empty($clonedFieldModel)){
                        $defaultValueArray[] = $clonedFieldModel->getId();
                    }
                }
            }

            $defaultValue = json_encode($defaultValueArray);
        }

		$fieldModel = self::hydrateFromArray([
			'id' => (isset($data["id"]) ? $data["id"] : Uuid::v4()),
			'box' => $box,
		    'name' => $data['name'],
		    'label' => $data['label'] ?? null,
		    'type' => $data['type'],
			'sort' => ($fieldIndex+1),
			'showInArchive' => $data['showInArchive'] ?? $data['show_in_archive'] ?? false,
			'isRequired' => $data['isRequired'] ?? $data['is_required'] ?? false,
		    'defaultValue' => $defaultValue,
		    'description' => $data['description'] ?? null,
		]);

		$fieldModel->changeName(Strings::getTheFirstAvailableName($fieldModel->getName(), $arrayOfFieldNames));
		$arrayOfFieldNames[] = $fieldModel->getName();

		if(isset($data['blockId']) and !empty($data['blockId'])){
			$fieldModel->setBlockId($data['blockId']);
		}

		if(isset($data['block_id']) and !empty($data['block_id'])){
			$fieldModel->setBlockId($data['block_id']);
		}

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

		$advancedOptions = $data['advancedOptions'] ?? $data['advanced_options'] ?? [];

		if(is_array($advancedOptions) and !empty($advancedOptions)){
			foreach ($advancedOptions as $option){
				if($option !== null){

					$value = (is_array($option['value'])) ? serialize($option['value']) : $option['value'];

					$optionModel = MetaFieldAdvancedOptionModel::hydrateFromArray([
						'id' => (isset($option["id"]) ? $option["id"] : Uuid::v4()),
						'metaField' => $fieldModel,
						'key' => @$option['key'],
						'value' => $value,
					]);

					$fieldModel->addAdvancedOption($optionModel);
				}
			}
		}

		$validationRules = $data['validationRules'] ?? $data['validation_rules'] ?? [];

		if(is_array($validationRules) and !empty($validationRules)){
			foreach ($validationRules as $ruleIndex => $rule){
                try {
                    $ruleModel = ValidationRuleModel::hydrateFromArray([
                        'id' => (isset($rule["id"]) ? $rule["id"] : Uuid::v4()),
                        'condition' => @$rule['condition'],
                        'value' => $rule['value'] ?? null,
                        'message' => @$rule['message'],
                        'sort' => ($ruleIndex+1),
                    ]);

                    $fieldModel->addValidationRule($ruleModel);
                } catch (\Exception $exception){}
			}
		}

		$visibilityConditions = $data['visibilityConditions'] ?? $data['visibility_conditions'] ?? [];

		if(is_array($visibilityConditions) and !empty($visibilityConditions)){
			foreach ($visibilityConditions as $conditionIndex => $condition){
				try {
                    $value = $condition['value'] ?? '';
                    if(is_array($value)){
                        $value = implode(",", $value);
                    }

                    $conditionModel = MetaFieldVisibilityModel::hydrateFromArray([
                        'id' => (isset($condition["id"]) ? $condition["id"] : Uuid::v4()),
                        'metaField' => $fieldModel,
                        'type' => (is_array($condition['type']) ? $condition['type'] : json_decode($condition['type'], true)),
                        'operator' => @$condition['operator'],
                        'value' => $value,
                        'logic' => $condition['logic'] ?? null,
                        'backEnd' => (isset($condition['backEnd'])) ? $condition['backEnd'] == 1 : true,
                        'frontEnd' => (isset($condition['frontEnd'])) ? $condition['frontEnd'] == 1 : true,
                        'sort' => ($conditionIndex+1),
                    ]);

                    $fieldModel->addVisibilityCondition($conditionModel);
                } catch (\Exception $exception){}
			}
		}

		$permissions = $data['permissions'] ?? [];

		if(is_array($permissions) and !empty($permissions)){
			foreach ($permissions as $permissionIndex => $permission){
                try {
                    $permissionModel = PermissionModel::hydrateFromArray([
                        'id' => (isset($permission["id"]) ? $permission["id"] : Uuid::v4()),
                        'entityId' => $permission['entityId'] ?? $permission['entity_id'] ?? $fieldModel->getId(),
                        'userRole' => $permission['userRole'] ?? $permission['user_role'],
                        'permissions' => $permission['permissions'] ?? [],
                        'sort' => ($permissionIndex+1),
                    ]);

                    $fieldModel->addPermission($permissionModel);
                } catch (\Exception $exception){}
			}
		}

		if(isset($data['children']) and is_array($data['children'])){
			foreach ($data['children'] as $childIndex => $child){
				$child['parentId'] = $fieldModel->getId();
				$childModel = self::fullHydrateFromArray($box, $childIndex, $child, $arrayOfFieldNames, $arrayOfBlockNames);
				$fieldModel->addChild($childModel);
			}
		}

		if(isset($data['blocks']) and is_array($data['blocks'])){
			foreach ($data['blocks'] as $blockIndex => $block){
                try {
                    $blockModel = MetaFieldBlockModel::hydrateFromArray([
                        'id' => (isset($block["id"]) ? $block["id"] : Uuid::v4()),
                        'metaField' => $fieldModel,
                        'name' => @$block['name'],
                        'sort' => ($blockIndex+1),
                        'label' => @$block['label'] ?? null,
                    ]);

                    $blockModel->changeName(Strings::getTheFirstAvailableName($blockModel->getName(), $arrayOfBlockNames));
                    $arrayOfBlockNames[] = $blockModel->getName();

                    if(isset($block['fields']) and is_array($block['fields'])){
                        foreach ($block['fields'] as $childIndex => $child){
                            $child['blockId'] = $blockModel->getId();
                            $childModel = self::fullHydrateFromArray($box, $childIndex, $child, $arrayOfFieldNames, $arrayOfBlockNames);
                            $blockModel->addField($childModel);
                        }
                    }

                    $fieldModel->addBlock($blockModel);
                } catch (\Exception $exception){}
			}
		}

		if(isset($data['relations']) and is_array($data['relations'])){
			foreach ($data['relations'] as $relation){

				if(
					isset($relation['from']) and
					isset($relation['from']['type']) and
					isset($relation['from']['value']) and
					isset($relation['to']) and
					isset($relation['to']['type']) and
					isset($relation['to']['value'])
				){
					$from = new RelatedEntityValueObject(
						$relation['from']['type'],
						$relation['from']['value'],
					);

					$to = new RelatedEntityValueObject(
						$relation['to']['type'],
						$relation['to']['value'],
					);

					try {
                        $relationModel = MetaFieldRelationshipModel::hydrateFromArray([
                            'id' => (isset($relation["id"]) ? $relation["id"] : Uuid::v4()),
                            "metaField" => $fieldModel,
                            "relationship" => @$relation['relationship'],
                            "from" => $from,
                            "to" => $to,
                        ]);

                        $inversedModel  = null;

                        if(isset($relation['inversedBoxId']) and isset($relation['inversedFieldId'])){
                            $inversedModel = MetaRepository::getMetaFieldById($relation['inversedFieldId'], true);
                        }

                        if(isset($relation['inversedBoxName']) and isset($relation['inversedFieldName'])){
                            $inversedModel = MetaRepository::getMetaFieldByName([
                                'boxName' => $relation['inversedBoxName'],
                                'fieldName' => $relation['inversedFieldName'],
                                'lazy' => true
                            ]);
                        }

                        if($inversedModel !== null){
                            $relationModel->setInversedBy($inversedModel);
                        }

                        $fieldModel->addRelation($relationModel);
                    } catch (\Exception $exception){}
				}
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
	 * @return bool
	 */
	public function canBeDisplayedWithShortcode(): bool
	{
		return !$this->isRelational() and !$this->isNestable();
	}

	/**
	 * @return bool
	 */
	public function canFieldHaveValidationAndLogicRules(): bool
	{
		$allowed = [
			self::NUMBER_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
			self::SELECT_MULTI_TYPE,
			self::DATE_TYPE,
			self::DATE_TIME_TYPE,
			self::TIME_TYPE,
			self::URL_TYPE,
			self::PHONE_TYPE,
			self::EMAIL_TYPE,
			self::COLOR_TYPE,
			self::CURRENCY_TYPE,
			self::WEIGHT_TYPE,
			self::LENGTH_TYPE,
			self::TOGGLE_TYPE,
			self::POST_TYPE,
			self::POST_OBJECT_MULTI_TYPE,
			self::POST_OBJECT_TYPE,
			self::TERM_OBJECT_MULTI_TYPE,
			self::TERM_OBJECT_TYPE,
			self::USER_MULTI_TYPE,
			self::USER_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isTextual(): bool
	{
		$allowed = [
			self::ADDRESS_TYPE,
			self::CHECKBOX_TYPE,
			self::COLOR_TYPE,
			self::COUNTRY_TYPE,
			self::CURRENCY_TYPE,
			self::DATE_TYPE,
			self::DATE_TIME_TYPE,
			self::EMAIL_TYPE,
			self::LENGTH_TYPE,
			self::NUMBER_TYPE,
			self::PHONE_TYPE,
			self::RADIO_TYPE,
			self::RATING_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
			self::SELECT_MULTI_TYPE,
			self::TIME_TYPE,
			self::URL_TYPE,
			self::WEIGHT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

    /**
     * @return bool
     */
    public function isClone(): bool
    {
        $allowed = [
            self::CLONE_TYPE,
        ];

        return in_array($this->getType(), $allowed);
    }

	/**
	 * @return bool
	 */
	public function isMedia(): bool
	{
		$allowed = [
			self::IMAGE_TYPE,
			self::GALLERY_TYPE,
			self::VIDEO_TYPE,
			self::FILE_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isRelational(): bool
	{
		$allowed = [
			self::POST_TYPE,
			self::POST_OBJECT_TYPE,
			self::POST_OBJECT_MULTI_TYPE,
			self::TERM_OBJECT_TYPE,
			self::TERM_OBJECT_MULTI_TYPE,
			self::USER_TYPE,
			self::USER_MULTI_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function canHaveAfterAndBefore(): bool
	{
		$allowed = [
			self::CHECKBOX_TYPE,
			self::COUNTRY_TYPE,
			self::CURRENCY_TYPE,
			self::DATE_TYPE,
			self::DATE_RANGE_TYPE,
			self::DATE_TIME_TYPE,
			self::EMAIL_TYPE,
			self::HTML_TYPE,
			self::LENGTH_TYPE,
			self::NUMBER_TYPE,
			self::PHONE_TYPE,
			self::RADIO_TYPE,
			self::SELECT_TYPE,
			self::SELECT_MULTI_TYPE,
			self::TEXTAREA_TYPE,
			self::TEXT_TYPE,
			self::TIME_TYPE,
			self::URL_TYPE,
			self::WEIGHT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isNestable(): bool
	{
		$allowed = [
			self::REPEATER_TYPE,
			self::FLEXIBLE_CONTENT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return string
	 */
	public function getGroup(): ?string
	{
        if($this->isClone()){
            return 'clone';
        }

		if($this->isRelational()){
			return 'relational';
		}

		if($this->isMedia()){
			return 'media';
		}

		if($this->isNestable()){
			return 'repeatable';
		}

		return 'basic';
	}

	/**
	 * @param string $format
	 *
	 * @return array
	 */
	public function arrayRepresentation(string $format = 'full'): array
	{
		$blocksArray = [];
		$childrenArray = [];
		$validationRulesArray = [];
		$visibilityConditionsArray = [];
		$advancedOptionsArray = [];
		$optionsArray = [];
		$relationsArray = [];
		$permissionsArray = [];

		foreach ($this->getBlocks() as $blockModel){
			$blocksArray[] = $blockModel->arrayRepresentation($format);
		}

		foreach ($this->getChildren() as $childModel){
			$childrenArray[] = $childModel->arrayRepresentation();
		}

		foreach ($this->getAdvancedOptions() as $optionModel){
			$advancedOptionsArray[] = [
				'id' => $optionModel->getId(),
				'key' => $optionModel->getKey(),
				'value' => $optionModel->getValue(),
			];
		}

		foreach ($this->getOptions() as $optionModel){
			$optionsArray[] = [
				'id' => $optionModel->getId(),
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
				'sort' => (int)$optionModel->getSort(),
			];
		}

		foreach ($this->getValidationRules() as $rule){
			$validationRulesArray[] = [
				'id' => $rule->getId(),
				'condition' => $rule->getCondition(),
				'value' => $rule->getValue(),
			];
		}

		foreach ($this->getVisibilityConditions() as $visibilityCondition){
			$visibilityConditionsArray[] = [
				'id' => $visibilityCondition->getId(),
				'type' => $visibilityCondition->getType(),
				'operator' => $visibilityCondition->getOperator(),
				'value' => $visibilityCondition->getValue(),
				'logic' => $visibilityCondition->getLogic(),
				'sort' => (int)$visibilityCondition->getSort(),
			];
		}

		foreach ($this->getPermissions() as $permission){
			$permissionsArray[] = [
				'id' => $permission->getId(),
				'entityId' => $permission->getEntityId(),
				'userRole' => $permission->getUserRole(),
				'permissions' => $permission->getPermissions(),
				'sort' => (int)$permission->getSort(),
			];
		}

		foreach ($this->getRelations() as $relationModel){
			$relationsArray[] = [
				'id' => $relationModel->id,
				'boxId' => $relationModel->getMetaField()->getBox()->getId(),
				'fieldId' => $relationModel->getMetaField()->getId(),
				'type' => $relationModel->getRelationship(),
				'from' => $relationModel->from()->arrayRepresentation(),
				'to' => $relationModel->to()->arrayRepresentation(),
				'inversedBoxId' => ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getBox()->getId() : null,
				'inversedBoxName' => ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getBox()->getName() : null,
				'inversedFieldName' => ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getName() : null,
				'inversedFieldId' => ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getId() : null,
			];
		}

		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'type' => $this->getType(),
			'group' => $this->getGroup(),
			'belongsToLabel' => $this->getBelongsToLabel(),
			'findLabel' => $this->getFindLabel(),
			'defaultValue' => $this->getDefaultValue(),
			'description' => $this->getDescription(),
			'showInArchive' => (bool)$this->isShowInArchive(),
			'isRequired' => (bool)$this->isRequired(),
			'sort' => (int)$this->getSort(),
			'options' => $optionsArray,
			'relations' => $relationsArray,
			'visibilityConditions' => $visibilityConditionsArray,
			'validationRules' => $validationRulesArray,
			'advancedOptions' => $advancedOptionsArray,
			'children' => $childrenArray,
			'blocks' => $blocksArray,
			'permissions' => $permissionsArray,
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
			'groupId' => [
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
					MetaFieldModel::ADDRESS_TYPE,
					MetaFieldModel::ADDRESS_MULTI_TYPE,
					MetaFieldModel::CHECKBOX_TYPE,
					MetaFieldModel::CLONE_TYPE,
					MetaFieldModel::COLOR_TYPE,
					MetaFieldModel::COUNTRY_TYPE,
					MetaFieldModel::CURRENCY_TYPE,
					MetaFieldModel::DATE_TYPE,
					MetaFieldModel::DATE_TIME_TYPE,
					MetaFieldModel::DATE_RANGE_TYPE,
					MetaFieldModel::EDITOR_TYPE,
					MetaFieldModel::EMAIL_TYPE,
					MetaFieldModel::EMBED_TYPE,
					MetaFieldModel::FILE_TYPE,
					MetaFieldModel::HTML_TYPE,
					MetaFieldModel::FLEXIBLE_CONTENT_TYPE,
					MetaFieldModel::GALLERY_TYPE,
					MetaFieldModel::ICON_TYPE,
					MetaFieldModel::IMAGE_TYPE,
					MetaFieldModel::LENGTH_TYPE,
					MetaFieldModel::LIST_TYPE,
					MetaFieldModel::NUMBER_TYPE,
					MetaFieldModel::PASSWORD_TYPE,
					MetaFieldModel::POST_TYPE,
					MetaFieldModel::POST_OBJECT_TYPE,
					MetaFieldModel::POST_OBJECT_MULTI_TYPE,
					MetaFieldModel::PHONE_TYPE,
					MetaFieldModel::REPEATER_TYPE,
					MetaFieldModel::RADIO_TYPE,
					MetaFieldModel::RANGE_TYPE,
					MetaFieldModel::RATING_TYPE,
					MetaFieldModel::SELECT_TYPE,
					MetaFieldModel::SELECT_MULTI_TYPE,
					MetaFieldModel::TABLE_TYPE,
					MetaFieldModel::TERM_OBJECT_TYPE,
					MetaFieldModel::TERM_OBJECT_MULTI_TYPE,
					MetaFieldModel::TEXT_TYPE,
					MetaFieldModel::TEXTAREA_TYPE,
					MetaFieldModel::TIME_TYPE,
					MetaFieldModel::TOGGLE_TYPE,
					MetaFieldModel::VIDEO_TYPE,
					MetaFieldModel::WEIGHT_TYPE,
					MetaFieldModel::URL_TYPE,
					MetaFieldModel::USER_TYPE,
					MetaFieldModel::USER_MULTI_TYPE,
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
				'type' => 'boolean|string|array',
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
				'type' => 'boolean|integer',
			],
			'canHaveAfterAndBefore' => [
				'required' => false,
				'type' => 'boolean|integer',
			],
			'isFilterable' => [
				'required' => false,
				'type' => 'boolean|integer',
			],
			'advancedOptions' => [
				'required' => false,
				'type' => 'array',
			],
			'permissions' => [
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
			'forgedBy' => [
				'required' => false,
				'type' => 'array|string',
			],
			'clonedFields' => [
				'required' => false,
				'type' => 'array',
			],
		];
	}

	/**
	 * @inheritDoc
	 */
	public function capabilityType(): string
	{
		return Strings::toDBFormat($this->getBox()->getName()).'_'.Strings::toDBFormat($this->name);
	}

	/**
	 * @inheritDoc
	 */
	public function capabilities(): array
	{
		return [
			'edit',
			'read',
		];
	}

    /**
     * This function is invoked when a field is forged by a parent Clone field
     *
     * @param MetaFieldModel $fieldModel
     */
	public function forgeBy(MetaFieldModel $fieldModel)
    {
        $this->box = $fieldModel->getBox();
        $this->findLabel = $fieldModel->getFindLabel();
        $this->belongsToLabel = $fieldModel->getBelongsToLabel();

        if($fieldModel->hasParent()){
            $this->setParentId($fieldModel->parentId);
        }

        if($fieldModel->hasParentBlock()){
            $this->setBlockId($fieldModel->blockId);
        }

        if($this->hasChildren()){
            foreach ($this->getChildren() as $index => $childField){
                $this->getChildren()[$index]->forgeBy($fieldModel);
            }
        }

        if($this->hasBlocks()){
            foreach ($this->getBlocks() as $blockIndex => $block){
                foreach ($block->getFields() as $index => $childField){
                    $this->getBlocks()[$blockIndex]->getFields()[$index]->forgeBy($fieldModel);
                }
            }
        }

        $this->forgedBy = $fieldModel;
    }

    /**
     * Get all cloned fields
     *
     * @param bool $preserveOriginal
     * @return MetaFieldModel[]
     */
    public function getClonedFields($preserveOriginal = false)
    {
        $clonedFields = [];

        if($this->getType() !== MetaFieldModel::CLONE_TYPE){
            return $clonedFields;
        }

        $clonedFieldIds = $this->getDefaultValue();

        if(empty($clonedFieldIds)){
            return $clonedFields;
        }

        if(!JSON::isValid($clonedFieldIds)){
            $clonedFieldIds = '["'.$clonedFieldIds.'"]';
        }

        $clonedFieldIds = json_decode($clonedFieldIds, true);

        if(!is_array($clonedFieldIds)){
            return $clonedFields;
        }

        foreach ($clonedFieldIds as $clonedFieldId){
            try {
                $fieldToBeCloned = MetaRepository::getMetaFieldById($clonedFieldId);

                if($fieldToBeCloned !== null){

                    if($preserveOriginal === false){
                        $fieldToBeCloned->forgeBy($this);
                    }

                    $clonedFields[] = $fieldToBeCloned;
                }
            } catch (\Exception $exception){}
        }

        return $clonedFields;
    }

    /**
     * @param BelongModel $belong
     */
    public function setBelongsAndFindLabels(BelongModel $belong)
    {
        $belongsTo = $belong->getBelongsTo();
        $this->setBelongsToLabel($belongsTo);
        $this->setFindLabel($belong->getFindAsSting());
    }
}