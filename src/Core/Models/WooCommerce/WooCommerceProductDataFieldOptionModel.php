<?php

namespace ACPT_Lite\Core\Models\WooCommerce;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * WooCommerceProductDataFieldOptionModel
 *
 * @since      1.0.1
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataFieldOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var WooCommerceProductDataFieldModel
     */
    private $productDataField;

    /**
     * @var string
     */
    private $label;

    /**
     * @var string
     */
    private $value;

    /**
     * @var int
     */
    private $sort;

    /**
     * WooCommerceProductDataFieldOptionModel constructor.
     *
     * @param                                  $id
     * @param WooCommerceProductDataFieldModel $productDataField
     * @param                                  $label
     * @param                                  $value
     * @param                                  $sort
     */
    public function __construct(
            $id,
            WooCommerceProductDataFieldModel $productDataField,
            $label,
            $value,
            $sort
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
    public function getProductDataField()
    {
        return $this->productDataField;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
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
	 * @inheritDoc
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