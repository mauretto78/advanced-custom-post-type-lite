<?php

namespace ACPT\Core\Generators\Attachment;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class AttachmentMetaGroupGenerator extends AbstractGenerator
{
	/**
	 * @var MetaGroupModel
	 */
	private MetaGroupModel $groupModel;

	/**
	 * @var array
	 */
	private $attachmentIds;

	/**
	 * AttachmentMetaGroupGenerator constructor.
	 *
	 * @param MetaGroupModel $groupModel
	 * @param $attachmentIds
	 */
	public function __construct(MetaGroupModel $groupModel, $attachmentIds)
	{
		$this->groupModel = $groupModel;
		$this->attachmentIds = $attachmentIds;
	}

	/**
	 * Generate meta boxes related to attachments
	 */
	public function generate()
	{
		foreach ($this->groupModel->getBoxes() as $box){
			$generator = new AttachmentMetaBoxGenerator($box, $this->attachmentIds);
			$generator->generate();
		}
	}
}
