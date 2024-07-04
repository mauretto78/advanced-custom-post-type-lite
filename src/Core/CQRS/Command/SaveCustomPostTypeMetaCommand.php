<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class SaveCustomPostTypeMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
	/**
	 * @var int
	 */
	protected $postId;

	/**
	 * @var array
	 */
	protected array $metaGroups;

	/**
	 * SaveCustomPostTypeMetaCommand constructor.
	 *
	 * @param $postId
	 * @param MetaGroupModel[] $metaGroups
	 * @param array $data
	 */
	public function __construct($postId, array $metaGroups = [], array $data = [])
	{
		parent::__construct($data);
		$this->postId = $postId;
		$this->metaGroups = $metaGroups;
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		foreach ($this->metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $boxModel) {
				foreach ($boxModel->getFields() as $fieldModel) {
					$fieldModel->setBelongsToLabel(MetaTypes::CUSTOM_POST_TYPE);
					$fieldModel->setFindLabel(get_post_type($this->postId));
					$this->saveField($fieldModel, $this->postId, MetaTypes::CUSTOM_POST_TYPE);
				}
			}
		}
	}

	/**
	 * @param $location
	 * @return mixed
	 */
	public function addNoticeQueryVar( $location )
	{
		remove_filter( 'redirect_post_location', array( $this, 'addNoticeQueryVar' ), 99 );

		return add_query_arg( ['errors' => true], $location );
	}
}