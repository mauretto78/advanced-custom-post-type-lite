<?php

namespace ACPT_Lite\Core\Models\WooCommerce;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

/**
 * WooCommerceProductDataFieldModel
 *
 * @since      1.0.1
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataFieldModel extends AbstractModel implements \JsonSerializable
{
    public const CHECKBOX_TYPE = 'Checkbox';
    public const COLOR_TYPE = 'Color';
    public const DATE_TYPE = 'Date';
    public const DATE_TIME_TYPE = 'DateTime';
    public const EMAIL_TYPE = 'Email';
    public const NUMBER_TYPE = 'Number';
    public const PHONE_TYPE = 'Phone';
    public const POST_OBJECT_TYPE = 'PostObject';
    public const POST_OBJECT_MULTI_TYPE = 'PostObjectMulti';
    public const RADIO_TYPE = 'Radio';
    public const SELECT_TYPE = 'Select';
    public const SELECT_MULTI_TYPE = 'SelectMulti';
    public const TERM_OBJECT_TYPE = 'TermObject';
    public const TERM_OBJECT_MULTI_TYPE = 'TermObjectMulti';
    public const TEXT_TYPE = 'Text';
    public const TEXTAREA_TYPE = 'Textarea';
    public const TIME_TYPE = 'Time';
    public const URL_TYPE = 'Url';
    public const USER_TYPE = 'User';
    public const USER_MULTI_TYPE = 'UserMulti';

    /**
     * @var WooCommerceProductDataModel
     */
    private WooCommerceProductDataModel $productData;

    /**
     * @var string
     */
    private string $name;

    /**
     * @return string
     */
    public function getSluggedName(): string
    {
        return strtolower(str_replace(" ", "_", $this->name));
    }

    /**
     * @see https://woocommerce.github.io/code-reference/files/woocommerce-includes-admin-wc-meta-box-functions.html
     * @var string
     */
    private string $type;

    /**
     * @var string|null
     */
    private ?string $defaultValue = null;

    /**
     * @var string|null
     */
    private ?string $description = null;

    /**
     * @var bool
     */
    private bool $required;

    /**
     * @var int
     */
    private int $sort;

    /**
     * @var WooCommerceProductDataFieldOptionModel[]
     */
    private array $options = [];

    /**
     * WooCommerceProductDataFieldModel constructor.
     *
     * @param string                      $id
     * @param WooCommerceProductDataModel $productDataModel
     * @param string                      $name
     * @param string                      $type
     * @param bool                        $required
     * @param int                         $sort
     * @param string|null                 $defaultValue
     * @param string|null                 $description
     */
    public function __construct(
        string $id,
        WooCommerceProductDataModel $productDataModel,
        string $name,
        string $type,
        bool $required,
        int $sort,
        ?string $defaultValue = null,
        ?string $description = null
    ) {
        parent::__construct($id);
        $this->productData = $productDataModel;
        $this->name    = $name;
        $this->type    = $type;
        $this->required = $required;
        $this->sort  = $sort;
        $this->defaultValue  = $defaultValue;
        $this->description  = $description;
        $this->options   = [];
    }

    /**
     * @return WooCommerceProductDataModel
     */
    public function getProductData()
    {
        return $this->productData;
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
    public function getType(): string
    {
        return $this->type;
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
     * @return bool
     */
    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    /**
     * @param WooCommerceProductDataFieldOptionModel $option
     *
     * @return void
     */
    public function addOption(WooCommerceProductDataFieldOptionModel $option): void
    {
        if (!$this->existsInCollection($option->getId(), $this->options)) {
            $this->options[] = $option;
        }
    }

    /**
     * @param WooCommerceProductDataFieldOptionModel $option
     *
     * @return void
     */
    public function removeOption(WooCommerceProductDataFieldOptionModel $option): void
    {
        $this->removeFromCollection($option->getId(), $this->options);
    }

    /**
     * @return WooCommerceProductDataFieldOptionModel[]
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * @return string
     */
    public function getDBName(): string
    {
        return '_' . Strings::toDBFormat($this->getProductData()->getName()) . '_' . Strings::toDBFormat($this->name);
    }

    /**
     * @return string
     */
    public function getUiName(): string
    {
        return Strings::toHumanReadableFormat($this->getProductData()->getName()) . ' - ' . Strings::toHumanReadableFormat($this->name);
    }

    /**
     * @param WooCommerceProductDataModel $productDataModel
     * @return WooCommerceProductDataFieldModel
     */
    public function duplicateFrom(WooCommerceProductDataModel $productDataModel): WooCommerceProductDataFieldModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), WooCommerceProductDataRepository::getProductDataFieldNames()));
        $duplicate->productData = $productDataModel;

        $options = $duplicate->getOptions();
        $duplicate->options = [];

        foreach ($options as $optionModel) {
            $duplicate->options[] = $optionModel->duplicateFrom($duplicate);
        }

        return $duplicate;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'productData' => $this->getProductData()->getId(),
            'db_name' => $this->getDBName(),
            'ui_name' => $this->getUiName(),
            'name' => $this->name,
            'type' => $this->type,
            'defaultValue' => $this->defaultValue,
            'description' => $this->description,
            'isRequired' => (bool)$this->required,
            'sort' => (int)$this->sort,
            'options' => $this->options,
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
            'productDataModelId' => [
                'required' => false,
                'type' => 'string',
            ],
            'productDataModel' => [
                'required' => false,
                'type' => 'object',
                'instanceOf' => WooCommerceProductDataModel::class
            ],
            'name' => [
                'required' => true,
                'type' => 'string',
            ],
            'new_name' => [
                'required' => false,
                'type' => 'string',
            ],
            'type' => [
                'required' => true,
                'type' => 'string',
                'enum' => [
                    WooCommerceProductDataFieldModel::CHECKBOX_TYPE,
                    WooCommerceProductDataFieldModel::COLOR_TYPE,
                    WooCommerceProductDataFieldModel::DATE_TYPE,
                    WooCommerceProductDataFieldModel::DATE_TIME_TYPE,
                    WooCommerceProductDataFieldModel::EMAIL_TYPE,
                    WooCommerceProductDataFieldModel::NUMBER_TYPE,
                    WooCommerceProductDataFieldModel::PHONE_TYPE,
                    WooCommerceProductDataFieldModel::POST_OBJECT_TYPE,
                    WooCommerceProductDataFieldModel::POST_OBJECT_MULTI_TYPE,
                    WooCommerceProductDataFieldModel::RADIO_TYPE,
                    WooCommerceProductDataFieldModel::SELECT_TYPE,
                    WooCommerceProductDataFieldModel::SELECT_MULTI_TYPE,
                    WooCommerceProductDataFieldModel::TERM_OBJECT_TYPE,
                    WooCommerceProductDataFieldModel::TERM_OBJECT_MULTI_TYPE,
                    WooCommerceProductDataFieldModel::TEXT_TYPE,
                    WooCommerceProductDataFieldModel::TEXTAREA_TYPE,
                    WooCommerceProductDataFieldModel::TIME_TYPE,
                    WooCommerceProductDataFieldModel::URL_TYPE,
                    WooCommerceProductDataFieldModel::USER_TYPE,
                    WooCommerceProductDataFieldModel::USER_MULTI_TYPE,
                ],
            ],
            'required' => [
                'required' => true,
                'type' => 'boolean',
            ],
            'sort' => [
                'required' => false,
                'type' => 'string|integer',
            ],
            'defaultValue' => [
                'required' => false,
                'type' => 'string',
            ],
            'description' => [
                'required' => false,
                'type' => 'string',
            ],
        ];
    }
}
