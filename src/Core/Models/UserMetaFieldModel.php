<?php

namespace ACPT_Lite\Core\Models;

use ACPT_Lite\Core\Helper\Strings;

/**
 * UserMetaFieldModel
 *
 * @since      1.0.7
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class UserMetaFieldModel extends AbstractModel implements \JsonSerializable
{
    const EMAIL_TYPE = 'Email';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';

    /**
     * @var UserMetaBoxModel
     */
    private $metaBox;

    /**
     * @var string
     */
    private $name;

    /**
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
    private $showInArchive;

    /**
     * @var bool
     */
    private $required;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var UserMetaFieldOptionModel[]
     */
    private $options;

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
     * @return UserMetaBoxModel
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
     * @param $type
     */
    private function setType($type)
    {
        $allowedTypes = [
            self::EMAIL_TYPE,
            self::SELECT_TYPE,
            self::TEXT_TYPE,
        ];

        if(!in_array($type, $allowedTypes)){
            throw new \DomainException($type . ' is not a valid User field type');
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
     * @param UserMetaFieldOptionModel $option
     */
    public function addOption( UserMetaFieldOptionModel $option)
    {
        if(!$this->existsInCollection($option->getId(), $this->options)){
            $this->options[] = $option;
        }
    }

    /**
     * @param UserMetaFieldOptionModel $option
     */
    public function removeOption( UserMetaFieldOptionModel $option)
    {
        $this->removeFromCollection($option->getId(), $this->options);
    }

    /**
     * @return UserMetaFieldOptionModel[]
     */
    public function getOptions()
    {
        return $this->options;
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