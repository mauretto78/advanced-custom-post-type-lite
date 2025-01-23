<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\Translator;

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
		$this->options              = [];
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
	 * @return bool
	 */
	public function isATextualField(): bool
	{
		$textualTypes = [
			self::SELECT_TYPE,
			self::EMAIL_TYPE,
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
			self::SELECT_TYPE,
			self::EMAIL_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
		];

		return in_array($this->type, $textualTypes);
	}

	/**
	 * @return bool
	 */
	public function isFilterable(): bool
	{
		$filterableTypes = [
			self::DATE_TYPE,
			self::EMAIL_TYPE,
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
        return Strings::toHumanReadableFormat($this->getBox()->getUiName()) . ' - ' . Strings::toHumanReadableFormat($this->name);
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
		$duplicate->options = [];


		foreach ($duplicatedOptions as $option){
			$optionFieldModel = $option->duplicateFrom($duplicate);
			$duplicate->addOption($optionFieldModel);
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
			'options' => $this->options,
			'isATextualField' => $this->isATextualField(),
			'canHaveAfterAndBefore' => $this->canHaveAfterAndBefore(),
			'isFilterable' => $this->isFilterable(),
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
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
			self::DATE_TYPE,
			self::EMAIL_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isTextual(): bool
	{
		$allowed = [
			self::DATE_TYPE,
			self::EMAIL_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function canHaveAfterAndBefore(): bool
	{
		$allowed = [
			self::DATE_TYPE,
			self::EMAIL_TYPE,
			self::SELECT_TYPE,
			self::TEXTAREA_TYPE,
			self::TEXT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return string
	 */
	public function getGroup(): ?string
	{
		return 'basic';
	}

	/**
	 * @param string $format
	 *
	 * @return array
	 */
	public function arrayRepresentation(string $format = 'full'): array
	{
		$optionsArray = [];

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
			'group' => $this->getGroup(),
			'belongsToLabel' => $this->getBelongsToLabel(),
			'findLabel' => $this->getFindLabel(),
			'defaultValue' => $this->getDefaultValue(),
			'description' => $this->getDescription(),
			'showInArchive' => (bool)$this->isShowInArchive(),
			'isRequired' => (bool)$this->isRequired(),
			'sort' => (int)$this->getSort(),
			'options' => $optionsArray,
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
					MetaFieldModel::DATE_TYPE,
					MetaFieldModel::EMAIL_TYPE,
					MetaFieldModel::SELECT_TYPE,
					MetaFieldModel::TEXT_TYPE,
					MetaFieldModel::TEXTAREA_TYPE,
				],
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
			'options' => [
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
     * @param BelongModel $belong
     */
    public function setBelongsAndFindLabels(BelongModel $belong)
    {
        $belongsTo = $belong->getBelongsTo();
        $this->setBelongsToLabel($belongsTo);
        $this->setFindLabel($belong->getFindAsSting());
    }
}