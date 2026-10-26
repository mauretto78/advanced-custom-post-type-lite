<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\PHP\Arrays;

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
     * @var string|null
     */
    private ?string $label = null;

    /**
     * @var array<string, mixed>
     */
    private array $settings = [];

    /**
     * @var int
     */
    private int $sort;

    /**
     * @var MetaFieldModel[]
     */
    private array $fields = [];

    /**
      * @var array<int, mixed>
     */
    private array $visibilityConditions = [];

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
        ?string $label = null
    ) {
        parent::__construct($id);
        $this->group = $group;
        $this->name = $name;
        $this->label = $label;
        $this->sort = $sort;
        $this->fields = [];
        $this->settings = [];
        $this->visibilityConditions = [];
    }

    /**
     * @param MetaGroupModel $group
     */
    public function changeGroup(MetaGroupModel $group): void
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
    public function changeName(string $name): void
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
     * @return string|null
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getDbName(): string
    {
        return Strings::toDBFormat($this->getName());
    }

    /**
     * @return string
     */
    public function getUiName(): string
    {
        if ($this->getLabel()) {
            return $this->getLabel();
        }

        return $this->getName();
    }

    /**
     * @param string $label
     */
    public function changeLabel(string $label): void
    {
        $this->label = $label;
    }

    /**
     * @param int $sort
     * @return void
     */
    public function changeSort(int $sort): void
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
     * @param int $index
     * @param MetaFieldModel $fieldModel
     */
    public function setField(int $index, MetaFieldModel $fieldModel): void
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
     * @param string $fieldId
     * @param MetaFieldModel[] $fields
     *
     * @return MetaFieldModel|null
     */
    public function findAFieldById(string $fieldId, ?array $fields = null): ?MetaFieldModel
    {
        $fields = $fields ?? $this->getFields();

        foreach ($fields as $field) {
            if ($field->getId() === $fieldId) {
                return $field;
            }

            // @TODO to be fixed in 2.0.14 beta3
            foreach ($field->getBlocks() as $block) {
                foreach ($block->getFields() as $field) {
                    $nestedId = $this->findAFieldById($field->getId(), $block->getFields());

                    if ($nestedId !== null) {
                        return $nestedId;
                    }
                }
            }
        }

        return null;
    }

    /**
     * @param string $fieldName
     * @param MetaFieldModel[]|null $fields
     */
    public function removeAField(string $fieldName, ?array &$fields = null): void
    {
        $fields = $fields ?? $this->getFields();

        foreach ($fields as $fieldIndex => $field) {
            if ($field->getName() === $fieldName) {
                unset($fields[$fieldIndex]);
            }

            foreach ($field->getChildren() as $child) {
                $fields = $field->getChildren();
                $this->removeAField($child->getName(), $fields);
            }

            foreach ($field->getBlocks() as $block) {
                foreach ($block->getFields() as $field) {
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
    public function addField(MetaFieldModel $field): void
    {
        if (!$this->existsInCollection($field->getId(), $this->fields)) {
            $this->fields[] = $field;
        }
    }

    /**
     * @param MetaFieldModel $field
     */
    public function removeField(MetaFieldModel $field): void
    {
        $this->fields = $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @param $settings
     */
    /**
     * @param array<string, mixed> $settings
     * @return void
     */
    public function setSettings(array $settings): void
    {
        $this->settings = $settings;
    }

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->settings;
    }

    /**
     * @param string $key
     *
     * @return mixed|null
     */
    public function getSetting(string $key)
    {
        return $this->settings[$key] ?? null;
    }

    /**
     * @return string
     */
    public function getContext(): string
    {
        if ($this->getSetting("context")) {
            return $this->getSetting("context");
        }

        return $this->getGroup()->getContext() ?: 'advanced';
    }

    /**
     * @return string
     */
    public function getPriority(): string
    {
        if ($this->getSetting("priority")) {
            return $this->getSetting("priority");
        }

        return $this->getGroup()->getPriority() ?: 'default';
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
     * @return bool
     */
    public function hasLiveReactiveVisibilityConditions(): bool
    {
        return false;
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

        foreach ($duplicatedFields as $field) {
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
        $duplicate->visibilityConditions = [];

        foreach ($duplicatedFields as $field) {
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
            'settings' => $this->getSettings(),
            'sort' => $this->getSort(),
            'fields' => $this->getFields(),
            'visibilityConditions' => $this->getVisibilityConditions(),
        ];
    }

    /**
     * @inheritDoc
     * @return array<string, array<string, mixed>>
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
            'visibilityConditions' => [
                    'required' => false,
                    'type' => 'array',
            ],
            'settings' => [
                'required' => false,
                'type' => 'object|array',
            ],
        ];
    }
}
