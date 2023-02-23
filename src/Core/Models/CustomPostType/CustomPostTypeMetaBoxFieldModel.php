<?php

namespace ACPT_Lite\Core\Models\CustomPostType;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;

/**
 * CustomPostTypeModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class CustomPostTypeMetaBoxFieldModel extends AbstractMetaBoxFieldModel implements \JsonSerializable
{
    const EMAIL_TYPE = 'Email';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';

	/**
	 * CustomPostTypeMetaBoxFieldModel constructor.
	 *
	 * @param $id
	 * @param CustomPostTypeMetaBoxModel $metaBox
	 * @param $title
	 * @param $type
	 * @param $showInArchive
	 * @param $required
	 * @param $sort
	 * @param null $defaultValue
	 * @param null $description
	 */
    public function __construct(
        $id,
	    CustomPostTypeMetaBoxModel $metaBox,
        $title,
        $type,
        $showInArchive,
        $required,
        $sort,
        $defaultValue = null,
        $description = null
    ) {
        parent::__construct($id);
        $this->metaBox = $metaBox;
        $this->name    = $title;
        $this->setType($type);
        $this->showInArchive = $showInArchive;
        $this->required = $required;
        $this->sort  = $sort;
        $this->defaultValue  = $defaultValue;
        $this->description  = $description;
        $this->options   = [];
    }

	/**
	 * @inheritDoc
	 */
	public function getAllowedTypes()
	{
		return [
			self::EMAIL_TYPE,
			self::SELECT_TYPE,
			self::TEXT_TYPE,
		];
	}

    /**
     * @return string
     */
    public function getDbName()
    {
        return Strings::toDBFormat($this->getMetaBox()->getName()).'_'.Strings::toDBFormat($this->name);
    }

    /**
     * @return string
     */
    public function getUiName()
    {
        return Strings::toHumanReadableFormat($this->getMetaBox()->getName()) . ' - ' . Strings::toHumanReadableFormat($this->name);
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaBox()->getId(),
            'db_name' => $this->getDbName(),
            'ui_name' => $this->getUiName(),
            'name' => $this->name,
            'type' => $this->type,
            'defaultValue' => $this->defaultValue,
            'description' => $this->description,
            'isRequired' => (bool)$this->required,
            'showInArchive' => (bool)$this->showInArchive,
            'sort' => $this->sort,
            'options' => $this->options,
            'relations' => [],
        ];
    }
}