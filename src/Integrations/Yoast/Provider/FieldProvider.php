<?php

namespace ACPT_Lite\Integrations\Yoast\Provider;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Wordpress\Users;

class FieldProvider
{
	const ALLOWED_FIELDS = [
		MetaFieldModel::CHECKBOX_TYPE,
		MetaFieldModel::CURRENCY_TYPE,
		MetaFieldModel::DATE_TYPE,
		MetaFieldModel::DATE_RANGE_TYPE,
		MetaFieldModel::DATE_TIME_TYPE,
		MetaFieldModel::EMAIL_TYPE,
		MetaFieldModel::LENGTH_TYPE,
		MetaFieldModel::LIST_TYPE,
		MetaFieldModel::PHONE_TYPE,
		MetaFieldModel::POST_TYPE,
		MetaFieldModel::POST_OBJECT_TYPE,
		MetaFieldModel::POST_OBJECT_MULTI_TYPE,
		MetaFieldModel::RADIO_TYPE,
		MetaFieldModel::RATING_TYPE,
		MetaFieldModel::SELECT_TYPE,
		MetaFieldModel::SELECT_MULTI_TYPE,
		MetaFieldModel::TERM_OBJECT_TYPE,
		MetaFieldModel::TERM_OBJECT_MULTI_TYPE,
		MetaFieldModel::TEXT_TYPE,
		MetaFieldModel::TEXTAREA_TYPE,
		MetaFieldModel::TIME_TYPE,
		MetaFieldModel::WEIGHT_TYPE,
		MetaFieldModel::URL_TYPE,
		MetaFieldModel::USER_TYPE,
		MetaFieldModel::USER_MULTI_TYPE,
	];

	/**
	 * @return array
	 */
	public static function getData()
	{
		$data = [];
		$snippets = [];
		$context = self::resolveContext();

		try {
			// CPT meta fields
			$customPostTypes = CustomPostTypeRepository::get([]);

			foreach ($customPostTypes as $customPostType){
				$data = array_merge($data, self::getFields(MetaTypes::CUSTOM_POST_TYPE, $customPostType->getName(), $context, $snippets));
			}

			// Taxonomies meta fields
			$taxonomies = TaxonomyRepository::get();
			foreach ($taxonomies as $taxonomy){
				$data = array_merge($data, self::getFields(MetaTypes::TAXONOMY, $taxonomy->getSlug(), $context, $snippets));
			}

			return $data;
		} catch (\Exception $exception){
			return [];
		}

	}

	/**
	 * @param $belongsTo
	 * @param $find
	 * @param $context
	 * @param $snippets
	 *
	 * @return array
	 */
	private static function getFields($belongsTo, $find, $context, &$snippets)
	{
		$fields = [];

		try {
			$groups = MetaRepository::get([
				'belongsTo' => $belongsTo,
				'find' => $find
			]);

			foreach ($groups as $group){
				foreach ($group->getBoxes() as $box){
					foreach ($box->getFields() as $field){

						$snippet = self::getSnippet($field);

						// avoid duplicates snippet
						if(in_array($field->getType(), self::ALLOWED_FIELDS) and !in_array($snippet, $snippets)){
							$fields[] = [
								'snippet' => $snippet,
								'replace' => self::getReplace($field, $context),
								'help' => self::getHelp($field),
							];

							$snippets[] = $snippet;
						}
					}
				}
			}

			return $fields;
		} catch (\Exception $exception){
			return [];
		}
	}

	/**
	 * @param MetaFieldModel $field
	 *
	 * @return string
	 */
	private static function getSnippet(MetaFieldModel $field)
	{
		return '%%acpt_'.$field->getDbName().'%%';
	}

	/**
	 * @param MetaFieldModel $field
	 * @param array $context
	 *
	 * @return mixed|string|null
	 */
	private static function getReplace(MetaFieldModel $field, $context = [])
	{
		if(empty($context) === null){
			return null;
		}

		if(!isset($context['context'])){
			return null;
		}

		if(!isset($context['id'])){
			return null;
		}

		$rawValue = get_acpt_field([
			$context['context'] => (int)$context['id'],
			'box_name' => $field->getBox()->getName(),
			'field_name' => $field->getName(),
		]);

		if(empty($rawValue)){
			return null;
		}

		switch ($field->getType()){

			// CHECKBOX_TYPE
			// LIST_TYPE
			// SELECT_MULTI_TYPE
			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
				$separator = (!empty($args)) ? $args : ', ';

				if(!is_array($rawValue)){
					return null;
				}

				return implode($separator, $rawValue);

			// CURRENCY_TYPE
			case MetaFieldModel::CURRENCY_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				if(!isset($rawValue['amount'])){
					return null;
				}

				if(!isset($rawValue['unit'])){
					return null;
				}

				return $rawValue['amount']. " " . $rawValue['unit'];

			// LENGTH_TYPE
			case MetaFieldModel::LENGTH_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				if(!isset($rawValue['length'])){
					return null;
				}

				if(!isset($rawValue['unit'])){
					return null;
				}

				return $rawValue['length']. " " . $rawValue['unit'];

			// WEIGHT_TYPE
			case MetaFieldModel::WEIGHT_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				if(!isset($rawValue['weight'])){
					return null;
				}

				if(!isset($rawValue['unit'])){
					return null;
				}

				return $rawValue['weight']. " " . $rawValue['unit'];

			// DATE_TYPE
			case MetaFieldModel::DATE_TYPE:

				$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
				if(!empty($args)){
					if(Date::isDateFormatValid($args)){
						$format = $args;
					}
				}

				return date_i18n($format, strtotime($rawValue));

			// DATE_RANGE_TYPE
			case MetaFieldModel::DATE_RANGE_TYPE:

				if(is_array($rawValue) and !empty($rawValue) and count($rawValue) === 2){
					$format = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
					if(!empty($args)){
						if(Date::isDateFormatValid($args)){
							$format = $args;
						}
					}

					$value = date_i18n($format, strtotime($rawValue[0]));
					$value .= ' - ';
					$value .= date_i18n($format, strtotime($rawValue[1]));

					return $value;
				}

				return null;

			// DATE_TIME_TYPE
			case MetaFieldModel::DATE_TIME_TYPE:

				$dateFormat = get_option( 'date_format' ) ? get_option( 'date_format' ) : 'Y-m-d';
				$timeFormat = get_option( 'time_format' ) ? get_option( 'time_format' ) : "G:i";
				$format = $dateFormat . ' ' . $timeFormat;

				if(!empty($args)){
					if(Date::isDateFormatValid($args)){
						$format = $args;
					}
				}

				return date_i18n($format, strtotime($rawValue));

			// RATING_TYPE
			case MetaFieldModel::RATING_TYPE:
				return Strings::renderRatingAsString($rawValue);

			// TIME_TYPE
			case MetaFieldModel::TIME_TYPE:
				$format = get_option( 'time_format' ) ? get_option( 'time_format' ) : "G:i";
				if(!empty($args)){
					if(Date::isDateFormatValid($args)){
						$format = $args;
					}
				}

				return date_i18n($format, strtotime($rawValue));

			// URL_TYPE
			case MetaFieldModel::URL_TYPE:
				if(!is_array($rawValue)){
					return null;
				}

				if(!isset($rawValue['url'])){
					return null;
				}

				return $rawValue['url'];

			// POST_OBJECT_TYPE
			case MetaFieldModel::POST_OBJECT_TYPE:
			case MetaFieldModel::TERM_OBJECT_TYPE:
			case MetaFieldModel::USER_TYPE:
				return self::renderRelationalField($rawValue);

			// POST_OBJECT_MULTI_TYPE
			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:
			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:
			case MetaFieldModel::USER_MULTI_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$values = [];

				foreach ($rawValue as $value){
					$values[] = self::renderRelationalField($value);
				}

				$separator = (!empty($args)) ? $args : ', ';

				if(!is_array($values)){
					return null;
				}

				return implode($separator, $values);

			// POST_TYPE
			case MetaFieldModel::POST_TYPE:

				if(is_array($rawValue)){

					$values = [];

					foreach ($rawValue as $value){
						$values[] = self::renderRelationalField($value);
					}

					$separator = (!empty($args)) ? $args : ', ';

					if(!is_array($values)){
						return null;
					}

					return implode($separator, $values);
				}

				return self::renderRelationalField($rawValue);

			default:
				return $rawValue;
		}
	}

	/**
	 * @param MetaFieldModel $field
	 *
	 * @return string
	 */
	private static function getHelp(MetaFieldModel $field)
	{
		return 'Gets the value for `'.$field->getUiName().'` field';
	}

	/**
	 * @param $rawValue
	 *
	 * @return string|null
	 */
	private static function renderRelationalField($rawValue)
	{
		if($rawValue instanceof \WP_User){
			return Users::getUserLabel($rawValue);
		}

		if($rawValue instanceof \WP_Term){
			return $rawValue->name;
		}

		if($rawValue instanceof \WP_Post){
			return $rawValue->post_title;
		}

		return null;
	}

	/**
	 * @return array
	 */
	private static function resolveContext()
	{
		global $post;
		global $wpdb;

		if($post){
			return [
				'context' => 'post_id',
				'id' => $post->ID,
			];
		}

		if(isset($_GET['post'])){
			return [
				'context' => 'post_id',
				'id' => $_GET['post'],
			];
		}

		if(isset($_GET['p'])){
			return [
				'context' => 'post_id',
				'id' => $_GET['p'],
			];
		}

		$slug = Url::getLastPartOfUrl($_SERVER['REQUEST_URI']);
		$page = ACPT_Lite_DB::getResults("SELECT ID FROM {$wpdb->prefix}posts WHERE post_name = %s", [$slug]);

		if(!empty($page)){
			return [
				'context' => 'post_id',
				'id' => $page[0]->ID,
			];
		}

		if(isset($_GET['taxonomy']) and isset($_GET['tag_ID'])){
			return [
				'context' => 'term_id',
				'id' => $_GET['tag_ID']
			];
		}

		if(isset($_GET['cat'])){
			return [
				'context' => 'term_id',
				'id' => $_GET['cat']
			];
		}

		if(isset($_GET['tag'])){
			return [
				'context' => 'term_id',
				'id' => $_GET['tag']
			];
		}

		$term = ACPT_Lite_DB::getResults("SELECT term_id FROM {$wpdb->prefix}terms WHERE slug = %s", [$slug]);

		if(!empty($term)){
			return [
				'context' => 'term_id',
				'id' => $term[0]->term_id,
			];
		}

		return [];
	}
}