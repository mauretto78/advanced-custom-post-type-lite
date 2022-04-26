<?php

namespace ACPT_Lite\Core\Models;

use ACPT_Lite\Core\Helper\Strings;

/**
 * CustomPostTypeModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaBoxFieldModel extends AbstractModel implements \JsonSerializable
{
    const DATE_TYPE = 'Date';
    const EMAIL_TYPE = 'Email';
    const NUMBER_TYPE = 'Number';
    const POST_TYPE = 'Post';
    const SELECT_TYPE = 'Select';
    const TEXT_TYPE = 'Text';

    /**
     * @var MetaBoxModel
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
     * @var MetaBoxFieldOptionModel[]
     */
    private $options;

    /**
     * @var MetaBoxFieldRelationshipModel[]
     */
    private $relations;

    /**
     * MetaBoxFieldModel constructor.
     *
     * @param              $id
     * @param MetaBoxModel $metaBox
     * @param string       $title
     * @param string       $type
     * @param bool         $showInArchive
     * @param              $required
     * @param int          $sort
     * @param null         $defaultValue
     * @param null         $description
     */
    public function __construct(
        $id,
        MetaBoxModel $metaBox,
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
        $this->relations = [];
    }

    /**
     * @return MetaBoxModel
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
            throw new \DomainException($type . ' is not a valid meta box field type');
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
     * @return MetaBoxFieldOptionModel[]
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param MetaBoxFieldRelationshipModel $relation
     */
    public function addRelation(MetaBoxFieldRelationshipModel $relation)
    {
        if(!$this->existsInCollection($relation->getId(), $this->relations)){
            $this->relations[] = $relation;
        }
    }

    /**
     * @param MetaBoxFieldRelationshipModel $relation
     */
    public function removeRelation(MetaBoxFieldRelationshipModel $relation)
    {
        $this->removeFromCollection($relation->getId(), $this->relations);
    }

    /**
     * @return MetaBoxFieldRelationshipModel[]
     */
    public function getRelations()
    {
        return $this->relations;
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
            'relations' => $this->relations,
        ];
    }
}