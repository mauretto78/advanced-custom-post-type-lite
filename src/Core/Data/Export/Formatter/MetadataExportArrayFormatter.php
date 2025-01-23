<?php

namespace ACPT_Lite\Core\Data\Export\Formatter;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class MetadataExportArrayFormatter implements MetadataExportFormatterInterface
{
	/**
	 *  This function format a single unit (for single post type for example)
	 *
	 * @param MetadataExportItemDto $dto
	 *
	 * @return mixed
	 * @throws \ReflectionException
	 */
	public function format(MetadataExportItemDto $dto)
	{
		$groups = [];

		foreach ($dto->metaGroups as $group){

			$boxes = [];
			$belongs = [];

			foreach ($group->getBoxes() as $metaBoxModel){

				$fields = [];

				foreach ($metaBoxModel->getFields() as $fieldModel){
					$fields[] = self::formatField($dto->id, $dto->belongsTo, $fieldModel);
				}

				$boxes[] = [
					'name' => $metaBoxModel->getName(),
					'label' => $metaBoxModel->getLabel(),
					'fields' => $fields,
				];
			}

			foreach ($group->getBelongs() as $belongModel){
				$belongs[] = $belongModel->toArray();
			}

			$groups[] = [
				'name' => $group->getName(),
				'label' => $group->getLabel(),
				'boxes' => $boxes,
				'belongs' => $belongs,
			];
		}

		return [
			'belongsTo' => $dto->belongsTo,
			'find' => $dto->find,
			'itemId' => $dto->id,
			'groups' => $groups,
		];
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param MetaFieldModel $fieldModel
	 * @param null $fieldIndex
	 * @param null $blockIndex
	 *
	 * @return array
	 */
	private static function formatField($itemId, $belongsTo, MetaFieldModel $fieldModel, $fieldIndex = null, $blockIndex = null)
	{
		$props = self::formatFieldProps($fieldModel);
		$advancedOptions = self::formatAdvancedOptions($fieldModel);
		$visibilityConditions = self::formatVisibilityConditions($fieldModel);
		$options = self::formatOptions($fieldModel);
		$relations = self::formatRelations($fieldModel);
		$children = self::formatChildren($fieldModel);
		$blocks = self::formatBlocks($fieldModel);
		$values = self::formatFieldValue($itemId, $belongsTo, $fieldModel, $fieldIndex, $blockIndex);

		return [
			'name' => $fieldModel->getName(),
			'type' => $fieldModel->getType(),
			'props' => $props,
			'advanced_options' => $advancedOptions,
			'visibility_conditions' => $visibilityConditions,
			'options' => $options,
			'relations' => $relations,
			'children' => $children,
			'blocks' => $blocks,
			'values' => $values,
		];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatFieldProps(MetaFieldModel $fieldModel)
	{
		return [
			'default_value' => $fieldModel->getDefaultValue(),
			'description' => $fieldModel->getDescription(),
			'show_in_archive' => $fieldModel->isShowInArchive(),
			'required' => $fieldModel->isRequired(),
			'quick_edit' => $fieldModel->isForQuickEdit(),
			'is_filterable' => $fieldModel->isFilterableInAdmin(),
		];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatAdvancedOptions(MetaFieldModel $fieldModel)
	{
		$options = [];

		foreach ($fieldModel->getAdvancedOptions() as $advancedOptionModel){
			$options[] = [
				'key' => $advancedOptionModel->getKey(),
				'value' => $advancedOptionModel->getValue(),
			];
		}

		return $options;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatVisibilityConditions(MetaFieldModel $fieldModel)
	{
		$conditions = [];

		foreach ($fieldModel->getVisibilityConditions() as $visibilityConditionModel){
			$conditions[] = [
				'operator' => $visibilityConditionModel->getOperator(),
				'logic' => $visibilityConditionModel->getLogic(),
				'backEnd' => $visibilityConditionModel->isBackEnd(),
				'frontEnd' => $visibilityConditionModel->isFrontEnd(),
				'type' => [
					'type' => $visibilityConditionModel->getType()['type'],
					'value' => $visibilityConditionModel->getType()['value'],
				],
				'value' => $visibilityConditionModel->getValue(),
			];
		}

		return $conditions;
	}

	private static function formatOptions(MetaFieldModel $fieldModel)
	{
		$options = [];

		foreach ($fieldModel->getOptions() as $optionModel){
			$options[] = [
				'label' => $optionModel->getLabel(),
				'value' => $optionModel->getValue(),
			];
		}

		return $options;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatRelations(MetaFieldModel $fieldModel)
	{
		$relations = [];

		foreach ($fieldModel->getRelations() as $relationModel){
			$relations[] = [
				'relationship' => Strings::toSnakeCase($relationModel->getRelationship()),
				'related_to' => [
					'from' => $relationModel->from()->arrayRepresentation(),
					'to' => $relationModel->to()->arrayRepresentation(),
					'box_name' => (($relationModel->getInversedBy()) ? $relationModel->getInversedBy()->getBox()->getName() : null ),
					'field_name' => (($relationModel->getInversedBy()) ? $relationModel->getInversedBy()->getName() : null ),
				],
			];
		}

		return $relations;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatChildren(MetaFieldModel $fieldModel)
	{
		$children = [];

		foreach ($fieldModel->getChildren() as $childFieldModel){
			$children[] = self::formatNestedField($childFieldModel);
		}

		return $children;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatNestedField(MetaFieldModel $fieldModel)
	{
		return [
			'name' => $fieldModel->getName(),
			'type' => $fieldModel->getType(),
			'props' => self::formatFieldProps($fieldModel),
			'advanced_options' => self::formatAdvancedOptions($fieldModel),
			'visibility_conditions' => self::formatVisibilityConditions($fieldModel),
			'options' => self::formatOptions($fieldModel),
		];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatBlocks(MetaFieldModel $fieldModel)
	{
		$blocks = [];

		foreach ($fieldModel->getBlocks() as $blockField){

			$nestedFields = [];
			foreach ($blockField->getFields() as $nestedFieldModel){
				$nestedFields[] = self::formatNestedField($nestedFieldModel);
			}

			$blocks[] = [
				'name' => $blockField->getName(),
				'label' => $blockField->getLabel(),
				'fields' => $nestedFields,
			];
		}

		return $blocks;
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param MetaFieldModel $fieldModel
	 * @param null $fieldIndex
	 * @param null $blockIndex
	 *
	 * @return array
	 */
	private static function formatFieldValue($itemId, $belongsTo, MetaFieldModel $fieldModel, $fieldIndex = null, $blockIndex = null)
	{
		$rawValue = null;

		switch ($belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:

				if($fieldModel->isNestedInABlock()){
					$rawValue = get_acpt_block_child_field([
						'post_id' => (int)$itemId,
						'box_name' => $fieldModel->getBox()->getName(),
						'field_name' => $fieldModel->getName(),
						'parent_field_name' => $fieldModel->getParentBlock() ? $fieldModel->getParentBlock()->getMetaField()->getName() : null,
						'index' => $fieldIndex,
						'block_name' => $fieldModel->getParentBlock() ? $fieldModel->getParentBlock()->getName() : null,
						'block_index' => $blockIndex,
					]);
				} elseif($fieldModel->hasParent() and $fieldModel->getParentField() !== null){
					$rawValue = get_acpt_child_field([
						'post_id' => (int)$itemId,
						'box_name' => $fieldModel->getBox()->getName(),
						'field_name' => $fieldModel->getName(),
						'parent_field_name' => $fieldModel->getParentField() ? $fieldModel->getParentField()->getName() : null,
						'index' => $fieldIndex,
					]);
				} else {
					$rawValue = get_acpt_field([
						'post_id' => (int)$itemId,
						'box_name' => $fieldModel->getBox()->getName(),
						'field_name' => $fieldModel->getName(),
					]);
				}
				break;

			case MetaTypes::TAXONOMY:
				$rawValue = get_acpt_field([
					'term_id' => (int)$itemId,
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);
				break;

			case MetaTypes::OPTION_PAGE:
				$rawValue = get_acpt_field([
					'option_page' => $itemId,
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);
				break;

			case MetaTypes::USER:
				$rawValue = get_acpt_field([
					'user_id' => (int)$itemId,
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);
				break;
		}

		$value = [];

		if($rawValue !== null){
			$value[] = self::formatRawValue($itemId, $belongsTo, $rawValue, $fieldModel);
		}

		return [
			'name' => $fieldModel->getName(),
			'type' => $fieldModel->getType(),
			'value' => $value,
		];
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param mixed $rawValue
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function formatRawValue($itemId, $belongsTo, $rawValue, MetaFieldModel $fieldModel)
	{
		$fieldType = $fieldModel->getType();

		switch ($fieldType){

			case MetaFieldModel::ADDRESS_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				return [
					'address' => $rawValue['address'],
					'lat' => $rawValue['lat'],
					'lng' => $rawValue['lng'],
				];

			case MetaFieldModel::CURRENCY_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				return [
					'amount' => $rawValue['amount'],
					'unit' => $rawValue['unit'],
				];

			case MetaFieldModel::DATE_RANGE_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				return [
					'from' => $rawValue[0],
					'to' => $rawValue[1],
				];

			case MetaFieldModel::FILE_TYPE:

				$file = $rawValue['file'];
				$label = $rawValue['label'];

				if(!$file instanceof WPAttachment){
					return null;
				}

				return [
					'id' => $file->getId(),
					'src' => $file->getSrc(),
					'description' => $file->getDescription(),
					'label' => $label,
				];

			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$blocks = [];
				$blockIndex = 0;

				foreach ($rawValue['blocks'] as $block){
					foreach ($block as $blockName => $blockFields){

						$nestedBlockModel = $fieldModel->getBlock($blockName);
						$arrayValues = [];
						$nestedValues = [];

						foreach ($blockFields as $childName => $childRawValues){
							$nestedFieldModel = $nestedBlockModel->getField($childName);

							if($nestedFieldModel !== null){
								for($i = 0; $i < count($childRawValues); $i++){
									$arrayValues[$childName][$i] = self::formatFieldValue($itemId, $belongsTo, $nestedFieldModel, $i, $blockIndex);
								}
							}
						}

						if(!empty($arrayValues)){
							for($i = 0; $i < count($arrayValues); $i++){
								foreach ($arrayValues as $metaFieldName => $arrayValue){
									for($k = 0; $k < count($arrayValue); $k++){
										$nestedValues[] = $arrayValues[$metaFieldName][$k];
									}
								}
							}
						}

						$blocks[] = [
							'name' => $blockName,
							'label' => $nestedBlockModel->getLabel(),
							'values' => $nestedValues,
						];
					}

					$blockIndex++;
				}

				return [
					'blocks' => $blocks
				];

			case MetaFieldModel::GALLERY_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = [];

				foreach ($rawValue as $item){
					if($item instanceof WPAttachment){
						$value[] = [
							'id' => $item->getId(),
							'src' => $item->getSrc(),
							'description' => $item->getDescription(),
						];
					}
				}

				return $value;

			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				if(!$rawValue instanceof WPAttachment){
					return null;
				}

				return [
					'id' => $rawValue->getId(),
					'src' => $rawValue->getSrc(),
					'description' => $rawValue->getDescription(),
				];

			case MetaFieldModel::LENGTH_TYPE:

				return [
					'length' => $rawValue['length'],
					'unit' => $rawValue['unit'],
				];

			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
			case MetaFieldModel::CHECKBOX_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = [];

				foreach ($rawValue as $item){
					$value[] = $item;
				}

				return $value;

			case MetaFieldModel::POST_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = [];

				/** @var \WP_Post $item */
				foreach ($rawValue as $item){
					$value[] = $item->ID;
				}

				return $value;

			case MetaFieldModel::REPEATER_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = [];
				$fieldIndex = 0;

				foreach ($rawValue as $children){
					foreach ($children as $childName => $childRawValue){
						$nestedFieldModel = $fieldModel->getChild($childName);

						if($nestedFieldModel !== null){
							$value[] = self::formatFieldValue($itemId, $belongsTo, $nestedFieldModel, $fieldIndex);
						}
					}

					$fieldIndex++;
				}

				return $value;

			case MetaFieldModel::WEIGHT_TYPE:

				return [
					'weight' => $rawValue['weight'],
					'unit' => $rawValue['unit'],
				];

			case MetaFieldModel::URL_TYPE:

				return [
					'url' => $rawValue['url'],
					'label' => $rawValue['label'],
				];

			default:
				return $rawValue;
		}
	}
}