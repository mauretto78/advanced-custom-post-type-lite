<?php

namespace ACPT_Lite\Utils\Checker;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Operator;
use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldVisibilityModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Logics;

class FieldVisibilityChecker
{
	/**
	 * @param string $visibility
	 * @param string $elementId
	 * @param string $belongsTo
	 * @param MetaFieldModel $metaBoxFieldModel
	 * @param array $liveData
	 * @param null $fieldIndex
	 * @param null $blockName
	 * @param null $blockIndex
	 *
	 * @return bool
	 */
	public static function check(
		$visibility,
		$elementId,
		$belongsTo,
		MetaFieldModel $metaBoxFieldModel,
		$liveData = [],
		$fieldIndex = null,
		$blockName = null,
		$blockIndex = null
	)
	{
		if(!in_array($visibility, [
			Visibility::IS_BACKEND,
			Visibility::IS_FRONTEND
		])){
			return true;
		}

		try {
			if($metaBoxFieldModel === null or !$metaBoxFieldModel->hasVisibilityConditions()){
				return true;
			}

			$visibilityConditions = $metaBoxFieldModel->getVisibilityConditions();
			$logicBlocks = Logics::extractLogicBlocks($visibilityConditions, $visibility);
			$logics = [];

			foreach ($logicBlocks as $logicBlocksConditions){
				$logics[] = self::returnTrueOrFalseForALogicBlock(
					$elementId,
					$belongsTo,
					$metaBoxFieldModel,
					$logicBlocksConditions,
					$liveData,
					$fieldIndex,
					$blockName,
					$blockIndex
				);
			}

			return !in_array(false, $logics );
		} catch (\Exception $exception){
			return true;
		}
	}

	/**
	 * @param $visibility
	 * @param MetaFieldVisibilityModel $visibilityCondition
	 *
	 * @return bool
	 */
	private static function hasConditionToBeConsidered($visibility, MetaFieldVisibilityModel $visibilityCondition): bool
	{
		if($visibility === Visibility::IS_BACKEND and $visibilityCondition->isBackEnd()){
			return true;
		}

		if($visibility === Visibility::IS_FRONTEND and $visibilityCondition->isFrontEnd()){
			return true;
		}

		return false;
	}

	/**
	 * Determine if a logic block is visible or not
	 *
	 * @param $elementId
	 * @param $belongsTo
	 * @param MetaFieldModel $metaBoxFieldModel
	 * @param MetaFieldVisibilityModel[] $conditions
	 * @param array $liveData
	 * @param null $fieldIndex
	 * @param null $blockName
	 * @param null $blockIndex
	 *
	 * @return bool
	 * @throws \Exception
	 */
	private static function returnTrueOrFalseForALogicBlock(
		$elementId,
		$belongsTo,
		MetaFieldModel $metaBoxFieldModel,
		array $conditions,
		$liveData = [],
		$fieldIndex = null,
		$blockName = null,
		$blockIndex = null
	)
	{
		$rawData = null;
		if(!empty($liveData)){

			$filter = array_filter($liveData, function ($element) use ($metaBoxFieldModel) {
				return $metaBoxFieldModel->getId() === $element['formId'];
			});

			if(!empty($filter)){
				$rawData = array_values($filter)[0]['value'];
			}

		} else {
			$rawData = Meta::fetch($elementId, $belongsTo, self::getKey($metaBoxFieldModel));
		}

		$matches = 0;

		foreach ($conditions as $condition){

			$typeEnum = $condition->getType()['type'];
			$typeValue = $condition->getType()['value'];
			$operator = $condition->getOperator();
			$value = $condition->getValue();

			// field value of a nested field in a Repeater
			if($metaBoxFieldModel->getParentId() !== null){
				if(isset( $rawData[$metaBoxFieldModel->getName()]) and isset( $rawData[$metaBoxFieldModel->getName()][$fieldIndex])){
					$rawData = $rawData[$metaBoxFieldModel->getName()][$fieldIndex]['value'];
				}
			}

			// field value of a nested field in a Flexible content
			if($metaBoxFieldModel->getBlockId() !== null){
				if(
					isset($rawData['blocks']) and
					isset($rawData['blocks'][$blockIndex]) and
					isset($rawData['blocks'][$blockIndex][$blockName]) and
					isset($rawData['blocks'][$blockIndex][$blockName][$metaBoxFieldModel->getName()]) and
					isset($rawData['blocks'][$blockIndex][$blockName][$metaBoxFieldModel->getName()][$fieldIndex])
				){
					$rawData = $rawData['blocks'][$blockIndex][$blockName][$metaBoxFieldModel->getName()][$fieldIndex]['value'];
				}
			}

			if($typeEnum === 'VALUE' and $rawData !== null){
				switch ($operator) {
					case Operator::EQUALS:
						if($rawData == $value){
							$matches++;
						}
						break;

					case Operator::NOT_EQUALS:
						if($rawData != $value){
							$matches++;
						}
						break;

					case Operator::LT:
						if($rawData < $value){
							$matches++;
						}
						break;

					case Operator::GT:
						if($rawData > $value){
							$matches++;
						}
						break;

					case Operator::LTE:
						if($rawData <= $value){
							$matches++;
						}
						break;

					case Operator::GTE:
						if($rawData >= $value){
							$matches++;
						}
						break;

					case Operator::LIKE:
						if(Strings::likeMatch('%'.$value.'%',$rawData)){
							$matches++;
						}
						break;

					case Operator::NOT_LIKE:
						if(false === Strings::likeMatch('%'.$value.'%',$rawData)){
							$matches++;
						}
						break;

					case Operator::NULL:
						if($rawData === null){
							$matches++;
						}
						break;

					case Operator::NOT_NULL:
						if($rawData !== null){
							$matches++;
						}
						break;

					case Operator::BLANK:
						if($rawData === ''){
							$matches++;
						}
						break;

					case Operator::NOT_BLANK:
						if($rawData !== ''){
							$matches++;
						}
						break;

					case Operator::CHECKED:
						if($rawData == 1){
							$matches++;
						}
						break;

					case Operator::NOT_CHECKED:
						if($rawData == 0){
							$matches++;
						}
						break;

					case Operator::IN:
						$value = trim($value);
						$value = explode(',', $value);
						$rawData = is_array($rawData) ? $rawData : [$rawData];

						$check = array_intersect($rawData, $value);

						if(count($check) > 0){
							$matches++;
						}
						break;

					case Operator::NOT_IN:
						$value = trim($value);
						$value = explode(',', $value);
						$rawData = is_array($rawData) ? $rawData : [$rawData];

						$check = array_intersect($rawData, $value);

						if( empty($check)){
							$matches++;
						}
						break;
				}
			}

			if($typeEnum === 'POST_ID' or $typeEnum === 'TERM_ID'){
				switch ($operator) {
					case Operator::EQUALS:
						if($value == $elementId){
							$matches++;
						}
						break;

					case Operator::NOT_EQUALS:
						if($value !== $elementId){
							$matches++;
						}
						break;

					case Operator::IN:
						$value = trim($value);
						$value = explode(',', $value);

						if(in_array($elementId, $value)){
							$matches++;
						}
						break;

					case Operator::NOT_IN:
						$value = trim($value);
						$value = explode(',', $value);

						if(!in_array($elementId, $value)){
							$matches++;
						}
						break;
				}
			}

			if($typeEnum === 'TAXONOMY'){

				$categories = wp_get_post_categories((int)$elementId);
				$taxonomies = wp_get_post_terms((int)$elementId, $typeValue);

				if(is_array($taxonomies)){
					$allTerms = array_merge($categories, $taxonomies);
					$termIds = [];

					foreach ($allTerms as $term){
						if(isset($term->term_id)){
							$termIds[] = $term->term_id;
						}
					}

					switch ($operator) {

						case Operator::EQUALS:
							$termIds = is_array($termIds) ? $termIds : [$termIds];

							if(in_array($value, $termIds)){
								$matches++;
							}
							break;

						case Operator::NOT_EQUALS:
							$termIds = is_array($termIds) ? $termIds : [$termIds];

							if(!in_array($value, $termIds)){
								$matches++;
							}
							break;

						case Operator::IN:
							$value = trim($value);
							$value = explode(',', $value);
							$termIds = is_array($termIds) ? $termIds : [$termIds];

							$check = array_intersect($termIds, $value);

							if(count($check) > 0){
								$matches++;
							}
							break;

						case Operator::NOT_IN:
							$value = trim($value);
							$value = explode(',', $value);
							$termIds = is_array($termIds) ? $termIds : [$termIds];

							$check = array_intersect($termIds, $value);

							if(empty($check)){
								$matches++;
							}
							break;


						case Operator::BLANK:
							if(empty($termIds)){
								$matches++;
							}
							break;


						case Operator::NOT_BLANK:
							if(!empty($termIds)){
								$matches++;
							}
							break;
					}
				}
			}

			if($typeEnum === 'OTHER_FIELDS' and $typeValue instanceof MetaFieldModel){

				$fieldRawData = null;
				if(!empty($liveData)){

					$filter = array_filter($liveData, function ($element) use ($typeValue, $belongsTo, $elementId, $fieldIndex) {

						if($belongsTo === MetaTypes::OPTION_PAGE){
							return $elementId."_".$typeValue->getDbName() === $element['id'];
						}

						if($typeValue->hasParent() and $fieldIndex !== null){
							$parentMetaField = MetaRepository::getMetaFieldById($typeValue->getParentId(), true);
							$elementId = $parentMetaField->getDbName().'['.$typeValue->getName().']['.$fieldIndex.'][value]';

							return $elementId === $element['id'];
						}

						return $typeValue->getDbName() === $element['id'];
					});

					if(!empty($filter)){
						$fieldRawData = array_values($filter)[0]['value'];
					}

				} else {
					$fieldRawData = Meta::fetch($elementId, $belongsTo, $typeValue->getDbName());
				}

				if(!empty($fieldRawData)){

					// for relational fields, which can return an array, even with just one element
					$fieldRawData = (is_array($fieldRawData) and !empty($fieldRawData)) ? $fieldRawData[0] : $fieldRawData;

					switch ($operator) {
						case Operator::EQUALS:
							if($fieldRawData == $value){
								$matches++;
							}
							break;

						case Operator::NOT_EQUALS:
							if($fieldRawData != $value){
								$matches++;
							}
							break;

						case Operator::LT:
							if($fieldRawData < $value){
								$matches++;
							}
							break;

						case Operator::GT:
							if($fieldRawData > $value){
								$matches++;
							}
							break;

						case Operator::LTE:
							if($fieldRawData <= $value){
								$matches++;
							}
							break;

						case Operator::GTE:
							if($fieldRawData >= $value){
								$matches++;
							}
							break;

						case Operator::LIKE:
							if(Strings::likeMatch('%'.$value.'%',$fieldRawData)){
								$matches++;
							}
							break;

						case Operator::NOT_LIKE:
							if(false === Strings::likeMatch('%'.$value.'%',$fieldRawData)){
								$matches++;
							}
							break;

						case Operator::NULL:
							if($fieldRawData === null){
								$matches++;
							}
							break;

						case Operator::NOT_NULL:
							if($fieldRawData !== null){
								$matches++;
							}
							break;

						case Operator::BLANK:
							if($fieldRawData === ''){
								$matches++;
							}
							break;

						case Operator::NOT_BLANK:
							if($fieldRawData !== ''){
								$matches++;
							}
							break;

						case Operator::CHECKED:
							if($fieldRawData == 1){
								$matches++;
							}
							break;

						case Operator::NOT_CHECKED:
							if($fieldRawData == 0){
								$matches++;
							}
							break;

						case Operator::IN:
							$value = trim($value);
							$value = explode(',', $value);
							$fieldRawData = is_array($fieldRawData) ? $fieldRawData : [$fieldRawData];

							$check = array_intersect($fieldRawData, $value);

							if(count($check) > 0){
								$matches++;
							}
							break;

						case Operator::NOT_IN:
							$value = trim($value);
							$value = explode(',', $value);
							$fieldRawData = is_array($fieldRawData) ? $fieldRawData : [$fieldRawData];

							$check = array_intersect($fieldRawData, $value);

							if(empty($check)){
								$matches++;
							}
							break;
					}
				}
			}
		}

		return $matches > 0;
	}

	/**
	 * @param MetaFieldModel $metaBoxFieldModel
	 *
	 * @return string
	 * @throws \Exception
	 */
	private static function getKey(MetaFieldModel $metaBoxFieldModel)
	{
		if($metaBoxFieldModel->getParentId() !== null){

			$metaBoxParentFieldModel = MetaRepository::getMetaFieldById( $metaBoxFieldModel->getParentId());

			return $metaBoxParentFieldModel->getDbName();
		}

		if($metaBoxFieldModel->getBlockId() !== null){
			$metaBoxParentBlockModel = MetaRepository::getMetaBlockById($metaBoxFieldModel->getBlockId());
			$metaBoxParentFieldModel = $metaBoxParentBlockModel->getMetaField();

			return $metaBoxParentFieldModel->getDbName();
		}

		return $metaBoxFieldModel->getDbName();
	}
}