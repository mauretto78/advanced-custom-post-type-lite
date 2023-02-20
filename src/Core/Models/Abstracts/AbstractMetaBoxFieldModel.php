<?php

namespace ACPT_Lite\Core\Models\Abstracts;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxModel;
use ACPT_Lite\Core\Models\MetaField\MetaBoxFieldOptionModel;

/**
 * AbstractMetaBoxFieldModel
 *
 * @since      1.0.14
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractMetaBoxFieldModel extends AbstractModel
{
    const EMAIL_TYPE = 'Email';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';

    /**
     * @var CustomPostTypeMetaBoxModel
     */
    protected $metaBox;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $type;

    /**
     * @var string
     */
    protected $defaultValue;

    /**
     * @var string
     */
    protected $description;

    /**
     * @var bool
     */
    protected $showInArchive;

    /**
     * @var bool
     */
    protected $required;

    /**
     * @var int
     */
    protected $sort;

    /**
     * @var MetaBoxFieldOptionModel[]
     */
    protected $options = [];

	/**
	 * @param AbstractMetaBoxModel $metaBoxModel
	 */
	public function changeMetaBox(AbstractMetaBoxModel $metaBoxModel)
	{
		$this->metaBox = $metaBoxModel;
	}

    /**
     * @return AbstractMetaBoxModel
     */
    public function getMetaBox()
    {
        return $this->metaBox;
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
     * @param $type
     */
    protected function setType($type)
    {
        if(!in_array($type, $this->getAllowedTypes())){
            throw new \DomainException($type . ' is not a valid field type for this meta box field');
        }

        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @return bool
     */
    public function isShowInArchive()
    {
        return $this->showInArchive;
    }

    /**
     * @return bool
     */
    public function isRequired()
    {
        return $this->required;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
    }

    /**
     * @param MetaBoxFieldOptionModel $option
     */
    public function addOption(MetaBoxFieldOptionModel $option)
    {
        if(!$this->existsInCollection($option->getId(), $this->options)){
            $this->options[] = $option;
        }
    }

    /**
     * @param MetaBoxFieldOptionModel $option
     */
    public function removeOption(MetaBoxFieldOptionModel $option)
    {
        $this->removeFromCollection($option->getId(), $this->options);
    }

    /**
     * Clear all options
     */
    public function clearOptions()
    {
        $this->options = [];
    }

    /**
     * @return MetaBoxFieldOptionModel[]
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @return array
     */
    public function getOptionValues()
    {
        $values = [];

        foreach ($this->getOptions() as $option){
            $values[] = $option->getValue();
        }

        return $values;
    }

    /**
     * @return array
     */
    abstract public function getAllowedTypes();

    /**
     * @return string
     */
    abstract public function getDbName();

    /**
     * @return string
     */
    abstract public function getUiName();

	/**
	 * @return AbstractMetaBoxFieldModel
	 */
	public function duplicate()
	{
		return $this->duplicateFrom($this->getMetaBox());
	}

	/**
	 * @param AbstractMetaBoxModel $duplicateFrom
	 *
	 * @return AbstractMetaBoxFieldModel
	 */
	public function duplicateFrom(AbstractMetaBoxModel $duplicateFrom)
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->metaBox = $duplicateFrom;

		$duplicatedOptions = $duplicate->getOptions();

		$duplicate->options = [];

		foreach ($duplicatedOptions as $option){
			$optionFieldModel = $option->duplicateFrom($duplicate);
			$duplicate->addOption($optionFieldModel);
		}

		return $duplicate;
	}
}