<?php

namespace ACPT_Lite\Core\Models;

/**
 * MetaBoxModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaBoxModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $postType;

    /**
     * @var string
     */
    private $name;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var MetaBoxFieldModel[]
     */
    private $fields = [];

    /**
     * MetaBoxModel constructor.
     *
     * @param        $id
     * @param int    $postType
     * @param string $name
     * @param int    $sort
     */
    public function __construct(
        $id,
        $postType,
        $name,
        $sort
    )
    {
        parent::__construct($id);
        $this->postType = $postType;
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
    }

    /**
     * @param $postType
     * @param $name
     * @param $sort
     */
    public function edit(
        $postType,
        $name,
        $sort
    )
    {
        $this->postType = $postType;
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
    }

    /**
     * @return string
     */
    public function getPostType()
    {
        return $this->postType;
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
     * @param MetaBoxFieldModel $field
     */
    public function addField(MetaBoxFieldModel $field)
    {
        if(!$this->existsInCollection($field->getId(), $this->fields)){
            $this->fields[] = $field;
        }
    }

    /**
     * @param MetaBoxFieldModel $field
     */
    public function removeField(MetaBoxFieldModel $field)
    {
        $this->removeFromCollection($field->getId(), $this->fields);
    }

    /**
     * @return array|MetaBoxFieldModel[]
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
            'title' => $this->name,
            'postType' => $this->postType,
            'sort' => $this->sort,
            'fields' => $this->fields
        ];
    }
}