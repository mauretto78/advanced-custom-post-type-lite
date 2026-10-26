<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\Wordpress\Translator;

class MetaFieldModel extends AbstractModel implements \JsonSerializable
{
    /**
     * Permissions are not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getPermissions(): array
    {
        return [];
    }
    public const DATE_TYPE = 'Date';
    public const EMAIL_TYPE = 'Email';
    public const SELECT_TYPE = 'Select';
    public const TEXTAREA_TYPE = 'Textarea';
    public const TEXT_TYPE = 'Text';

    /**
     * Field types that resolve to a scalar (or scalar-array) WP Block
     * Bindings value — string/boolean/integer/number/array, per
     * resolveBindingType()'s BINDING_TYPE_MAP, assets/src/Gutenberg/utils/
     * resolveBindingType.jsx — as opposed to structural/nested types
     * (Repeater, FlexibleContent, Clone, Table, Gallery, multi-relation
     * fields, etc.) that can never be represented as a single bound
     * attribute value. Modeled on ACF's own supported-field-types list for
     * block bindings, plus ID/Editor/DateRange/SelectMulti/Checkbox/List
     * (ACPT-specific/extra -- the last three are only included because their
     * raw stored value is already a flat array of plain strings, per
     * FetchMetaFieldValueQuery.php's CHECKBOX_TYPE/SELECT_MULTI_TYPE/
     * LIST_TYPE case, unlike other `array`-typed fields such as Gallery or
     * Post Object Multi, whose array items are complex objects and are
     * deliberately NOT included here).
     * Drives:
     * 1) whether the "Allow in block bindings" advanced option is even
     *    shown for a given field (see jsonSerialize()'s `bindable` key), and
     * 2) documents, on the PHP side, exactly which types
     * ACPT_Block_Bindings::getValueCallback() must special-case value
     * extraction for (URL/IMAGE/FILE/DATE_RANGE -- every other listed type
     * is already a plain scalar/scalar-array with no extraction needed).
     * Kept in parity with the JS BINDING_TYPE_MAP by resolveBindingType.
     * test.js's own completeness meta-test plus this class's own PHPUnit
     * coverage -- update both together if either side changes.
     *
     * @var array<int, string>
     */
    public const BINDABLE_FIELD_TYPES = [
        self::TEXT_TYPE,
        self::TEXTAREA_TYPE,
        self::EMAIL_TYPE,
        self::SELECT_TYPE,
        self::DATE_TYPE,
    ];

    /**
     * @var MetaBoxModel
     */
    private MetaBoxModel $box;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var string|null
     */
    private ?string $label = null;

    /**
     * @var string
     */
    private string $type;

    /**
     * @var mixed|null
     */
    private $defaultValue = null;

    /**
     * @var string|null
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
      * @var array<int, mixed>
     */
    private array $advancedOptions = [];

    /**
     * @var MetaFieldOptionModel[]
     */
    private array $options = [];

    /**
      * @var array<int, mixed>
     */
    private array $relations = [];

    /**
      * @var array<int, mixed>
     */
    private array $visibilityConditions = [];

    /**
      * @var array<int, mixed>
     */
    private array $validationRules = [];

    /**
     * @var MetaFieldModel[]
     */
    private array $children = [];

    /**
      * @var array<int, mixed>
     */
    private array $blocks = [];

    /**
     * @var string|null
     */
    private ?string $parentId = null;

    /**
     * @var string|null
     */
    private ?string $blockId = null;

    /**
     * @var MetaFieldModel|null
     */
    private ?MetaFieldModel $forgedBy = null;

    /**
     * @var bool|null
     */
    private ?bool $isAWooCommerceProductAttribute = false;

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
     * @param mixed|null $defaultValue
     * @param string|null $description
     * @param string|null $label
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
        $this->defaultValue         = $defaultValue;
        $this->description          = $description;
        $this->label                = $label;
        $this->advancedOptions      = [];
        $this->options              = [];
        $this->relations            = [];
        $this->visibilityConditions = [];
        $this->validationRules      = [];
        $this->children             = [];
        $this->blocks               = [];
    }

    /**
     * @param MetaBoxModel $box
     */
    public function changeBox(MetaBoxModel $box): void
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
     * @param string $name
     */
    public function changeName(string $name): void
    {
        if (!Strings::alphanumericallyValid($name)) {
            throw new \DomainException($name . ' is not valid name');
        }

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
    public function getLabelOrName(): string
    {
        if ($this->getLabel()) {
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
     * @param string $type
     *
     * @throws \DomainException
     *
     * @return void
     */
    private function setType(string $type): void
    {
        if (!in_array($type, $this->getValidTypes())) {
            throw new \DomainException($type . ' is not a valid field type for this meta box field');
        }

        $this->type = $type;
    }

    /**
     * @return array<string, string>
     */
    public function getValidTypes(): array
    {
        return $this->getConstants();
    }

    /**
     * @param string $type
     *
     * @return void
     */
    public function changeType(string $type): void
    {
        $this->setType($type);
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * This function converts the meta field type to
     * the corresponding form field type
     *
     * @return string
     */
    public function resolveFieldTypeForForms(): string
    {
        return $this->type;
    }

    /**
     * @param int $sort
     *
     * @return void
     */
    public function changeSort(int $sort): void
    {
        $this->sort = $sort;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    /**
     * @return mixed|null
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @return string|null
     */
    public function getDefaultValueAsString(): ?string
    {
        if ($this->defaultValue === null) {
            return null;
        }

        if (is_array($this->defaultValue)) {
            // json_encode() returns false on failure (e.g. INF, NAN, invalid UTF-8).
            // Return null instead of letting PHP silently coerce false → "" and
            // persisting an empty string to the DB.
            $encoded = json_encode($this->defaultValue);
            return $encoded !== false ? $encoded : null;
        }

        if (is_bool($this->defaultValue)) {
            // '1'/'0', not 'true'/'false' -- ToggleField::getToggleValue()
            // (src/Core/Generators/Meta/Fields/ToggleField.php) checks
            // in_array($defaultValue, [0, 1]), which 'true'/'false' never
            // match (PHP 8 non-numeric-string comparison rules), silently
            // rendering the field's default as always unchecked.
            return $this->defaultValue ? '1' : '0';
        }

        // Explicit cast guards against any non-string scalar (int, float) that
        // bypassed type validation and reached this point.
        return (string) $this->defaultValue;
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
     * @return string
     */
    public function isRequiredAsSting(): string
    {
        return $this->isRequired ? '1' : '0' ;
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
    public function setQuickEdit(bool $quickEdit): void
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
    public function setFilterableInAdmin(bool $filterableInAdmin): void
    {
        $this->filterableInAdmin = $filterableInAdmin;
    }

    /**
     * Not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getValidationRules()
    {
        return [];
    }

    /**
     * @return array<int, mixed>
     */
    public function getAdvancedOptions(): array
    {
        return [];
    }

    /**
     * Not available in ACPT Lite
     *
     * @return null
     */
    public function getAdvancedOption(string $key)
    {
        return null;
    }

    /**
     * @param MetaFieldOptionModel $option
     */
    public function addOption(MetaFieldOptionModel $option): void
    {
        if (!$this->existsInCollection($option->getId(), $this->options)) {
            $this->options[] = $option;
        }
    }

    /**
     * @param MetaFieldOptionModel $option
     */
    public function removeOption(MetaFieldOptionModel $option): void
    {
        $this->options = $this->removeFromCollection($option->getId(), $this->options);
    }

    /**
     * Clear all options
     */
    public function clearOptions(): void
    {
        $this->options = [];
    }

    /**
     * @return MetaFieldOptionModel[]
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * @return array<string, mixed>
     */
    public function getOptionsAsArray(): array
    {
        $options = [];

        foreach ($this->getOptions() as $option) {
            $options[$option->getValue()] = $option->getLabel();
        }

        return $options;
    }

    /**
     * @return array<int, string>
     */
    public function getOptionValues(): array
    {
        $values = [];

        foreach ($this->getOptions() as $option) {
            $values[] = $option->getValue();
        }

        return $values;
    }

    /**
     * @param string $value
     *
     * @return string|null
     */
    public function getOptionLabel(string $value): ?string
    {
        if (empty($this->getOptions())) {
            return null;
        }

        foreach ($this->getOptions() as $option) {
            if ($option->getValue() === $value) {
                return Translator::translateString($option->getLabel());
            }
        }

        return null;
    }

    /**
     * Not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getRelations()
    {
        return [];
    }

    /**
     * Not available in ACPT Lite
     *
     * @return bool
     */
    public function hasManyRelation(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function hasChildren(): bool
    {
        return !empty($this->children);
    }

    /**
     * Whether this field's type is capable of being used in a Gutenberg
     * block binding at all -- see the BINDABLE_FIELD_TYPES docblock. Does
     * NOT account for the "Allow in block bindings" advanced-option opt-out
     * (a field can be of a bindable type but still individually disallowed);
     * that check lives in ACPT_Block_Bindings.
     *
     * @return bool
     */
    public function isBindable(): bool
    {
        return in_array($this->type, self::BINDABLE_FIELD_TYPES, true);
    }

    /**
     * @param MetaFieldModel $field
     */
    public function addChild(MetaFieldModel $field): void
    {
        if (!$this->existsInCollection($field->getId(), $this->children)) {
            $this->children[] = $field;
        }
    }

    /**
     * @param MetaFieldModel $field
     */
    public function removeChild(MetaFieldModel $field): void
    {
        $this->children = $this->removeFromCollection($field->getId(), $this->children);
    }

    /**
     * Clear all children
     */
    public function clearChildren(): void
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
     * @param int $index
     * @param MetaFieldModel $fieldModel
     *
     * @return void
     */
    public function setChild(int $index, MetaFieldModel $fieldModel): void
    {
        $this->children[$index] = $fieldModel;
    }

    /**
     * @param string $name
     *
     * @return MetaFieldModel|null
     */
    public function getChild(string $name): ?MetaFieldModel
    {
        foreach ($this->getChildren() as $child) {
            if ($name === $child->getName()) {
                return $child;
            }
        }

        return null;
    }

    /**
     * @param string|null $parentId
     */
    public function setParentId(?string $parentId): void
    {
        $this->parentId = $parentId;
    }

    /**
     * @return string|null
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
        return null;
    }

    /**
     * @return MetaFieldModel|null
     */
    public function getParentField(): ?MetaFieldModel
    {
        return null;
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
     * @return string|null
     */
    public function getBlockId(): ?string
    {
        return $this->blockId;
    }

    /**
     * @param ?string $blockId
     */
    public function setBlockId(?string $blockId): void
    {
        $this->blockId = $blockId;
    }

    /**
     * @param string $name
     *
     * @return null
     */
    public function getBlock(string $name)
    {
        return null;
    }

    /**
     * Not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getBlocks(): array
    {
        return [];
    }

    /**
     * @return bool
     */
    public function isNestedInABlock(): bool
    {
        return $this->getBlockId() !== null;
    }

    /**
     * @return null
     */
    public function getParentBlock()
    {
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
     * Not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getVisibilityConditions(): array
    {
        return [];
    }

    /**
     * @return bool
     */
    public function hasVisibilityConditions(): bool
    {
        return Arrays::count($this->visibilityConditions) > 0;
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
            self::DATE_TYPE,
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

        $dbName .= Strings::toDBFormat($this->getBox()->getName()).'_'.Strings::toDBFormat($this->name);

        return $dbName;
    }

    /**
     * @return string
     */
    public function getUiName()
    {
        $uiName = Strings::toHumanReadableFormat($this->getBox()->getUiName()) . ' - ' . Strings::toHumanReadableFormat($this->name);

        if ($this->getParentId()) {
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
        $duplicatedChildren = $duplicate->getChildren();

        $duplicate->options = [];
        $duplicate->advancedOptions = [];
        $duplicate->relations = [];
        $duplicate->children = [];
        $duplicate->visibilityConditions = [];
        $duplicate->blocks = [];
        $duplicate->validationRules = [];

        foreach ($duplicatedOptions as $option) {
            $optionFieldModel = $option->duplicateFrom($duplicate);
            $duplicate->addOption($optionFieldModel);
        }

        foreach ($duplicatedChildren as $child) {
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
            'bindable' => $this->isBindable(),
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
            'visibilityConditions' => $this->getVisibilityConditions(),
            'hasManyRelation' => false,
            'hasChildren' => false,
            'children' => $this->getChildren(),
            'parentId' => $this->getParentId(),
            'parentName' => ($this->getParentField() !== null ? $this->getParentField()->getName() : null),
            'isATextualField' => $this->isATextualField(),
            'canHaveAfterAndBefore' => $this->canHaveAfterAndBefore(),
            'isFilterable' => $this->isFilterable(),
            'permissions' => [],
            'forgedBy' => $this->getForgedBy(),
        ];
    }

    /**
     * @param MetaBoxModel $box
     * @param int $fieldIndex
     * @param array<string, mixed> $data
     * @param array<int, string> $arrayOfFieldNames
     * @param array<int, string> $arrayOfBlockNames
     * @param array<string, array{name: string, box_id: string}> $persistedFields stored fields by id
     *
     * @return MetaFieldModel
     * @throws \Exception
     */
    public static function fullHydrateFromArray(MetaBoxModel $box, int $fieldIndex, array $data, array &$arrayOfFieldNames, array &$arrayOfBlockNames, array $persistedFields = [])
    {
        $defaultValue = $data['defaultValue'] ?? $data['default_value'] ?? null;

        // Clone fields special handling
        $clonedFields = $data['clonedFields'] ?? $data['cloned_fields'] ?? [];

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

        // An existing field saved with its stored name in its stored box keeps that name,
        // even if it collides: renaming it would orphan every value saved under the old
        // meta key (#1421/#1422). Only new or renamed fields get a unique suffix.
        $persisted = $persistedFields[$fieldModel->getId()] ?? null;
        $isUnchanged = $persisted !== null && $persisted['name'] === $fieldModel->getName() && $persisted['box_id'] === $box->getId();

        if (!$isUnchanged) {
            $fieldModel->changeName(Strings::getTheFirstAvailableName($fieldModel->getName(), $arrayOfFieldNames));
        }

        $arrayOfFieldNames[] = $fieldModel->getName();

        if (isset($data['blockId']) && !empty($data['blockId'])) {
            $fieldModel->setBlockId($data['blockId']);
        }

        if (isset($data['block_id']) && !empty($data['block_id'])) {
            $fieldModel->setBlockId($data['block_id']);
        }

        if (isset($data['parentId']) && !empty($data['parentId']) && (!isset($data['blockId']) || empty($data['blockId']))) {
            $fieldModel->setParentId($data['parentId']);
        }

        if (isset($data['parent_id']) && !empty($data['parent_id']) && (!isset($data['block_id']) || empty($data['block_id']))) {
            $fieldModel->setParentId($data['parent_id']);
        }

        if (isset($data['quickEdit'])) {
            $fieldModel->setQuickEdit($data['quickEdit']);
        }

        if (isset($data['quick_edit'])) {
            $fieldModel->setQuickEdit($data['quick_edit']);
        }

        if (isset($data['filterableInAdmin'])) {
            $fieldModel->setFilterableInAdmin($data['filterableInAdmin']);
        }

        if (isset($data['filterable_in_admin'])) {
            $fieldModel->setFilterableInAdmin($data['filterable_in_admin']);
        }

        if (isset($data['options']) && is_array($data['options'])) {
            foreach ($data['options'] as $indexOption => $option) {
                // Skip junk rows (no value, no label) instead of aborting the whole
                // group save with "`value` key is mandatory" (#1349). An option with a
                // label but no value falls back to its label, like the linked editor does.
                if (!is_array($option)) {
                    continue;
                }

                $label = $option['label'] ?? null;
                $value = $option['value'] ?? $label;

                if ($value === null || ($value === '' && empty($label))) {
                    continue;
                }

                try {
                    $optionModel = MetaFieldOptionModel::hydrateFromArray([
                        'id' => (isset($option["id"]) ? $option["id"] : Uuid::v4()),
                        'metaField' => $fieldModel,
                        'label' => $label ?? $value,
                        'value' => $value,
                        'isDefault' => (bool)($option['isDefault'] ?? false),
                        'sort' => ($indexOption+1),
                    ]);

                    $fieldModel->addOption($optionModel);
                } catch (\Exception $exception) {
                    do_action("acpt/error", $exception);
                }
            }
        }

        if (isset($data['children']) && is_array($data['children'])) {
            foreach ($data['children'] as $childIndex => $child) {
                $child['parentId'] = $fieldModel->getId();
                $childModel = self::fullHydrateFromArray($box, $childIndex, $child, $arrayOfFieldNames, $arrayOfBlockNames, $persistedFields);
                $fieldModel->addChild($childModel);
            }
        } elseif (isset($data['id'])) {
            // 'children' entirely absent (not just an empty array — that still means "clear
            // them") on an existing field: a caller resending a field payload that simply
            // doesn't mention children (e.g. a GET->PUT round trip, or a partial update via
            // save_acpt_meta_field()) must not silently wipe an existing repeater's children.
            // Re-attach the currently-stored children (same ids, so nothing orphans) instead.
            try {
                $existingField = MetaRepository::getMetaFieldById($data['id']);

                if ($existingField !== null) {
                    foreach ($existingField->getChildren() as $existingChild) {
                        $fieldModel->addChild($existingChild);
                    }
                }
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        return $fieldModel;
    }

    /**
     * Converts a condition type into an array.
     *
     * @param mixed $conditionType The condition type to be converted.
     * @return array<string, mixed> Returns the condition type as an array.
     */
    private static function convertConditionTypeToArray($conditionType): array
    {
        if (empty($conditionType)) {
            return [];
        }

        if (is_array($conditionType)) {
            return $conditionType;
        }

        return json_decode(html_entity_decode($conditionType), true);
    }

    /**
     * @return string|null
     */
    public function getBelongsToLabel(): ?string
    {
        return $this->belongsToLabel;
    }

    /**
     * @param string|null $belongsToLabel
     */
    public function setBelongsToLabel(?string $belongsToLabel): void
    {
        $this->belongsToLabel = $belongsToLabel;
    }

    /**
     * @return string|null
     */
    public function getFindLabel(): ?string
    {
        return $this->findLabel;
    }

    /**
     * @param string|null $findLabel
     */
    public function setFindLabel(?string $findLabel): void
    {
        $this->findLabel = $findLabel;
    }

    /**
     * @return bool
     */
    public function isAWooCommerceProductAttribute(): bool
    {
        return $this->isAWooCommerceProductAttribute ?? false;
    }

    /**
     * @param bool|null $isAWooCommerceProductAttribute
     */
    public function setIsAWooCommerceProductAttribute(?bool $isAWooCommerceProductAttribute): void
    {
        $this->isAWooCommerceProductAttribute = $isAWooCommerceProductAttribute;
    }

    /**
     * @return bool
     */
    public function canBeDisplayedWithShortcode(): bool
    {
        return !$this->isRelational() && !$this->isNestable();
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
    public function isNumeric(): bool
    {
        $allowed = [];

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
    public function isClone(): bool
    {
        $allowed = [];

        return in_array($this->getType(), $allowed);
    }

    /**
     * @return bool
     */
    public function isMedia(): bool
    {
        $allowed = [];

        return in_array($this->getType(), $allowed);
    }

    /**
     * @return bool
     */
    public function isRelational(): bool
    {
        $allowed = [];

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
     * @return bool
     */
    public function isForFormBuilder()
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
     * @return bool
     */
    public function isFlexible(): bool
    {
        $allowed = [];

        return in_array($this->getType(), $allowed);
    }

    /**
     * @return bool
     */
    public function isNestable(): bool
    {
        $allowed = [];

        return in_array($this->getType(), $allowed);
    }

    /**
     * @return string|null
     */
    public function getGroup(): ?string
    {
        if ($this->isClone()) {
            return 'clone';
        }

        if ($this->isRelational()) {
            return 'relational';
        }

        if ($this->isMedia()) {
            return 'media';
        }

        if ($this->isNestable()) {
            return 'repeatable';
        }

        return 'basic';
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
            'isAWooCommerceProductAttribute' => [
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
            'bindable' => [
                'required' => false,
                'type' => 'boolean',
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
     * @param BelongModel $belong
     */
    public function setBelongsAndFindLabels(BelongModel $belong): void
    {
        $belongsTo = $belong->getBelongsTo();
        $this->setBelongsToLabel($belongsTo);
        $this->setFindLabel($belong->getFindAsSting());
    }

}
