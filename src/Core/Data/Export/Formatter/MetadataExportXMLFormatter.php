<?php

namespace ACPT_Lite\Core\Data\Export\Formatter;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\ValueObjects\RelatedEntityValueObject;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class MetadataExportXMLFormatter implements MetadataExportFormatterInterface
{
	/**
	 * This function format a single unit (for single post type for example)
	 *
	 * @param MetadataExportItemDto $dto
	 *
	 * @return mixed
	 */
	public function format(MetadataExportItemDto $dto)
	{
		$find = ($dto->find !== null) ? 'find="'.$dto->find.'"' : '';
		$xml = '<acpt belongsTo="'.$dto->belongsTo.'" '.$find.' itemId="'.$dto->id.'">';
		$xml .= '<groups>';

		foreach ($dto->metaGroups as $group){
			$xml .= '<group id="'.$group->getId().'" name="'.$group->getName().'" label="'.$group->getLabel().'">';

			// belongs
			$xml .= '<belongs>';

			foreach ($group->getBelongs() as $belongModel){
				$xml .= self::formatBelong($belongModel);
			}

			$xml .= '</belongs>';

			// boxes
			$xml .= '<boxes>';

			foreach ($group->getBoxes() as $metaBoxModel){
				$xml .= '<box id="'.$metaBoxModel->getId().'" name="'.$metaBoxModel->getName().'" label="'.$metaBoxModel->getLabel().'">';
				$xml .= '<fields>';

				foreach ($metaBoxModel->getFields() as $fieldModel){
					$xml .= self::formatField($dto->id, $dto->belongsTo, $fieldModel);
				}

				$xml .= '</fields>';
				$xml .= '</box>';
			}

			$xml .= '</boxes>';
			$xml .= '</group>';
		}

		$xml .= '</groups>';
		$xml .= '</acpt>';

		return $xml;
	}

	/**
	 * @param BelongModel $belongModel
	 *
	 * @return string
	 */
	private static function formatBelong(BelongModel $belongModel)
	{
		$xml = '<belong id="'.$belongModel->getId().'">';
		$xml .= '<belongs_to>'.$belongModel->getBelongsTo().'</belongs_to>';
		$xml .= '<operator>'.$belongModel->getOperator().'</operator>';
		$xml .= '<logic>'.$belongModel->getLogic().'</logic>';
		$xml .= '<find>'.$belongModel->getFind().'</find>';
		$xml .= '</belong>';

		return $xml;
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param MetaFieldModel $fieldModel
	 * @param null $fieldIndex
	 * @param null $blockIndex
	 *
	 * @return string
	 */
	private static function formatField($itemId, $belongsTo, MetaFieldModel $fieldModel, $fieldIndex = null, $blockIndex = null)
	{
		$xml = '<field id="'.$fieldModel->getId().'" name="'.$fieldModel->getName().'" type="'.$fieldModel->getType().'">';
		$xml .= self::formatFieldProps($fieldModel);
		$xml .= self::formatAdvancedOptions($fieldModel);
		$xml .= self::formatVisibilityConditions($fieldModel);
		$xml .= self::formatOptions($fieldModel);
		$xml .= self::formatRelations($fieldModel);
		$xml .= self::formatChildren($fieldModel);
		$xml .= self::formatBlocks($fieldModel);
		$xml .= self::formatFieldValue($itemId, $belongsTo, $fieldModel, $fieldIndex, $blockIndex);
		$xml .= '</field>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatFieldProps(MetaFieldModel $fieldModel)
	{
		$xml = '<props>';
		$xml .= '<default_value>'.$fieldModel->getDefaultValue().'</default_value>';
		$xml .= '<description>'.$fieldModel->getDescription().'</description>';
		$xml .= '<show_in_archive>'.self::renderBoolean($fieldModel->isShowInArchive()).'</show_in_archive>';
		$xml .= '<required>'.self::renderBoolean($fieldModel->isRequired()) . '</required>';
		$xml .= '<quick_edit>'.self::renderBoolean($fieldModel->isForQuickEdit()).'</quick_edit>';
		$xml .= '<is_filterable>'.self::renderBoolean($fieldModel->isFilterableInAdmin()).'</is_filterable>';
		$xml .= '</props>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatRelations(MetaFieldModel $fieldModel)
	{
		$xml = '<relations>';

		foreach ($fieldModel->getRelations() as $relationModel){
			$xml .= '<relation>';
			$xml .= '<relationship>'.Strings::toSnakeCase($relationModel->getRelationship()).'</relationship>';
			$xml .= '<related_to>';

			$xml .= '<from>'.self::formatRelatedEntityValueObject($relationModel->from()).'</from>';
			$xml .= '<to>'.self::formatRelatedEntityValueObject($relationModel->to()).'</to>';

			$xml .= '<box_name>';
			if($relationModel->getInversedBy()){ $xml .= $relationModel->getInversedBy()->getBox()->getName(); }
			$xml .= '</box_name>';

			$xml .= '<field_name>';
			if($relationModel->getInversedBy()){ $xml .= $relationModel->getInversedBy()->getName(); }
			$xml .= '</field_name>';

			$xml .= '</related_to>';
			$xml .= '</relation>';
		}

		$xml .= '</relations>';

		return $xml;
	}

	/**
	 * @param RelatedEntityValueObject $object
	 *
	 * @return string
	 */
	private static function formatRelatedEntityValueObject(RelatedEntityValueObject $object)
	{
		$xml = '<type>'.$object->getType().'</type>';
		$xml .= '<value>'.$object->getValue().'</value>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatBlocks(MetaFieldModel $fieldModel)
	{
		$xml = '<blocks>';

		foreach ($fieldModel->getBlocks() as $blockField){
			$xml .= '<block name="'.$blockField->getName().'" label="'.$blockField->getLabel().'">';

			foreach ($blockField->getFields() as $nestedFieldModel){
				$xml .= self::formatNestedField($nestedFieldModel);
			}

			$xml .= '</block>';
		}

		$xml .= '</blocks>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatChildren(MetaFieldModel $fieldModel)
	{
		$xml = '<children>';

		foreach ($fieldModel->getChildren() as $childFieldModel){
			$xml .= self::formatNestedField($childFieldModel);
		}

		$xml .= '</children>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatNestedField(MetaFieldModel $fieldModel)
	{
		$xml = '<field name="'.$fieldModel->getName().'" type="'.$fieldModel->getType().'">';
		$xml .= self::formatFieldProps($fieldModel);
		$xml .= self::formatAdvancedOptions($fieldModel);
		$xml .= self::formatVisibilityConditions($fieldModel);
		$xml .= self::formatOptions($fieldModel);
		$xml .= '</field>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatAdvancedOptions(MetaFieldModel $fieldModel)
	{
		$xml = '<advanced_options>';

		foreach ($fieldModel->getAdvancedOptions() as $advancedOptionModel){
			$xml .= '<option>';
			$xml .= '<key>'.$advancedOptionModel->getKey().'</key>';
			$xml .= '<value>'.$advancedOptionModel->getValue().'</value>';
			$xml .= '</option>';
		}

		$xml .= '</advanced_options>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatVisibilityConditions(MetaFieldModel $fieldModel)
	{
		$xml = '<visibility_conditions>';

		foreach ($fieldModel->getVisibilityConditions() as $visibilityConditionModel){
			$xml .= '<condition>';
			$xml .= '<operator>'.$visibilityConditionModel->getOperator().'</operator>';
			$xml .= '<back_end>'.$visibilityConditionModel->isBackEnd().'</back_end>';
			$xml .= '<front_end>'.$visibilityConditionModel->isFrontEnd().'</front_end>';
			$xml .= '<logic>'.$visibilityConditionModel->getLogic().'</logic>';
			$xml .= '<type>';
			$xml .= '<type>'.$visibilityConditionModel->getType()['type'].'</type>';
			$xml .= '<value>'.$visibilityConditionModel->getType()['value'].'</value>';
			$xml .= '</type>';
			$xml .= '<value>'.$visibilityConditionModel->getValue().'</value>';
			$xml .= '</condition>';
		}

		$xml .= '</visibility_conditions>';

		return $xml;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatOptions(MetaFieldModel $fieldModel)
	{
		$xml = '<options>';

		foreach ($fieldModel->getOptions() as $optionModel){
			$xml .= '<option>';
			$xml .= '<label>'.$optionModel->getLabel().'</label>';
			$xml .= '<value>'.$optionModel->getValue().'</value>';
			$xml .= '</option>';
		}

		$xml .= '</options>';

		return $xml;
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param MetaFieldModel $fieldModel
	 * @param null $fieldIndex
	 * @param null $blockIndex
	 *
	 * @return string
	 */
	private static function formatFieldValue($itemId, $belongsTo, MetaFieldModel $fieldModel, $fieldIndex = null, $blockIndex = null)
	{
		$rawValue = null;
		$key = null;

		switch ($belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				$key = 'post_id';
				break;

			case MetaTypes::TAXONOMY:
				$key = 'term_id';
				break;

			case MetaTypes::USER:
				$key = 'user_id';
				break;
		}

		if($fieldModel->isNestedInABlock() and $fieldModel->getParentBlock() !== null){
			$rawValue = get_acpt_block_child_field([
				$key => (int)$itemId,
				'box_name' => $fieldModel->getBox()->getName(),
				'field_name' => $fieldModel->getName(),
				'parent_field_name' => $fieldModel->getParentBlock() ? $fieldModel->getParentBlock()->getMetaField()->getName() : null,
				'index' => $fieldIndex,
				'block_name' => $fieldModel->getParentBlock() ? $fieldModel->getParentBlock()->getName() : null,
				'block_index' => $blockIndex,
			]);
		} elseif($fieldModel->hasParent() and $fieldModel->getParentField() !== null){
			$rawValue = get_acpt_child_field([
				$key => (int)$itemId,
				'box_name' => $fieldModel->getBox()->getName(),
				'field_name' => $fieldModel->getName(),
				'parent_field_name' => $fieldModel->getParentField()->getName(),
				'index' => $fieldIndex,
			]);
		} else {
			$rawValue = get_acpt_field([
				$key => (int)$itemId,
				'box_name' => $fieldModel->getBox()->getName(),
				'field_name' => $fieldModel->getName(),
			]);
		}

		$xml = '<values name="'.$fieldModel->getName().'" type="'.$fieldModel->getType().'">';

		if($rawValue !== null){
			$xml .= self::formatRawValue($itemId, $belongsTo, $rawValue, $fieldModel);
		}

		$xml .= '</values>';

		return $xml;
	}

	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param mixed $rawValue
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function formatRawValue($itemId, $belongsTo, $rawValue, MetaFieldModel $fieldModel)
	{
		$fieldType = $fieldModel->getType();

		switch ($fieldType){

			case MetaFieldModel::ADDRESS_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<value>';
				$value .= '<address>'.$rawValue['address'].'</address>';
				$value .= '<lat>'.$rawValue['lat'].'</lat>';
				$value .= '<lng>'.$rawValue['lng'].'</lng>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::CURRENCY_TYPE:

				$value = '<value>';
				$value .= '<amount>'.$rawValue['amount'].'</amount>';
				$value .= '<unit>'.$rawValue['unit'].'</unit>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::DATE_RANGE_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<value>';
				$value .= '<from>'.$rawValue[0].'</from>';
				$value .= '<to>'.$rawValue[1].'</to>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::FILE_TYPE:

				$file = $rawValue['file'];
				$label = $rawValue['label'];

				if(!$file instanceof WPAttachment){
					return null;
				}

				$value = '<value>';
				$value .= '<id>'.$file->getId().'</id>';
				$value .= '<src>'.$file->getSrc().'</src>';
				$value .= '<description>'.$file->getDescription().'</description>';
				$value .= '<label>'.$label.'</label>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<blocks>';
				$blockIndex = 0;

				foreach ($rawValue['blocks'] as $block){
					foreach ($block as $blockName => $blockFields){
						$nestedBlockModel = $fieldModel->getBlock($blockName);
						$value .= '<block name="'.$blockName.'" label="'.$nestedBlockModel->getLabel().'">';

						$arrayValues = [];

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
										$value .= $arrayValues[$metaFieldName][$k];
									}
								}
							}
						}

						$value .= '</block>';
					}

					$blockIndex++;
				}

				$value .= '</blocks>';

				return $value;

			case MetaFieldModel::GALLERY_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '';

				foreach ($rawValue as $item){
					if($item instanceof WPAttachment){
						$value .= '<value>';
						$value .= '<id>'.$item->getId().'</id>';
						$value .= '<src>'.$item->getSrc().'</src>';
						$value .= '<description>'.$item->getDescription().'</description>';
						$value .= '</value>';
					}
				}

				return $value;

			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				if(!$rawValue instanceof WPAttachment){
					return null;
				}

				$value = '<value>';
				$value .= '<id>'.$rawValue->getId().'</id>';
				$value .= '<src>'.$rawValue->getSrc().'</src>';
				$value .= '<description>'.$rawValue->getDescription().'</description>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::LENGTH_TYPE:

				$value = '<value>';
				$value .= '<length>'.$rawValue['length'].'</length>';
				$value .= '<unit>'.$rawValue['unit'].'</unit>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
			case MetaFieldModel::CHECKBOX_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '';

				foreach ($rawValue as $item){
					$value .= '<value>'.$item.'</value>';
				}

				return $value;

			case MetaFieldModel::POST_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '';

				/** @var \WP_Post $item */
				foreach ($rawValue as $item){
					$value .= '<value>'.$item->ID.'</value>';
				}

				return $value;

			case MetaFieldModel::REPEATER_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '';
				$fieldIndex = 0;

				foreach ($rawValue as $children){

					$value .= '<value>';

					foreach ($children as $childName => $childRawValue){
						$nestedFieldModel = $fieldModel->getChild($childName);

						if($nestedFieldModel !== null){
							$value .= self::formatFieldValue($itemId, $belongsTo, $nestedFieldModel, $fieldIndex);
						}
					}

					$fieldIndex++;
					$value .= '</value>';
				}

				return $value;

			case MetaFieldModel::WEIGHT_TYPE:

				$value = '<value>';
				$value .= '<weight>'.$rawValue['weight'].'</weight>';
				$value .= '<unit>'.$rawValue['unit'].'</unit>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::URL_TYPE:

				$value = '<value>';
				$value .= '<url>'.$rawValue['url'].'</url>';
				$value .= '<label>'.$rawValue['label'].'</label>';
				$value .= '</value>';

				return $value;

			case MetaFieldModel::POST_OBJECT_TYPE:

				if($rawValue instanceof \WP_Post){
					$value = '<value>';
					$value .= $rawValue->ID;
					$value .= '</value>';

					return $value;
				}

				return null;

			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<value>';

				foreach ($rawValue as $post){
					if($post instanceof \WP_Post){
						$value .= $post->ID;
					}
				}

				$value .= '</value>';

				return $value;

			case MetaFieldModel::TERM_OBJECT_TYPE:

				if($rawValue instanceof \WP_Term){
					$value = '<value>';
					$value .= $rawValue->term_id;
					$value .= '</value>';

					return $value;
				}

				return null;

			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<value>';

				foreach ($rawValue as $term){
					if($term instanceof \WP_Term){
						$value .= $term->ID;
					}
				}

				$value .= '</value>';

				return $value;

			case MetaFieldModel::USER_TYPE:

				if($rawValue instanceof \WP_User){
					$value = '<value>';
					$value .= $rawValue->ID;
					$value .= '</value>';

					return $value;
				}

				return null;

			case MetaFieldModel::USER_MULTI_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$value = '<value>';

				foreach ($rawValue as $user){
					if($user instanceof \WP_User){
						$value .= $user->ID;
					}
				}

				$value .= '</value>';

				return $value;

			default:
				return '<value>'.$rawValue.'</value>';
		}
	}

	/**
	 * @param $boolean
	 *
	 * @return string
	 */
	private static function renderBoolean($boolean = null)
	{
		if($boolean == 1 or $boolean == true){
			return "1";
		}

		return "0";
	}
}