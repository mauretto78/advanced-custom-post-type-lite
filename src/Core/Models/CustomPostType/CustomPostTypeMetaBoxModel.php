<?php

namespace ACPT_Lite\Core\Models\CustomPostType;

use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Costants\MetaTypes;

/**
 * MetaBoxModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class CustomPostTypeMetaBoxModel extends AbstractMetaBoxModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $postType;

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
	 * @param $postType
	 */
	public function changePostType($postType)
	{
		$this->postType = $postType;
	}

	/**
	 * @return string
	 */
	public function getPostType()
	{
		return $this->postType;
	}

	/**
	 * @inheritDoc
	 */
	public function metaType()
	{
		return MetaTypes::CUSTOM_POST_TYPE;
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