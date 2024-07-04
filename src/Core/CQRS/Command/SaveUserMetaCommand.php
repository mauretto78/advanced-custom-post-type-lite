<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class SaveUserMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
	/**
	 * @var
	 */
	protected $userId;

	/**
	 * @var MetaGroupModel[]
	 */
	protected array $metaGroups;

	/**
	 * SaveUserMetaCommand constructor.
	 *
	 * @param $userId
	 * @param array $metaGroups
	 * @param array $data
	 */
	public function __construct($userId, array $metaGroups = [], array $data = [])
	{
		parent::__construct($data);
		$this->userId     = $userId;
		$this->metaGroups = $metaGroups;
	}

	/**
	 * @return bool|mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$user_id = $this->userId;

		if ( !current_user_can( 'edit_user', $user_id ) ){
			return false;
		}

		foreach ($this->metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $boxModel){
				foreach ($boxModel->getFields() as $fieldModel){
					$fieldModel->setBelongsToLabel(MetaTypes::USER);
					$this->saveField($fieldModel, $this->userId, MetaTypes::USER);
				}
			}
		}
	}
}