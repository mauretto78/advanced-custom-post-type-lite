<?php

namespace ACPT_Lite\Core\Data\Import\Importer;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Files;

abstract class AbstractImporter
{
	/**
	 * @param string $groupName
	 * @param string $groupLabel
	 * @param array $belongs
	 */
	protected function importGroupSettings($groupName, $groupLabel, array $belongs = [])
	{
		save_acpt_meta_group([
			'name' => $groupName,
			'label' => $groupLabel,
			'belongs' => $belongs,
		]);
	}

	/**
	 * @param $groupName
	 * @param $boxName
	 * @param null $boxLabel
	 */
	protected function importBoxSettings($groupName, $boxName, $boxLabel = null)
	{
		save_acpt_meta_box([
			'groupName' => $groupName,
			'name' => $boxName,
			'label' => $boxLabel,
			'fields' => [],
		]);
	}

	/**
	 * @param $format
	 * @param $groupName
	 * @param $boxName
	 * @param $fieldName
	 * @param $fieldType
	 * @param $props
	 * @param $advancedOptions
	 * @param $visibilityConditions
	 * @param $relations
	 * @param $options
	 * @param $children
	 * @param $blocks
	 */
	protected function importFieldSettings(
		$format,
		$groupName,
		$boxName,
		$fieldName,
		$fieldType,
		$props,
		$advancedOptions,
		$visibilityConditions,
		$relations,
		$options,
		$children,
		$blocks
	)
	{
		$payload = [
			'groupName' => $groupName,
			'box_name' => $boxName,
			'name' => $fieldName,
			'type' => $fieldType,
			'showInArchive' => (( $format === FormatterFormat::XML_FORMAT) ? $props[0]->show_in_archive[0]->__toString() == 1 : $props['show_in_archive'] == 1),
			'isRequired' => (( $format === FormatterFormat::XML_FORMAT) ? $props[0]->required[0]->__toString() == 1 : $props['required'] == 1),
			'defaultValue' => ( $format === FormatterFormat::XML_FORMAT) ? $props[0]->default_value[0]->__toString() : $props['default_value'],
			'description' => ( $format === FormatterFormat::XML_FORMAT) ? $props[0]->description[0]->__toString() : $props['description'],
			'advancedOptions' => [],
			'options' => [],
			'visibilityConditions' => [],
		];

		if(!empty($options)){
			foreach($options as $option){
				$payload['options'][] = [
					'value' => ( $format === FormatterFormat::XML_FORMAT) ? $option->value[0]->__toString() : $option['value'],
					'label' => ( $format === FormatterFormat::XML_FORMAT) ? $option->label[0]->__toString() : $option['label'],
				];
			}
		}

		if(!empty($advancedOptions)){
			foreach($advancedOptions as $option){
				$payload['advancedOptions'][] = [
					'value' => ( $format === FormatterFormat::XML_FORMAT) ? $option->value[0]->__toString() : $option['value'],
					'label' => ( $format === FormatterFormat::XML_FORMAT) ? $option->label[0]->__toString() : $option['label'],
				];
			}
		}

		if(!empty($visibilityConditions)){
			foreach($visibilityConditions as $condition){
				$payload['visibilityConditions'][] = [
					'type' => ( $format === FormatterFormat::XML_FORMAT ? $condition->type[0]->type[0]->__toString() : $condition['type']['type']),
					'value' => ( $format === FormatterFormat::XML_FORMAT ? $condition->value[0]->__toString() : $condition['value']),
					'operator' => ( $format === FormatterFormat::XML_FORMAT ? $condition->operator[0]->__toString() : $condition['operator']),
					'logic' => ( $format === FormatterFormat::XML_FORMAT ? $condition->logic[0]->__toString() : $condition['logic']),
					'backEnd' => ( $format === FormatterFormat::XML_FORMAT ? $condition->backEnd[0]->__toString() == 1 : $condition['backEnd']),
					'frontEnd' => ( $format === FormatterFormat::XML_FORMAT ? $condition->frontEnd[0]->__toString() == 1 : $condition['frontEnd']),
				];
			}
		}

		$payload['quickEdit'] = (( $format === FormatterFormat::XML_FORMAT) ? $props[0]->quick_edit[0]->__toString() == 1 : $props['quick_edit'] == 1);
		$payload['isFilterable'] = (( $format === FormatterFormat::XML_FORMAT) ? $props[0]->is_filterable[0]->__toString() == 1 : $props['is_filterable'] == 1);
		$payload['children'] = [];
		$payload['relations'] = [];
		$payload['blocks'] = [];

		if(!empty($relations)){
			foreach($relations as $relation){ // @TODO questo non funziona, da rivedere
				$payload['relations'][] = [
					'related_to' => [
						'post_type' => ( $format === FormatterFormat::XML_FORMAT ? $relation[0]->related_to[0]->post_type[0]->__toString() : $relation['related_to']['post_type']),
						'box_name' => ( $format === FormatterFormat::XML_FORMAT ? $relation[0]->related_to[0]->box_name[0]->__toString() : $relation['related_to']['box_name']),
						'field_name' => ( $format === FormatterFormat::XML_FORMAT ? $relation[0]->related_to[0]->field_name[0]->__toString() : $relation['related_to']['field_name']),
					],
					'relation' => ( $format === FormatterFormat::XML_FORMAT ? $relation[0]->relationship[0]->__toString() : $relation['relationship']),
				];
			}
		}

		if(!empty($children)){
			$payload['children'] = $this->formatChildrenFieldsSettings($format, $children);
		}

		if(!empty($blocks)){
			foreach($blocks as $block) {
				$blockName = ( $format === FormatterFormat::XML_FORMAT ) ? $block->attributes()['name'][0]->__toString() : (isset($block['name']) ? $block['name'] : null);
				$blockLabel = ( $format === FormatterFormat::XML_FORMAT ) ? $block->attributes()['label'][0]->__toString() : (isset($block['label']) ? $block['label'] : null);

				if(
					!empty($blockName) and
					!empty($blockLabel)
				){
					$payload['blocks'][] = [
						'name' => $blockName,
						'label' => $blockLabel,
						'fields' => $this->formatChildrenFieldsSettings($format, $block)
					];
				}
			}
		}

		if(null === get_acpt_meta_field_object($boxName, $fieldName)){
			save_acpt_meta_field($payload);
		}
	}

	/**
	 * @param $format
	 * @param $children
	 *
	 * @return array
	 */
	private function formatChildrenFieldsSettings($format, $children)
	{
		$arrayOfChildrenFields = [];

		foreach($children as $child){

			$childFieldName = ( $format === FormatterFormat::XML_FORMAT) ? $child->attributes()['name'][0]->__toString() : (isset($child['name']) ? $child['name'] : null);
			$childFieldType = ( $format === FormatterFormat::XML_FORMAT) ? $child->attributes()['type'][0]->__toString() : (isset($child['type']) ? $child['type'] : null);

			if(
				empty($childFieldName) or
				empty($childFieldType)
			){
				return [];
			}

			$childFieldProps = ( $format === FormatterFormat::XML_FORMAT) ? $child->props[0] : $child['props'];
			$childFieldAdvancedOptions = ( $format === FormatterFormat::XML_FORMAT) ? $child->advanced_options[0] : $child['advanced_options'];
			$childFieldVisibilityConditions = ( $format === FormatterFormat::XML_FORMAT) ? $child->visibility_conditions[0] : $child['visibility_conditions'];
			$childFieldOptions = ( $format === FormatterFormat::XML_FORMAT) ? $child->options[0] : $child['options'];

			$payloadOptions = [];
			$payloadAdvancedOptions = [];
			$payloadVisibilityConditions = [];

			if(!empty($childFieldOptions)){
				foreach($childFieldOptions as $option){
					$payloadOptions[] = [
						'value' => ( $format === FormatterFormat::XML_FORMAT ? $option->value[0]->__toString() : $option['value']),
						'label' => ( $format === FormatterFormat::XML_FORMAT ? $option->label[0]->__toString() : $option['label']),
					];
				}
			}

			if(!empty($childFieldAdvancedOptions)){
				foreach($childFieldAdvancedOptions as $option){
					$payloadAdvancedOptions[] = [
						'value' => ( $format === FormatterFormat::XML_FORMAT ? $option->value[0]->__toString() : $option['value']),
						'key' => ( $format === FormatterFormat::XML_FORMAT ? $option->key[0]->__toString() : $option['key']),
					];
				}
			}

			if(!empty($childFieldVisibilityConditions)){
				foreach($childFieldVisibilityConditions as $condition){
					$payloadVisibilityConditions[] = [
						'type' => ( $format === FormatterFormat::XML_FORMAT ? $condition->type[0]->type[0]->__toString() : $condition['type']['type']),
						'value' => ( $format === FormatterFormat::XML_FORMAT ? $condition->value[0]->__toString() : $condition['value']),
						'operator' => ( $format === FormatterFormat::XML_FORMAT ? $condition->operator[0]->__toString() : $condition['operator']),
						'logic' => ( $format === FormatterFormat::XML_FORMAT ? $condition->logic[0]->__toString() : $condition['logic']),
					];
				}
			}

			$arrayOfChildrenFields[] = [
				'name' => $childFieldName,
				'type' => $childFieldType,
				'isRequired' => (( $format === FormatterFormat::XML_FORMAT) ? $childFieldProps[0]->required[0]->__toString() == 1 : $childFieldProps['quick_edit'] == 1),
				'defaultValue' => ( $format === FormatterFormat::XML_FORMAT ? $childFieldProps[0]->default_value[0]->__toString() : $childFieldProps['default_value']),
				'description' => ( $format === FormatterFormat::XML_FORMAT ? $childFieldProps[0]->description[0]->__toString() : $childFieldProps['description']),
				'options' => $payloadOptions,
				'advancedOptions' => $payloadAdvancedOptions,
				'visibilityConditions' => $payloadVisibilityConditions,
			];
		}

		return $arrayOfChildrenFields;
	}

	/**
	 * @param $format
	 * @param $belongsTo
	 * @param $newItemId
	 * @param $boxName
	 * @param $fieldName
	 * @param $values
	 */
	protected function importFieldMetadata($format, $belongsTo, $newItemId, $boxName, $fieldName, $values)
	{
		$value = $this->extractValues($format, $values);
		$key = null;

		switch ($belongsTo) {
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

		if($key !== null){
			save_acpt_meta_field_value([
				$key  => $newItemId,
				'box_name' => $boxName,
				'field_name' => $fieldName,
				'value' => $value,
			]);
		}
	}

	/**
	 * @param $format
	 * @param $values
	 *
	 * @return mixed
	 */
	private function extractValues($format, $values)
	{
		$fieldType = ( $format === FormatterFormat::XML_FORMAT ? $values->attributes()['type'][0]->__toString() : $values['type']);

		switch ($fieldType){

			case MetaFieldModel::ADDRESS_TYPE:
				return ( $format === FormatterFormat::XML_FORMAT ? $values->value->address[0]->__toString() : $values['value']['address']);

			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:

				$arrayOfValues = [];

				foreach ($values as $value){
					$arrayOfValues[] = ( $format === FormatterFormat::XML_FORMAT) ? $value[0]->__toString() : $value;
				}

				return $arrayOfValues;

			case MetaFieldModel::CURRENCY_TYPE:

				$amount = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->amount[0]->__toString() : $values['value']['amount'];
				$unit = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->unit[0]->__toString() : $values['value']['unit'];

				return [
					'amount' => (int)$amount,
					'unit' => $unit,
				];

			case MetaFieldModel::DATE_RANGE_TYPE:

				$from = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->from[0]->__toString() : $values['value']['from'];
				$to = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->to[0]->__toString() : $values['value']['to'];

				return [
					$from,
					$to
				];

			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:

				$blocks = $values->blocks[0];
				$blocksValues = [];
				$blockIndex = 0;

				foreach ($blocks as $block){

					$blockName = ( $format === FormatterFormat::XML_FORMAT) ? $block->attributes()['name'][0]->__toString() : $block['name'];
					$fieldIndex = 0;

					foreach($block->values as $nestedValue){
						$nestedFieldName = ( $format === FormatterFormat::XML_FORMAT) ? $nestedValue->attributes()['name'][0]->__toString() : $nestedValue['name'];
						$blocksValues[$blockIndex][$blockName][$fieldIndex][$nestedFieldName] = self::extractValues($format, $nestedValue);
						$fieldIndex++;
					}

					$blockIndex++;
				}

				return [
					'blocks' => $blocksValues
				];

			case MetaFieldModel::FILE_TYPE:
				$src = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->src[0]->__toString() : $values['value']['src'];
				$label = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->label[0]->__toString() : $values['value']['label'];
				$file = Files::downloadFromUrl($src);

				if($file){
					return [
						'label' => $label,
						'url' => $file['url'],
					];
				}

				return null;

			case MetaFieldModel::POST_TYPE:

				$arrayOfValues = [];

				foreach ($values as $postId){
					$arrayOfValues[] = $postId;
				}

				return $arrayOfValues;

			case MetaFieldModel::GALLERY_TYPE:

				$arrayOfValues = [];

				foreach ($values as $value){
					$src = ( $format === FormatterFormat::XML_FORMAT) ? $value[0]->src[0]->__toString() : $value['src'];
					$file = Files::downloadFromUrl($src);

					if($file){
						$arrayOfValues[] = $file['url'];
					} else {
						$arrayOfValues[] = $src;
					}
				}

				return $arrayOfValues;

			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				$src = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->src[0]->__toString() : $values['value']['src'];
				$file = Files::downloadFromUrl($src);

				if($file){
					return $file['url'];
				}

				return $src;

			case MetaFieldModel::LENGTH_TYPE:

				$length = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->length[0]->__toString() : $values['value']['length'];
				$unit = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->unit[0]->__toString() : $values['value']['unit'];

				return [
					'length' => (int)$length,
					'unit' => $unit,
				];

			case MetaFieldModel::REPEATER_TYPE:

				$childrenValues = [];

				foreach ($values as $value){

					$arrayOfNestedValues = [];

					if(is_array($value)){
						foreach($value as $nestedValue){
							if($nestedValue !== null){
								$nestedFieldName = ( $format === FormatterFormat::XML_FORMAT) ? $nestedValue->attributes()['name'][0]->__toString() : (isset($nestedValue['name']) ? $nestedValue['name'] : null);

								if(!empty($nestedFieldName)){
									$arrayOfNestedValues[$nestedFieldName] = self::extractValues($format, $nestedValue);
								}
							}
						}
					}

					$childrenValues[] = $arrayOfNestedValues;
				}

				return $childrenValues;

			case MetaFieldModel::WEIGHT_TYPE:

				$weight = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->weight[0]->__toString() : $values['value']['weight'];
				$unit = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->unit[0]->__toString() : $values['value']['unit'];

				return [
					'weight' => (int)$weight,
					'unit' => $unit,
				];

			case MetaFieldModel::URL_TYPE:

				$url = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->url[0]->__toString() : $values['value']['url'];
				$label = ( $format === FormatterFormat::XML_FORMAT) ? $values->value->label[0]->__toString() : $values['value']['label'];

				return [
					'url' => $url,
					'label' => $label,
				];

			default:
				return ( $format === FormatterFormat::XML_FORMAT) ? $values->value[0]->__toString() : $values['value'][0];
		}
	}
}