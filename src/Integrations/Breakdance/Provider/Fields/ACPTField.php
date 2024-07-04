<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Breakdance\Provider\Helper\RawValueConverter;
use ACPT_Lite\Utils\Wordpress\Translator;

class ACPTField
{
	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	public static function label(MetaFieldModel $fieldModel)
	{
		if($fieldModel->getFindLabel()){
			$label = '';
			$label .= '['.Translator::translate($fieldModel->getFindLabel()).']';
			$label .= ' - ' . $fieldModel->getBox()->getName() . ' ' . $fieldModel->getName();

			return $label;
		}

		$label = '['.$fieldModel->getBox()->getGroup()->getName().']';
		
		if($fieldModel->hasParent()){
			$label .= '['.$fieldModel->getParentField()->getName().']';
		}

		$label .= ' - ' . $fieldModel->getBox()->getName() . ' ' . $fieldModel->getName();

		return $label;
	}

	/**
	 * @return string
	 */
	public static function category()
	{
		return 'ACPT Meta fields';
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	public static function subcategory(MetaFieldModel $fieldModel)
	{
		if($fieldModel->getFindLabel()){
			return $fieldModel->getFindLabel();
		}

		return $fieldModel->getBox()->getGroup()->getUIName();
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	public static function slug(MetaFieldModel $fieldModel)
	{
		if($fieldModel->hasParent()){
			return $fieldModel->getBox()->getName() . '_' . $fieldModel->getParentField()->getName() . '_' . $fieldModel->getName();
		}

		if($fieldModel->isNestedInABlock()){
			return $fieldModel->getBox()->getName() . '_' . $fieldModel->getParentBlock()->getMetaField()->getName() . '_' . $fieldModel->getParentBlock()->getName() . '_' . $fieldModel->getName();
		}

		return $fieldModel->getBox()->getName() . '_' . $fieldModel->getName();
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $attributes
	 *
	 * @return string|null
	 * @throws \Exception
	 */
	public static function getValue(MetaFieldModel $fieldModel, $attributes)
	{
		$rawValue = null;
		$isVisible = true;

		// @TODO usare $fieldModel->getGroupLabel()

		// Custom Post Type fields
		if($fieldModel->getBox()->getGroup()->belongsTo(MetaTypes::CUSTOM_POST_TYPE)){

			$postId = get_the_ID();

			if($postId === null){
				return null;
			}

			// REPEATER
			if($fieldModel->hasParent()){
				$parentField = $fieldModel->getParentField();
				$breakdanceLoop = \Breakdance\DynamicData\LoopController::getInstance($parentField->getId());

				if(isset($breakdanceLoop->field['field']) and isset($breakdanceLoop->field['index'])){
					$loopField = $breakdanceLoop->field['field'];
					$loopIndex = $breakdanceLoop->field['index'];

					if($parentField->isEqualsTo($loopField)){

						$rawValue = get_acpt_child_field([
							'post_id' => $postId,
							'box_name' => $fieldModel->getBox()->getName(),
							'field_name' => $fieldModel->getName(),
							'parent_field_name' => $parentField->getName(),
							'index' => $loopIndex,
						]);

						$isVisible = is_acpt_field_visible([
							'post_id' => $postId,
							'box_name' => $fieldModel->getBox()->getName(),
							'field_name' => $fieldModel->getName(),
							'parent_field_name' => $parentField->getName(),
							'index' => $loopIndex,
						]);

						if(empty($rawValue)){
							return null;
						}

						if($isVisible === false){
							return null;
						}

						return RawValueConverter::convert($rawValue, $fieldModel->getType(), $attributes);
					}

					return null;
				}

				return null;
			}

			// FLEXIBLE
			if($fieldModel->isNestedInABlock()){

				$parentBlock = $fieldModel->getParentBlock();
				$breakdanceLoop = \Breakdance\DynamicData\LoopController::getInstance($parentBlock->getId());

				if(
					isset($breakdanceLoop->field['block']) and
					isset($breakdanceLoop->field['limit']) and
					isset($breakdanceLoop->field['block_index']) and
					isset($breakdanceLoop->field['field_index'])
				){
					$loopBlock = $breakdanceLoop->field['block'];
					$blockIndex = $breakdanceLoop->field['block_index'];
					$fieldIndex = $breakdanceLoop->field['field_index'];

					if($parentBlock->isEqualsTo($loopBlock)){

						$rawValue = get_acpt_block_child_field([
							'post_id' => $postId,
							'box_name' => $fieldModel->getBox()->getName(),
							'field_name' => $fieldModel->getName(),
							'parent_field_name' => $parentBlock->getMetaField()->getName(),
							'block_name' => $parentBlock->getName(),
							'block_index' => $blockIndex,
							'index' => $fieldIndex,
						]);

						$isVisible = is_acpt_field_visible([
							'post_id' => $postId,
							'box_name' => $fieldModel->getBox()->getName(),
							'field_name' => $fieldModel->getName(),
							'parent_field_name' => $parentBlock->getMetaField()->getName(),
							'block_name' => $parentBlock->getName(),
							'block_index' => $blockIndex,
							'index' => $fieldIndex,
						]);

						if(empty($rawValue)){
							return null;
						}

						if($isVisible === false){
							return null;
						}

						return RawValueConverter::convert($rawValue, $fieldModel->getType(), $attributes);
					}

					return null;
				}

				return null;
			}

			$rawValue = get_acpt_field([
				'post_id' => $postId,
				'box_name' => $fieldModel->getBox()->getName(),
				'field_name' => $fieldModel->getName(),
			]);

			$isVisible = is_acpt_field_visible([
				'post_id' => $postId,
				'box_name' => $fieldModel->getBox()->getName(),
				'field_name' => $fieldModel->getName(),
			]);
		}

		// Taxonomies fields
		if(empty($rawValue)){
			if($fieldModel->getBox()->getGroup()->belongsTo(MetaTypes::TAXONOMY)){

				$queriedObject = get_queried_object();
				$termId = $queriedObject->term_id;

				if($termId === null){
					return null;
				}

				$rawValue = get_acpt_field([
					'term_id' => $termId,
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);

				$isVisible = is_acpt_field_visible([
					'term_id' => $termId,
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);
			}
		}

		// Option page fields
		if(empty($rawValue)){
			if($fieldModel->getBox()->getGroup()->belongsTo(MetaTypes::OPTION_PAGE)){

				// REPEATER
				if($fieldModel->hasParent()){
					$parentField = $fieldModel->getParentField();
					$breakdanceLoop = \Breakdance\DynamicData\LoopController::getInstance($parentField->getId());

					if(isset($breakdanceLoop->field['field']) and isset($breakdanceLoop->field['index'])){
						$loopField = $breakdanceLoop->field['field'];
						$loopIndex = $breakdanceLoop->field['index'];

						if($parentField->isEqualsTo($loopField)){

							$rawValue = get_acpt_child_field([
								'option_page' => $fieldModel->getFindLabel() ?? 'test',
								'box_name' => $fieldModel->getBox()->getName(),
								'field_name' => $fieldModel->getName(),
								'parent_field_name' => $parentField->getName(),
								'index' => $loopIndex,
							]);

							$isVisible = is_acpt_field_visible([
								'option_page' => $fieldModel->getFindLabel() ?? 'test',
								'box_name' => $fieldModel->getBox()->getName(),
								'field_name' => $fieldModel->getName(),
								'parent_field_name' => $parentField->getName(),
								'index' => $loopIndex,
							]);

							if(empty($rawValue)){
								return null;
							}

							if($isVisible === false){
								return null;
							}

							return RawValueConverter::convert($rawValue, $fieldModel->getType(), $attributes);
						}

						return null;
					}

					return null;
				}

				// FLEXIBLE
				if($fieldModel->isNestedInABlock()){

					$parentBlock = $fieldModel->getParentBlock();
					$breakdanceLoop = \Breakdance\DynamicData\LoopController::getInstance($parentBlock->getId());

					if(
						isset($breakdanceLoop->field['block']) and
						isset($breakdanceLoop->field['limit']) and
						isset($breakdanceLoop->field['block_index']) and
						isset($breakdanceLoop->field['field_index'])
					){
						$loopBlock = $breakdanceLoop->field['block'];
						$blockIndex = $breakdanceLoop->field['block_index'];
						$fieldIndex = $breakdanceLoop->field['field_index'];

						if($parentBlock->isEqualsTo($loopBlock)){

							$rawValue = get_acpt_block_child_field([
								'option_page' => $fieldModel->getFindLabel() ?? 'test',
								'box_name' => $fieldModel->getBox()->getName(),
								'field_name' => $fieldModel->getName(),
								'parent_field_name' => $parentBlock->getMetaField()->getName(),
								'block_name' => $parentBlock->getName(),
								'block_index' => $blockIndex,
								'index' => $fieldIndex,
							]);

							$isVisible = is_acpt_field_visible([
								'option_page' => $fieldModel->getFindLabel() ?? 'test',
								'box_name' => $fieldModel->getBox()->getName(),
								'field_name' => $fieldModel->getName(),
								'parent_field_name' => $parentBlock->getMetaField()->getName(),
								'block_name' => $parentBlock->getName(),
								'block_index' => $blockIndex,
								'index' => $fieldIndex,
							]);

							if(empty($rawValue)){
								return null;
							}

							if($isVisible === false){
								return null;
							}

							return RawValueConverter::convert($rawValue, $fieldModel->getType(), $attributes);
						}

						return null;
					}

					return null;
				}

				$rawValue = get_acpt_field([
					'option_page' => $fieldModel->getFindLabel() ?? 'test',
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);

				$isVisible = is_acpt_field_visible([
					'option_page' => $fieldModel->getFindLabel() ?? 'test',
					'box_name' => $fieldModel->getBox()->getName(),
					'field_name' => $fieldModel->getName(),
				]);
			}
		}

		if(empty($rawValue)){
			return null;
		}

		if($isVisible === false){
			return null;
		}

		return RawValueConverter::convert($rawValue, $fieldModel->getType(), $attributes);
	}
}