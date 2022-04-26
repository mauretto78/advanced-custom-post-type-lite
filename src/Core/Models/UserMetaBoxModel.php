<?php

namespace ACPT_Lite\Core\Models;

/**
 * MetaBoxModel
 *
 * @since      1.0.7
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class UserMetaBoxModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var UserMetaFieldModel[]
     */
    private $fields = [];

    /**
     * UserMetaBoxModel constructor.
     *
     * @param $id
     * @param $name
     * @param $sort
     */
    public function __construct(
            $id,
            $name,
            $sort
    )
    {
        parent::__construct($id);
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
    }

    /**
     * @param $name
     * @param $sort
     */
    public function edit(
            $name,
            $sort
    )
    {
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
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
     * @param UserMetaFieldModel $field
     */
    public function addField(UserMetaFieldModel $field)
    {
        if(!$this->existsInCollection($field->getId(), $this->fields)){
            $this->fields[] = $field;
        }
    }

    /**
     * @param UserMetaFieldModel $field
     */
    public function removeField(UserMetaFieldModel $field)
    {
        $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @return array|UserMetaFieldModel[]
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
                'id' => $this->id,
                'name' => $this->name,
                'sort' => $this->sort,
                'fields' => $this->fields
        ];
    }
}