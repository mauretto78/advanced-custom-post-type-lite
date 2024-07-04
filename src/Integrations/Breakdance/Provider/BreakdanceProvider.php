<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Integrations\Breakdance\Constants\BreakdanceField;
use ACPT_Lite\Integrations\Breakdance\Provider\Blocks\ACPTBlock;
use ACPT_Lite\Integrations\Breakdance\Provider\Fields\ACPTFieldInterface;

class BreakdanceProvider
{
	/**
	 * Register ACPT fields
	 *
	 * @see https://github.com/soflyy/breakdance-sample-dynamic-data/tree/master
	 *
	 * @throws \Exception
	 */
	public static function init()
	{
		// fetch settings
		$settings = self::fetchSettings();
		$fields = $settings['fields'];
 		$blocks = $settings['blocks'];

		foreach ($fields as $field){
			$breakdanceField = self::getBreakdanceField($field);
			$breakdanceFieldAsUrl = self::getBreakdanceFieldAsUrl($field);

			if($breakdanceField !== null){
				\Breakdance\DynamicData\registerField($breakdanceField);
			}

			if($breakdanceFieldAsUrl !== null){
				\Breakdance\DynamicData\registerField($breakdanceFieldAsUrl);
			}
		}

		foreach ($blocks as $block){
			$breakdanceField = self::getBreakdanceBlock($block);

			if($breakdanceField !== null){
				\Breakdance\DynamicData\registerField($breakdanceField);
			}
		}
	}

	/**
	 * @return MetaFieldModel[]
	 * @throws \Exception
	 */
	private static function fetchSettings()
	{
		$fields = [];
		$blocks = [];

		$postModels = CustomPostTypeRepository::get([]);

		foreach ($postModels as $postModel){
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
				'find'      => $postModel->getName(),
			]);

			$fieldsAndBlocks = self::getFieldsAndBlocks($metaGroups, MetaTypes::CUSTOM_POST_TYPE, $postModel->getName());
			$fields = array_merge($fields, $fieldsAndBlocks['fields']);
			$blocks = array_merge($blocks, $fieldsAndBlocks['blocks']);
		}

		// TAX fields
		$taxonomies = TaxonomyRepository::get([], true);
		foreach ($taxonomies as $taxonomy){
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::TAXONOMY,
				'find'      => $taxonomy->getSlug(),
			]);

			$fieldsAndBlocks = self::getFieldsAndBlocks($metaGroups, MetaTypes::TAXONOMY, $taxonomy->getSlug());
			$fields = array_merge($fields, $fieldsAndBlocks['fields']);
			$blocks = array_merge($blocks, $fieldsAndBlocks['blocks']);
		}

		// OP fields
		$optionPageSlugs = OptionPageRepository::getAllSlugs();
		foreach ($optionPageSlugs as $optionPageSlug){
			$metaGroups = MetaRepository::get([
				'belongsTo' => MetaTypes::OPTION_PAGE,
				'find'      => $optionPageSlug,
			]);

			$fieldsAndBlocks = self::getFieldsAndBlocks($metaGroups, MetaTypes::OPTION_PAGE, $optionPageSlug);
			$fields = array_merge($fields, $fieldsAndBlocks['fields']);
			$blocks = array_merge($blocks, $fieldsAndBlocks['blocks']);
		}
		
		return [
			'blocks' => $blocks,
			'fields' => $fields,
		];
	}

	/**
	 * @param MetaGroupModel[] $metaGroups
	 * @param $belongsTo
	 * @param $find
	 *
	 * @return array
	 */
	private static function getFieldsAndBlocks($metaGroups, $belongsTo, $find)
	{
		$fields = [];
		$blocks = [];

		foreach($metaGroups as $group){
			foreach ($group->getBoxes() as $cptBox) {
				foreach ($cptBox->getFields() as $field){

					// Exclude the Flexible fields, allow only the blocks
					if($field->getType() !== MetaFieldModel::FLEXIBLE_CONTENT_TYPE){
						$field->setBelongsToLabel($belongsTo);
						$field->setFindLabel($find);
						$fields[] = $field;
					}

					// REPEATER
					if($field->getType() === MetaFieldModel::REPEATER_TYPE and $field->hasChildren()){
						foreach ($field->getChildren() as $childField){
							$field->setBelongsToLabel($belongsTo);
							$field->setFindLabel($find);
							$fields[] = $childField;
						}
					}

					// FLEXIBLE
					if($field->getType() === MetaFieldModel::FLEXIBLE_CONTENT_TYPE and $field->hasBlocks()){
						foreach ($field->getBlocks() as $blockModel){
							foreach ($blockModel->getFields() as $nestedField){
								$field->setBelongsToLabel($belongsTo);
								$field->setFindLabel($find);
								$fields[] = $nestedField;
							}

							$blocks[] = $blockModel;
						}
					}
				}
			}
		}

		return [
			'blocks' => $blocks,
			'fields' => $fields,
		];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return null|ACPTFieldInterface
	 */
	private static function getBreakdanceField(MetaFieldModel $fieldModel)
	{
		$fieldType = null;

		switch ($fieldModel->getType()){

			case MetaFieldModel::COUNTRY_TYPE:
				$fieldType = BreakdanceField::COUNTRY;
				break;

			case MetaFieldModel::CURRENCY_TYPE:
				$fieldType = BreakdanceField::CURRENCY;
				break;

			case MetaFieldModel::DATE_TYPE:
				$fieldType = BreakdanceField::DATE;
				break;

			case MetaFieldModel::DATE_TIME_TYPE:
				$fieldType = BreakdanceField::DATE_TIME;
				break;

			case MetaFieldModel::DATE_RANGE_TYPE:
				$fieldType = BreakdanceField::DATE_RANGE;
				break;

			case MetaFieldModel::EMAIL_TYPE:
				$fieldType = BreakdanceField::EMAIL;
				break;

			case MetaFieldModel::EMBED_TYPE:
				$fieldType = BreakdanceField::OEMBED;
				break;

			case MetaFieldModel::FILE_TYPE:
				$fieldType = BreakdanceField::FILE;
				break;

			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
			case MetaFieldModel::REPEATER_TYPE:
				$fieldType = BreakdanceField::REPEATER;
				break;

			case MetaFieldModel::GALLERY_TYPE:
				$fieldType = BreakdanceField::GALLERY;
				break;

			case MetaFieldModel::ICON_TYPE:
				$fieldType = BreakdanceField::ICON;
				break;

			case MetaFieldModel::IMAGE_TYPE:
				$fieldType = BreakdanceField::IMAGE;
				break;

			case MetaFieldModel::LENGTH_TYPE:
				$fieldType = BreakdanceField::LENGTH;
				break;

			case MetaFieldModel::NUMBER_TYPE:
			case MetaFieldModel::RANGE_TYPE:
				$fieldType = BreakdanceField::NUMBER;
				break;

			case MetaFieldModel::PHONE_TYPE:
				$fieldType = BreakdanceField::PHONE;
				break;

			case MetaFieldModel::RATING_TYPE:
				$fieldType = BreakdanceField::RATING;
				break;

			case MetaFieldModel::TEXTAREA_TYPE:
				$fieldType = BreakdanceField::TEXTAREA;
				break;

			case MetaFieldModel::TIME_TYPE:
				$fieldType = BreakdanceField::TIME;
				break;

			case MetaFieldModel::URL_TYPE:
				$fieldType = BreakdanceField::URL;
				break;

			case MetaFieldModel::VIDEO_TYPE:
				$fieldType = BreakdanceField::VIDEO;
				break;

			case MetaFieldModel::WEIGHT_TYPE:
				$fieldType = BreakdanceField::WEIGHT;
				break;

			case MetaFieldModel::RADIO_TYPE:
			case MetaFieldModel::SELECT_TYPE:
				$fieldType = BreakdanceField::LABEL_VALUE;
				break;

			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
				$fieldType = BreakdanceField::LIST;
				break;

			default:
				$fieldType = BreakdanceField::STRING;
				break;
		}

		$className = 'ACPT\\Integrations\\Breakdance\\Provider\\Fields\\ACPT'.$fieldType.'Field';

		if(class_exists($className)){
			return new $className($fieldModel);
		}

		return null;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return null|ACPTFieldInterface
	 */
	private static function getBreakdanceFieldAsUrl(MetaFieldModel $fieldModel)
	{
		$fieldType = null;

		switch ($fieldModel->getType()){

			case MetaFieldModel::EMAIL_TYPE:
				$fieldType = BreakdanceField::EMAIL;
				break;

			case MetaFieldModel::FILE_TYPE:
				$fieldType = BreakdanceField::FILE;
				break;

			case MetaFieldModel::IMAGE_TYPE:
				$fieldType = BreakdanceField::IMAGE;
				break;

			case MetaFieldModel::PHONE_TYPE:
				$fieldType = BreakdanceField::PHONE;
				break;

			case MetaFieldModel::URL_TYPE:
				$fieldType = BreakdanceField::URL;
				break;

			case MetaFieldModel::VIDEO_TYPE:
				$fieldType = BreakdanceField::VIDEO;
				break;
		}

		$className = 'ACPT\\Integrations\\Breakdance\\Provider\\Fields\\ACPT'.$fieldType.'AsUrlField';

		if(class_exists($className)){
			return new $className($fieldModel);
		}

		return null;
	}

	/**
	 * @param MetaFieldBlockModel $blockModel
	 *
	 * @return ACPTBlock
	 */
	private static function getBreakdanceBlock(MetaFieldBlockModel $blockModel)
	{
		return new ACPTBlock($blockModel);
	}
}