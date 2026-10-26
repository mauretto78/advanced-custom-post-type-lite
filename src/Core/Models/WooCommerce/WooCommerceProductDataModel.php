<?php

namespace ACPT_Lite\Core\Models\WooCommerce;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

/**
 * WooCommerceProductDataModel
 *
 * @since      1.0.1
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private string $name;

    /**
     * json_decode() (without `true`) on the DB-stored icon column -- see
     * WooCommerceProductDataRepository::get() -- yields a \stdClass for any
     * JSON object payload, so this is genuinely reachable at runtime despite
     * every write path passing an array.
     *
     * @var string|array<string, mixed>|\stdClass
     */
    private $icon;

    /**
     * @var array<int, mixed>
     */
    private array $visibility = [];

    /**
     * @var bool
     */
    private bool $showInUI;

    /**
     * @var string|null
     */
    private ?string $content = null;

    /**
     * @var WooCommerceProductDataFieldModel[]
     */
    private array $fields = [];

    /**
     * WooCommerceProductDataModel constructor.
     *
     * @param string $id
     * @param string $name
     * @param string|array<string, mixed>|\stdClass $icon
     * @param array<int, mixed> $visibility
     * @param bool $showInUI
     */
    public function __construct(
        string $id,
        string $name,
        $icon,
        array $visibility = [],
        bool $showInUI = true
    ) {
        parent::__construct($id);
        $this->name   = $name;
        $this->icon   = $icon;
        $this->visibility   = $visibility;
        $this->showInUI   = $showInUI;
        $this->fields = [];
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
     *
     * @return void
     */
    public function changeName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getSluggedName(): string
    {
        return strtolower(str_replace(" ", "_", $this->name));
    }

    /**
     * @return string|array<string, mixed>
     */
    public function getIcon()
    {
        if(is_object($this->icon)){
            return (array)$this->icon;
        }

        return $this->icon;
    }

    /**
     * @return array<int, mixed>
     */
    public function getVisibility(): array
    {
        return $this->visibility;
    }

    /**
     * @return bool
     */
    public function isShowInUI(): bool
    {
        return $this->showInUI;
    }

    /**
     * @return string|null
     */
    public function getContent(): ?string
    {
        return $this->content;
    }

    /**
     * @param string $content
     *
     * @return void
     */
    public function setContent(string $content): void
    {
        $this->content = $content;
    }

    /**
     * @param WooCommerceProductDataFieldModel[] $fields
     * @return void
     */
    public function setFields(array $fields): void
    {
        foreach ($fields as $field) {
            $this->addField($field);
        }
    }

    /**
     * @param WooCommerceProductDataFieldModel $field
     *
     * @return void
     */
    public function addField(WooCommerceProductDataFieldModel $field): void
    {
        if (!$this->existsInCollection($field->getId(), $this->fields)) {
            $this->fields[] = $field;
        }
    }

    /**
     * @param WooCommerceProductDataFieldModel $field
     *
     * @return void
     */
    public function removeField(WooCommerceProductDataFieldModel $field): void
    {
        $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @return array<WooCommerceProductDataFieldModel>
     */
    public function getFields(): array
    {
        return $this->fields;
    }

    /**
     * @return WooCommerceProductDataModel
     */
    public function duplicate(): WooCommerceProductDataModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), WooCommerceProductDataRepository::getProductDataNames()));

        $fields = $duplicate->getFields();
        $duplicate->fields = [];

        foreach ($fields as $fieldModel) {
            $duplicate->fields[] = $fieldModel->duplicateFrom($duplicate);
        }

        return $duplicate;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'sluggedName' => $this->getSluggedName(),
            'icon' => $this->getIcon(),
            'visibility' => $this->getVisibility(),
            'showInUI' => $this->isShowInUI(),
            'content' => $this->getContent(),
            'fields' => $this->fields
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function validationRules(): array
    {
        return [
            'id' => [
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
            'icon' => [
                'required' => true,
                'type' => 'string|array|object',
            ],
            'visibility' => [
                'required' => true,
                'type' => 'string|array',
            ],
            'showInUI' => [
                'required' => true,
                'type' => 'boolean',
            ],
            'fields' => [
                'required' => false,
                'type' => 'array',
            ],
        ];
    }
}
