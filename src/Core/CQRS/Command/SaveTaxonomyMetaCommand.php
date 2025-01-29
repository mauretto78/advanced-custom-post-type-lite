<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;

class SaveTaxonomyMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
	/**
	 * @var
	 */
	protected $termId;

	/**
	 * SaveTaxonomyMetaCommand constructor.
	 *
	 * @param $termId
	 * @param array $data
	 */
	public function __construct($termId, array $data = [])
	{
		parent::__construct($data);
		$this->termId = $termId;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$termId = $this->termId;
		$taxonomyObject = get_term($termId);
		$taxonomy = $taxonomyObject->taxonomy;

		$taxonomyMetaGroups = MetaRepository::get([
			'belongsTo' => MetaTypes::TAXONOMY,
			'find' => $taxonomy,
            'clonedFields' => true,
		]);

		$termMetaGroups = MetaRepository::get([
			'belongsTo' => BelongsTo::TERM_ID,
			'find' => $termId,
            'clonedFields' => true,
		]);

		/** @var MetaGroupModel[] $metaGroups */
		$metaGroups = array_merge($taxonomyMetaGroups, $termMetaGroups);

		foreach ($metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $metaBoxModel) {
				foreach ($metaBoxModel->getFields() as $fieldModel){
					if($this->hasField($fieldModel)){
						$fieldModel->setBelongsToLabel(MetaTypes::TAXONOMY);
						$fieldModel->setFindLabel($taxonomy);
						$this->saveField($fieldModel, $this->termId, MetaTypes::TAXONOMY);
					}
				}
			}
		}
	}
}

