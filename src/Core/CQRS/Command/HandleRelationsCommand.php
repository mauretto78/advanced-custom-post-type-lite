<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Relationships;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldRelationshipModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;

class HandleRelationsCommand implements CommandInterface
{
	/**
	 * @var MetaFieldModel
	 */
	private MetaFieldModel $fieldModel;

	/**
	 * @var mixed
	 */
	private $rawValue;

	/**
	 * @var mixed
	 */
	private $entityId;

	/**
	 * @var string
	 */
	private $entityType;

	/**
	 * HandleRelationsCommand constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $rawValue
	 * @param $entityId
	 * @param $entityType
	 */
	public function __construct(MetaFieldModel $fieldModel, $rawValue, $entityId, $entityType)
	{
		$this->fieldModel = $fieldModel;
		$this->rawValue = $rawValue;
		$this->entityId = $entityId;
		$this->entityType = $entityType;
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		if($this->fieldModel->getRelations() === null){
			return;
		}

		ACPT_Lite_DB::flushCache();

		$fieldType = $this->fieldModel->getType();
		$idName = $this->fieldModel->getDbName();
		$relation = $this->fieldModel->getRelations()[0];
		$rawValues = explode(",", $this->rawValue);

		if(empty($this->rawValue)){
			Meta::delete($this->entityId, $this->entityType, $idName);
			Meta::delete($this->entityId, $this->entityType,$idName.'_id');
			Meta::delete($this->entityId, $this->entityType,$idName.'_type');
		} else {
			Meta::save($this->entityId, $this->entityType, $idName, Sanitizer::sanitizeRawData($fieldType, $rawValues));
			Meta::save($this->entityId, $this->entityType, $idName.'_id', $this->fieldModel->getId());
			Meta::save($this->entityId, $this->entityType, $idName.'_type', MetaFieldModel::POST_TYPE);
		}

		// Handle bidirectional relations
		if($relation->getInversedBy()){
			$this->handleInversedRelation($relation, $rawValues);
		}
	}

	/**
	 * Handle bidirectional relations
	 *
	 * @param MetaFieldRelationshipModel $relation
	 * @param $rawValues
	 *
	 * @throws \Exception
	 */
	private function handleInversedRelation(MetaFieldRelationshipModel $relation, $rawValues)
	{
		try {
			$belongsTo = $relation->to()->getType();
			$fieldName = $relation->getMetaField()->getDbName();
			$inversedFieldModel = $relation->getInversedBy();
			$inversedIdName = $inversedFieldModel->getDbName();
			$inversedFieldRelationship = $relation->getOppositeRelationship();
			$savedValues = [];

			// save values on other fields
			foreach ($rawValues as $id){
				if(!empty($id)){
					$id = (is_numeric($id)) ? (int)$id : $id;

					// append values if the opposite is MULTI, otherwise override
					$getValue = Meta::fetch($id, $belongsTo, $inversedIdName);
					$savedValues = (!empty($getValue) and is_array($getValue)) ? $getValue : [];

					// is a post ID, term ID or user ID
					if(is_numeric($this->entityId)){
						$savedValues[] = $this->entityId;
					} elseif(isset($this->optionPageModel)) {
						$savedValues[] = $this->getOptionPage()->getId();
					}

					$savedValues = array_unique($savedValues);

					// If $belongsTo is OPTION_PAGE, then $inversedIdName needs to be prefixed
					if($belongsTo === MetaTypes::OPTION_PAGE){
						$page = OptionPageRepository::getById($id, true);

						if($page !== null){
							$inversedIdName = $page->getMenuSlug().'_'.$inversedIdName;
						}
					}

					if(!empty($savedValues)){
						Meta::save($id, $belongsTo, $inversedIdName, Sanitizer::sanitizeRawData($inversedFieldModel->getType(), $savedValues));
						Meta::save($id, $belongsTo, $inversedIdName.'_id', $inversedFieldModel->getId());
						Meta::save($id, $belongsTo, $inversedIdName.'_type', $inversedFieldModel->getType());
					}
				}
			}

			// If we are adding elements...
			if(count($savedValues) <= count($rawValues)){
				$this->handleRelatedEntities(
					$inversedFieldRelationship,
					$belongsTo,
					$fieldName,
					$inversedIdName,
					$rawValues,
					$savedValues
				);
			}

		} catch (\Exception $exception){}
	}

	/**
	 * @param string $inversedFieldRelationship
	 * @param string $inversedFieldMetaType
	 * @param string $fieldName
	 * @param string $inversedFieldName
	 * @param array $rawValues
	 * @param array $savedValues
	 *
	 * @throws \Exception
	 */
	private function handleRelatedEntities(
		$inversedFieldRelationship,
		$inversedFieldMetaType,
		$fieldName,
		$inversedFieldName,
		$rawValues = [],
		$savedValues = []
	)
	{
		switch ($inversedFieldRelationship){

			// 1<-->1 BI
			case Relationships::ONE_TO_ONE_BI:
				$this->handleOneToOneInversedRelation($fieldName, $inversedFieldMetaType, $inversedFieldName, $savedValues, $rawValues);
				break;

			// M<-->1 BI
			case Relationships::MANY_TO_ONE_BI:
				$this->handleManyToOneOneInversedRelation($fieldName, $inversedFieldMetaType, $inversedFieldName, $savedValues, $rawValues);
				break;

			// 1<-->M BI
			case Relationships::ONE_TO_MANY_BI:
				$this->handleOneToManyInversedRelation($fieldName, $inversedFieldMetaType, $inversedFieldName, $savedValues, $rawValues);
				break;

			// M<-->M BI
			case Relationships::MANY_TO_MANY_BI:
				$this->handleManyToManyInversedRelation($fieldName, $inversedFieldMetaType, $inversedFieldName, $savedValues, $rawValues);
				break;

		}
	}

	/**
	 * @param $fieldName
	 * @param $inversedFieldMetaType
	 * @param $inversedFieldName
	 * @param $savedValues
	 * @param $rawValues
	 *
	 * @throws \Exception
	 */
	private function handleOneToOneInversedRelation(
		$fieldName,
		$inversedFieldMetaType,
		$inversedFieldName,
		$savedValues,
		$rawValues
	)
	{
		if(empty($savedValues)){

			Meta::deleteBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
				'value' => serialize([$this->entityId])
			]);

			Meta::deleteBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
				'value' => serialize([(string)$this->entityId])
			]);

		} else {
			$this->checkAndRemoveDuplicates($this->fieldModel->getType(), $fieldName, $rawValues);
			$this->checkAndRemoveDuplicates($inversedFieldMetaType, $inversedFieldName, $savedValues);
		}
	}

	/**
	 * @param $fieldName
	 * @param $inversedFieldMetaType
	 * @param $inversedFieldName
	 * @param $savedValues
	 * @param $rawValues
	 *
	 * @throws \Exception
	 */
	private function handleOneToManyInversedRelation(
		$fieldName,
		$inversedFieldMetaType,
		$inversedFieldName,
		$savedValues,
		$rawValues
	)
	{
		if(empty($savedValues)){

			$relationsToBeUpdated = Meta::fetchBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
			]);

			if(!empty($relationsToBeUpdated)){
				foreach ($relationsToBeUpdated as $relationsToBeUpdate){

					$value = $relationsToBeUpdate->meta_value ?? $relationsToBeUpdate->option_value;
					$value = unserialize($value);

					if(is_array($value)){
						$value = array_filter($value, function ($item){
							return $item != $this->entityId;
						});

						if(empty($value)){
							Meta::deleteByMetaId($inversedFieldMetaType, ($relationsToBeUpdate->meta_id ?? $relationsToBeUpdate->option_id));
						} else {
							$id = $relationsToBeUpdate->post_id ?? $relationsToBeUpdate->term_id ?? $relationsToBeUpdate->user_id ?? $relationsToBeUpdate->option_name;
							Meta::save($id, $inversedFieldMetaType, $inversedFieldName, $value);
						}
					}
				}
			}

		} else {

			$id = ($inversedFieldMetaType !== MetaTypes::OPTION_PAGE) ? (int)$rawValues[0] : $rawValues[0];
			$relationsToBeUpdated = Meta::fetchBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
				'id'  => $id,
			]);

			if(!empty($relationsToBeUpdated)) {
				foreach ( $relationsToBeUpdated as $relationsToBeUpdate ) {

					// append $value here
					$value = $relationsToBeUpdate->meta_value ?? $relationsToBeUpdate->option_value;
					$value = unserialize($value);
					$value = array_merge($value, $savedValues);
					$value = array_unique($value);

					$id = $relationsToBeUpdate->post_id ?? $relationsToBeUpdate->term_id ?? $relationsToBeUpdate->user_id ?? $relationsToBeUpdate->option_name;
					Meta::save($id, $inversedFieldMetaType, $inversedFieldName, $value);
				}
			}
		}
	}

	/**
	 * @param $fieldName
	 * @param $inversedFieldMetaType
	 * @param $inversedFieldName
	 * @param $savedValues
	 * @param $rawValues
	 *
	 * @throws \Exception
	 */
	private function handleManyToOneOneInversedRelation(
		$fieldName,
		$inversedFieldMetaType,
		$inversedFieldName,
		$savedValues,
		$rawValues
	)
	{
		if(empty($savedValues)){

			Meta::deleteBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
				'value' => serialize([$this->entityId])
			]);

			Meta::deleteBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
				'value' => serialize([(string)$this->entityId])
			]);

		} else {

			$relationsToBeDeleted = Meta::fetchBy($inversedFieldMetaType, [
				'meta_id_not_in' => $rawValues,
				'key' => $inversedFieldName,
				'value' => serialize([$this->entityId])
			]);

			if(empty($relationsToBeDeleted)){
				$relationsToBeDeleted = Meta::fetchBy($inversedFieldMetaType, [
					'meta_id_not_in' => $rawValues,
					'key' => $inversedFieldName,
					'value' => serialize([(string)$this->entityId])
				]);
			}

			foreach ($relationsToBeDeleted as $item){
				Meta::deleteByMetaId($inversedFieldMetaType, ($item->meta_id ?? $item->option_id));
			}
		}
	}

	/**
	 * @param $fieldName
	 * @param $inversedFieldMetaType
	 * @param $inversedFieldName
	 * @param $savedValues
	 * @param $rawValues
	 *
	 * @throws \Exception
	 */
	private function handleManyToManyInversedRelation(
		$fieldName,
		$inversedFieldMetaType,
		$inversedFieldName,
		$savedValues,
		$rawValues
	)
	{
		if(empty($savedValues)){

			$relationsToBeUpdated = Meta::fetchBy($inversedFieldMetaType, [
				'key' => $inversedFieldName,
			]);

			if(!empty($relationsToBeUpdated)){
				foreach ($relationsToBeUpdated as $relationsToBeUpdate){
					$value = $relationsToBeUpdate->meta_value ?? $relationsToBeUpdate->option_value;
					$value = unserialize($value);

					if(is_array($value)){
						$value = array_filter($value, function ($item){
							return $item != $this->entityId;
						});

						if(empty($value)){
							Meta::deleteByMetaId($inversedFieldMetaType, ($relationsToBeUpdate->meta_id ?? $relationsToBeUpdate->option_id));
						} else {
							$id = $relationsToBeUpdate->post_id ?? $relationsToBeUpdate->term_id ?? $relationsToBeUpdate->user_id ?? $relationsToBeUpdate->option_name;
							Meta::save($id, $inversedFieldMetaType, $inversedFieldName, $value);
						}
					}
				}
			}

		} else {

			$rawValues = (is_array($rawValues)) ? $rawValues : explode(",", $rawValues);

			$relationsToBeUpdated = Meta::fetchBy($inversedFieldMetaType, [
				'meta_id_not_in' => $rawValues,
				'key' => $inversedFieldName,
			]);

			if(!empty($relationsToBeUpdated)){
				foreach ($relationsToBeUpdated as $relationsToBeUpdate){

					// append $value here
					$value = $relationsToBeUpdate->meta_value ?? $relationsToBeUpdate->option_value;
					$value = unserialize($value);

					if(is_array($value)){
						$value = array_filter($value, function ($item) {
							return $item != $this->entityId;
						});

						$id = $relationsToBeUpdate->post_id ?? $relationsToBeUpdate->term_id ?? $relationsToBeUpdate->user_id ?? $relationsToBeUpdate->option_name;
						if(in_array($id, $rawValues)){
							$rawValue = ($relationsToBeUpdate->meta_value ?? $relationsToBeUpdate->option_value);
							$rawValue = unserialize($rawValue);
							$value = array_merge($value, $rawValue);
						}

						if(empty($value)){
							Meta::deleteByMetaId($inversedFieldMetaType, ($relationsToBeUpdate->meta_id ?? $relationsToBeUpdate->option_id));
						} else {
							Meta::save($id, $inversedFieldMetaType, $inversedFieldName, $value);
						}
					}
				}
			}
		}
	}

	/**
	 * @param $fieldType
	 * @param $fieldName
	 * @param $values
	 *
	 * @throws \Exception
	 */
	private function checkAndRemoveDuplicates($fieldType, $fieldName, $values)
	{
		$results = Meta::fetchBy($fieldType, [
			'key' => $fieldName
		]);

		if(!empty($results)){

			$duplicates = [];

			foreach ($results as $result){
				$savedMetaValue = unserialize($result->meta_value);
				if($savedMetaValue == $values){
					$duplicates[] = (isset($result->meta_id)) ? (int)$result->meta_id : (int)$result->option_id;
				}
			}

			if(count($duplicates) > 1){
				Meta::deleteByMetaId($fieldType, $duplicates[0]);
			}
		}
	}
}