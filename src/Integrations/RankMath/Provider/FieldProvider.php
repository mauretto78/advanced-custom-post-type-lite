<?php

namespace ACPT_Lite\Integrations\RankMath\Provider;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\Wordpress\Users;

class FieldProvider
{
	/**
	 * @var int
	 */
	private $find;

	/**
	 * @var string
	 */
	private $belongsTo;

	/**
	 * @var MetaFieldModel
	 */
	private $field;

	/**
	 * FieldProvider constructor.
	 *
	 * @param $find
	 * @param $belongsTo
	 * @param MetaFieldModel $field
	 */
	public function __construct($find, $belongsTo, MetaFieldModel $field)
	{
		$this->find = $find;
		$this->belongsTo = $belongsTo;
		$this->field = $field;
	}

	/**
	 * @return string
	 */
	public function getSlug(): string
	{
		return 'acpt_'.$this->field->getDbName();
	}

	/**
	 * @return string
	 */
	public  function getName(): string
	{
		return $this->field->getUiName();
	}

	/**
	 * @return string
	 */
	public  function getDescription(): string
	{
		return $this->field->getDescription() ?? '';
	}

	/**
	 * @param $args
	 *
	 * @return string|null
	 */
	public  function getData($args = null): ?string
	{
		$belongsTo = ($this->belongsTo === MetaTypes::CUSTOM_POST_TYPE) ? 'post_id' : 'term_id';

		$rawValue = get_acpt_field([
			$belongsTo => (int)$this->find,
			'box_name' => $this->field->getBox()->getName(),
			'field_name' => $this->field->getName(),
		]);

		if(empty($rawValue)){
			return null;
		}

		switch ($this->field->getType()){

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
				return $this->renderRelationalField($rawValue);

			// POST_OBJECT_MULTI_TYPE
			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:
			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:
			case MetaFieldModel::USER_MULTI_TYPE:

				if(!is_array($rawValue)){
					return null;
				}

				$values = [];

				foreach ($rawValue as $value){
					$values[] = $this->renderRelationalField($value);
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
						$values[] = $this->renderRelationalField($value);
					}

					$separator = (!empty($args)) ? $args : ', ';

					if(!is_array($values)){
						return null;
					}

					return implode($separator, $values);
				}

				return $this->renderRelationalField($rawValue);

			default:
				return $rawValue;
		}
	}

	/**
	 * @param $rawValue
	 *
	 * @return string|null
	 */
	private function renderRelationalField($rawValue)
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
}