<?php

namespace ACPT_Lite\Core\Models\User;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;

/**
 * MetaBoxModel
 *
 * @since      1.0.7
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class UserMetaBoxModel extends AbstractMetaBoxModel implements \JsonSerializable
{
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
	 * @return string
	 */
	public function metaType()
	{
		return MetaTypes::USER;
	}

	/**
	 * @inheritDoc
	 */
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'title' => $this->name,
			'label' => $this->label,
			'sort' => (int)$this->sort,
			'belongsTo' => $this->metaType(),
			'fields' => $this->fields
		];
	}
}