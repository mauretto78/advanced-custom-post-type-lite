<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class SaveCommentMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
	/**
	 * @var
	 */
	protected $commentId;

	/**
	 * @var MetaGroupModel[]
	 */
	protected array $metaGroups;

	/**
	 * SaveCommentMetaCommand constructor.
	 *
	 * @param $commentId
	 * @param array $metaGroups
	 * @param array $data
	 * @param array $files
	 */
	public function __construct($commentId, array $metaGroups = [], array $data = [], array $files = [])
	{
		parent::__construct($data);
		$this->files      = $files;
		$this->commentId  = $commentId;
		$this->metaGroups = $metaGroups;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		foreach ($this->metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $boxModel){
				foreach ($boxModel->getFields() as $fieldModel){
					if($this->hasField($fieldModel)){
						$fieldModel->setBelongsToLabel(MetaTypes::COMMENT);
						$this->saveField($fieldModel, $this->commentId, MetaTypes::COMMENT);
					}
				}
			}
		}
	}
}