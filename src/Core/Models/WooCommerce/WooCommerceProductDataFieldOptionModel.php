<?php

namespace ACPT_Lite\Core\Models\WooCommerce;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * WooCommerceProductDataFieldOptionModel
 *
 * @since      1.0.1
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataFieldOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var WooCommerceProductDataFieldModel
     */
    private WooCommerceProductDataFieldModel $productDataField;

    /**
     * @var string
     */
    private string $label;

    /**
     * @var string
     */
    private string $value;

    /**
     * @var int
     */
    private int $sort;

    /**
     * WooCommerceProductDataFieldOptionModel constructor.
     *
     * @param string                           $id
     * @param WooCommerceProductDataFieldModel $productDataField
     * @param string                           $label
     * @param string                           $value
     * @param int                              $sort
     */
    public function __construct(
        string $id,
        WooCommerceProductDataFieldModel $productDataField,
        string $label,
        string $value,
        int $sort
    ) {
        parent::__construct($id);
        $this->productDataField = $productDataField;
        $this->label = $label;
        $this->value = $value;
        $this->sort  = $sort;
    }

    /**
     * @return WooCommerceProductDataFieldModel
     */
    public function getProductDataField(): WooCommerceProductDataFieldModel
    {
        return $this->productDataField;
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
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    /**
     * @param WooCommerceProductDataFieldModel $fieldModel
     * @return WooCommerceProductDataFieldOptionModel
     */
    public function duplicateFrom(WooCommerceProductDataFieldModel $fieldModel): WooCommerceProductDataFieldOptionModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->productDataField = $fieldModel;

        return $duplicate;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'productData' => $this->getProductDataField()->getProductData()->getId(),
            'fieldId' => $this->getProductDataField()->getId(),
            'label' => $this->label,
            'value' => $this->value,
            'sort' => (int)$this->sort
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
            'productDataFieldId' => [
                'required' => false,
                'type' => 'string',
            ],
            'productDataField' => [
                'required' => false,
                'type' => 'object',
                'instanceOf' => WooCommerceProductDataFieldModel::class
            ],
            'label' => [
                'required' => true,
                'type' => 'string',
            ],
            'value' => [
                'required' => true,
                'type' => 'string|integer',
            ],
            'sort' => [
                'required' => false,
                'type' => 'string|integer',
            ],
        ];
    }
}
