<?php

namespace ACPT_Lite\Core\Models\User;

use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Core\Helper\Strings;

/**
 * UserMetaFieldModel
 *
 * @since      1.0.7
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class UserMetaFieldModel extends AbstractMetaBoxFieldModel implements \JsonSerializable
{
    const EMAIL_TYPE = 'Email';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';

    /**
     * UserFieldModel constructor.
     *
     * @param                  $id
     * @param UserMetaBoxModel $metaBox
     * @param string           $name
     * @param string           $type
     * @param bool             $showInArchive
     * @param                  $required
     * @param int              $sort
     * @param null             $defaultValue
     * @param null             $description
     */
    public function __construct(
            $id,
            UserMetaBoxModel $metaBox,
            $name,
            $type,
            $showInArchive,
            $required,
            $sort,
            $defaultValue = null,
            $description = null
    ) {
        parent::__construct($id);
        $this->name    = $name;
        $this->metaBox    = $metaBox;
        $this->setType($type);
        $this->showInArchive = $showInArchive;
        $this->required = $required;
        $this->sort  = $sort;
        $this->defaultValue  = $defaultValue;
        $this->description  = $description;
        $this->options   = [];
    }

    /**
     * @return string
     */
    public function getDbName()
    {
        return Strings::toDBFormat($this->name);
    }

    /**
     * @return string
     */
    public function getUiName()
    {
        return Strings::toHumanReadableFormat($this->name);
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
     * @return array
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
        ];
    }
}