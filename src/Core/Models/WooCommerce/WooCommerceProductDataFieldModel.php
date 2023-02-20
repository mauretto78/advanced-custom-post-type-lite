<?php

namespace ACPT_Lite\Core\Models\WooCommerce;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * WooCommerceProductDataFieldModel
 *
 * @since      1.0.1
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataFieldModel extends AbstractModel implements \JsonSerializable
{
    const CHECKBOX_TYPE = 'Checkbox';
    const RADIO_TYPE = 'Radio';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';
    const TEXTAREA_TYPE = 'Textarea';

    /**
     * @var WooCommerceProductDataModel
     */
    private $productData;

    /**
     * @var string
     */
    private $name;

    /**
     * @return string
     */
    public function getSluggedName()
    {
        return strtolower(str_replace(" ", "_", $this->name));
    }

    /**
     * @see https://woocommerce.github.io/code-reference/files/woocommerce-includes-admin-wc-meta-box-functions.html
     * @var string
     */
    private $type;

    /**
     * @var string
     */
    private $defaultValue;

    /**
     * @var string
     */
    private $description;

    /**
     * @var bool
     */
    private $required;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var WooCommerceProductDataFieldOptionModel[]
     */
    private $options;

    /**
     * WooCommerceProductDataFieldModel constructor.
     *
     * @param                             $id
     * @param WooCommerceProductDataModel $productDataModel
     * @param                             $name
     * @param                             $type
     * @param                             $required
     * @param                             $sort
     * @param null                        $defaultValue
     * @param null                        $description
     */
    public function __construct(
            $id,
            WooCommerceProductDataModel $productDataModel,
            $name,
            $type,
            $required,
            $sort,
            $defaultValue = null,
            $description = null
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
    public function getProductData() {
        return $this->productData;
    }

    /**
     * @return string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getType() {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getDefaultValue() {
        return $this->defaultValue;
    }

    /**
     * @return string
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * @return bool
     */
    public function isRequired() {
        return $this->required;
    }

    /**
     * @return int
     */
    public function getSort() {
        return $this->sort;
    }

    /**
     * @param WooCommerceProductDataFieldOptionModel $option
     */
    public function addOption(WooCommerceProductDataFieldOptionModel $option)
    {
        if(!$this->existsInCollection($option->getId(), $this->options)){
            $this->options[] = $option;
        }
    }

    /**
     * @param WooCommerceProductDataFieldOptionModel $option
     */
    public function removeOption(WooCommerceProductDataFieldOptionModel $option)
    {
        $this->removeFromCollection($option->getId(), $this->options);
    }

    /**
     * @return WooCommerceProductDataFieldOptionModel[]
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @return string
     */
    public function getDBName()
    {
        return '_' . Strings::toDBFormat($this->getProductData()->getName()) . '_' . Strings::toDBFormat($this->name);
    }

    /**
     * @return string
     */
    public function getUiName()
    {
        return Strings::toHumanReadableFormat($this->getProductData()->getName()) . ' - ' . Strings::toHumanReadableFormat($this->name);
    }

    /**
     * @inheritDoc
     */
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
            'sort' => $this->sort,
            'options' => $this->options,
        ];
    }
}
