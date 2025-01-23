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
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataFieldModel extends AbstractModel implements \JsonSerializable
{
    const CHECKBOX_TYPE = 'Checkbox';
    const COLOR_TYPE = 'Color';
    const DATE_TYPE = 'Date';
    const DATE_TIME_TYPE = 'DateTime';
    const EMAIL_TYPE = 'Email';
    const NUMBER_TYPE = 'Number';
    const PHONE_TYPE = 'Phone';
    const POST_OBJECT_TYPE = 'PostObject';
    const POST_OBJECT_MULTI_TYPE = 'PostObjectMulti';
    const RADIO_TYPE = 'Radio';
    const SELECT_TYPE = 'Select';
    const SELECT_MULTI_TYPE = 'SelectMulti';
    const TERM_OBJECT_TYPE = 'TermObject';
    const TERM_OBJECT_MULTI_TYPE = 'TermObjectMulti';
    const TEXT_TYPE = 'Text';
    const TEXTAREA_TYPE = 'Textarea';
    const TIME_TYPE = 'Time';
    const URL_TYPE = 'Url';
    const USER_TYPE = 'User';
    const USER_MULTI_TYPE = 'UserMulti';

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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param $name
     */
    public function changeName($name)
    {
        $this->name = $name;
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
     * @param WooCommerceProductDataModel $productDataModel
     * @return WooCommerceProductDataFieldModel
     */
    public function duplicateFrom(WooCommerceProductDataModel $productDataModel)
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), WooCommerceProductDataRepository::getProductDataFieldNames()));
        $duplicate->productData = $productDataModel;

        $options = $duplicate->getOptions();
        $duplicate->options = [];

        foreach ($options as $optionModel){
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
