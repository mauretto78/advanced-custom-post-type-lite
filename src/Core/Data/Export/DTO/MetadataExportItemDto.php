<?php

namespace ACPT_Lite\Core\Data\Export\DTO;

use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class MetadataExportItemDto
{
	/**
	 * @var mixed
	 */
	public $id;

	/**
	 * @var string
	 */
	public $belongsTo;

	/**
	 * @var string
	 */
	public $find;

	/**
	 * @var MetaGroupModel[]
	 */
	public $metaGroups = [];
}