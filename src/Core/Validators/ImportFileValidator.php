<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Constants\MetaTypes;

class ImportFileValidator
{
	/**
	 * @param array $data
	 *
	 * @return bool
	 */
	public static function validate(array $data)
	{
		if(empty($data) or !is_array($data)){
			return false;
		}

		$allowedKeys = [
			MetaTypes::CUSTOM_POST_TYPE,
			MetaTypes::TAXONOMY,
			MetaTypes::OPTION_PAGE,
			MetaTypes::META,
			'form',
		];

		foreach (array_keys($data) as $key){
			if(!in_array($key, $allowedKeys)){
				return false;
			}
		}

		if(isset($data[MetaTypes::META])){
			foreach ($data[MetaTypes::META] as $item){
				if (!self::validateMeta($item)){
					return false;
				}
			}
		}

		if(isset($data[MetaTypes::CUSTOM_POST_TYPE])){
			foreach ($data[MetaTypes::CUSTOM_POST_TYPE] as $item){
				if (!self::validateCustomPostType($item)){
					return false;
				}
			}
		}

		if(isset($data[MetaTypes::OPTION_PAGE])){
			foreach ($data[MetaTypes::OPTION_PAGE] as $item){
				if (!self::validateOptionPage($item)){
					return false;
				}
			}
		}

		if(isset($data[MetaTypes::TAXONOMY])){
			foreach ($data[MetaTypes::TAXONOMY] as $item){
				if (!self::validateTaxonomy($item)){
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * @param array $item
	 *
	 * @return bool
	 */
	private static function validateMeta(array $item): bool
	{
		if(is_array($item['boxes'])) {
			foreach ( $item['boxes'] as $box ) {
				$isValid = (
					isset($box['id']) and
					isset($box['name']) and
					isset($box['sort']) and
					isset($box['fields'])
				);

				if(!$isValid){
					return false;
				}

				if(is_array($box['fields'])) {
					foreach ( $box['fields'] as $field ) {
						if(!self::validateMetaField($field)){
							return false;
						}
					}
				}
			}
		}

		return (
			isset($item['id']) and
			isset($item['name']) and
			isset($item['label']) and
			isset($item['belongs']) and
			isset($item['boxes'])
		);
	}

	/**
	 * @param array $field
	 *
	 * @return bool
	 */
	private static function validateMetaField(array $field): bool
	{
		if(isset($field['children']) and is_array($field['children'])){
			foreach ($field['children'] as $child) {
				if(!self::validateMetaField($child)){
					return false;
				}
			}
		}

		if(isset($field['blocks']) and is_array($field['blocks'])){
			foreach ($field['blocks'] as $block) {
				if(isset($block['fields']) and is_array($block['fields'])){
					foreach ($block['fields'] as $blockChild) {
						if(!self::validateMetaField($blockChild)){
							return false;
						}
					}
				}
			}
		}

		return (
			isset($field['id']) and
			isset($field['type']) and
			isset($field['defaultValue']) and
			isset($field['description']) and
			isset($field['showInArchive']) and
			isset($field['isRequired']) and
			isset($field['sort']) and
			isset($field['options']) and
			isset($field['isRequired']) and
			isset($field['visibilityConditions']) and
			isset($field['validationRules']) and
			isset($field['advancedOptions']) and
			isset($field['children']) and
			isset($field['blocks'])
		);
	}

	/**
	 * @param array $item
	 *
	 * @return bool
	 */
	private static function validateCustomPostType(array $item): bool
	{
		return (
			isset($item['id']) and
			isset($item['name']) and
			isset($item['singular']) and
			isset($item['plural']) and
			isset($item['icon']) and
			isset($item['supports']) and
			isset($item['labels']) and
			isset($item['settings']) and
			isset($item['taxonomies'])
		);
	}

	/**
	 * @param array $item
	 *
	 * @return bool
	 */
	private static function validateTaxonomy(array $item): bool
	{
		return (
			isset($item['id']) and
			isset($item['slug']) and
			isset($item['singular']) and
			isset($item['plural']) and
			isset($item['labels']) and
			isset($item['settings']) and
			isset($item['customPostTypes'])
		);
	}

	/**
	 * @param array $item
	 *
	 * @return bool
	 */
	private static function validateOptionPage(array $item): bool
	{
		if(isset($item['children']) and is_array($item['children'])){
			foreach ($item['children'] as $child){

				$isValid = (
					isset($child['id']) and
					isset($child['parentId']) and
					isset($child['pageTitle']) and
					isset($child['menuTitle']) and
					isset($child['capability']) and
					isset($child['menuSlug']) and
					isset($child['description']) and
					isset($child['sort']) and
					isset($child['children']) and
					isset($child['position'])
				);

				if(!$isValid){
					return false;
				}
			}
		}

		return (
			isset($item['id']) and
			isset($item['parentId']) and
			isset($item['pageTitle']) and
			isset($item['menuTitle']) and
			isset($item['capability']) and
			isset($item['menuSlug']) and
			isset($item['description']) and
			isset($item['sort']) and
			isset($item['children']) and
			isset($item['position'])
		);
	}
}