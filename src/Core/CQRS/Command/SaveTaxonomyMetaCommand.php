<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Arrays;
use ACPT_Lite\Utils\Sanitizer;

class SaveTaxonomyMetaCommand implements CommandInterface
{
	/**
	 * @var
	 */
	private $termId;

	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveTaxonomyMetaCommand constructor.
	 *
	 * @param $termId
	 * @param array $data
	 */
	public function __construct($termId, array $data = [])
	{
		$this->termId = $termId;
		$this->data = $data;
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
		]);

		$termMetaGroups = MetaRepository::get([
			'belongsTo' => BelongsTo::TERM_ID,
			'find' => $termId,
		]);

		/** @var MetaGroupModel[] $metaGroups */
		$metaGroups = array_merge($taxonomyMetaGroups, $termMetaGroups);

		foreach ($metaGroups as $metaGroup){
			foreach ($metaGroup->getBoxes() as $metaBoxModel) {
				foreach ($metaBoxModel->getFields() as $fieldModel){
					$this->saveField($fieldModel);
				}
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private function saveField(MetaFieldModel $fieldModel)
	{
		$data = $this->data;
		$termId = $this->termId;
		$idName = Strings::toDBFormat($fieldModel->getBox()->getName()) . '_' . Strings::toDBFormat($fieldModel->getName());

		if(isset($data[$idName])){

			$rawValue = $data[$idName];

			// validation
			try {
				MetaDataValidator::validate($fieldModel->getType(), $rawValue);
			} catch (\Exception $exception){
				wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
			}

			if(is_array($rawValue)){
				$rawValue = Arrays::reindex($rawValue);
			}

			update_term_meta(
				$termId,
				$idName,
				Sanitizer::sanitizeRawData($fieldModel->getType(), $rawValue)
			);


			$extras = [
				'type',
				'label',
				'currency',
				'weight',
				'length',
				'lat',
				'lng',
			];

			foreach ($extras as $extra){
				if(isset($data[$idName.'_'.$extra])){
					update_term_meta(
						$termId,
						$idName.'_'.$extra,
						Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $data[$idName.'_'.$extra] )
					);
				}
			}
		}
	}
}

