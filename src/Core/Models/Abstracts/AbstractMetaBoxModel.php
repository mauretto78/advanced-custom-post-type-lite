<?php

namespace ACPT_Lite\Core\Models\Abstracts;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Costants\MetaTypes;

/**
 * AbstractMetaBoxModel
 *
 * @since      1.0.14
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractMetaBoxModel extends AbstractModel
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var int
     */
    protected $sort;

    /**
     * @var AbstractMetaBoxFieldModel[]
     */
    protected $fields = [];

    /**
     * @return string
     */
    abstract public function metaType();

    /**
     * @return bool
     */
    public function belongsToCustomPostType()
    {
        return $this->metaType() === MetaTypes::CUSTOM_POST_TYPE;
    }

    /**
     * @return bool
     */
    public function belongsToTaxonomy()
    {
        return $this->metaType() === MetaTypes::TAXONOMY;
    }

    /**
     * @return bool
     */
    public function belongsToUser()
    {
        return $this->metaType() === MetaTypes::USER;
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param $sort
     */
    public function changeSort($sort)
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
     * @param AbstractMetaBoxFieldModel $field
     */
    public function addField(AbstractMetaBoxFieldModel $field)
    {
        if(!$this->existsInCollection($field->getId(), $this->fields)){
            $this->fields[] = $field;
        }
    }

    /**
     * @param AbstractMetaBoxFieldModel $field
     */
    public function removeField(AbstractMetaBoxFieldModel $field)
    {
        $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @return array|AbstractMetaBoxFieldModel[]
     */
    public function getFields()
    {
        return $this->fields;
    }

	/**
	 * @return AbstractMetaBoxModel
	 */
	public function duplicate()
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicatedFields = $duplicate->getFields();
		$duplicate->fields = [];

		foreach ($duplicatedFields as $field){
			$duplicatedFieldModel = $field->duplicateFrom($duplicate);
			$duplicate->addField($duplicatedFieldModel);
		}

		return $duplicate;
	}
}