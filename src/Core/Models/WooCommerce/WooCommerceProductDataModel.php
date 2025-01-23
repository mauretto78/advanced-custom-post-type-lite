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
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WooCommerceProductDataModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var array
     */
    private $icon;

    /**
     * @var array
     */
    private $visibility;

    /**
     * @var bool
     */
    private $showInUI;

    /**
     * @var string
     */
    private $content;

    /**
     * @var WooCommerceProductDataFieldModel[]
     */
    private $fields = [];

    /**
     * WooCommerceProductData constructor.
     *
     * @param $id
     * @param $name
     * @param $icon
     * @param $visibility
     * @param $showInUI
     */
    public function __construct(
        $id,
        $name,
        $icon,
        $visibility,
        $showInUI
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

    public function getSluggedName()
    {
        return strtolower(str_replace(" ", "_", $this->name));
    }

    /**
     * @return array
     */
    public function getIcon() {
        return $this->icon;
    }

    /**
     * @return array
     */
    public function getVisibility() {
        return $this->visibility;
    }

    /**
     * @return bool
     */
    public function isShowInUI() {
        return $this->showInUI;
    }

    /**
     * @return string
     */
    public function getContent() {
        return $this->content;
    }

    /**
     * @param string $content
     */
    public function setContent( $content ) {
        $this->content = $content;
    }

    public function setFields(array $fields)
    {
        foreach ($fields as $field){
            $this->addField($field);
        }
    }

    /**
     * @param WooCommerceProductDataFieldModel $field
     */
    public function addField(WooCommerceProductDataFieldModel $field)
    {
        if(!$this->existsInCollection($field->getId(), $this->fields)){
            $this->fields[] = $field;
        }
    }

    /**
     * @param WooCommerceProductDataFieldModel $field
     */
    public function removeField(WooCommerceProductDataFieldModel $field)
    {
        $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @return array|WooCommerceProductDataFieldModel[]
     */
    public function getFields()
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

        foreach ($fields as $fieldModel){
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
	 * @inheritDoc
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