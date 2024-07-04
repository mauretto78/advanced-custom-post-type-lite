<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class AcptFieldTypeText extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::ADDRESS_TYPE,
			MetaFieldModel::COLOR_TYPE,
			MetaFieldModel::EDITOR_TYPE,
			MetaFieldModel::EMAIL_TYPE,
			MetaFieldModel::EMBED_TYPE,
			MetaFieldModel::HTML_TYPE,
			MetaFieldModel::NUMBER_TYPE,
			MetaFieldModel::PHONE_TYPE,
			MetaFieldModel::RANGE_TYPE,
			MetaFieldModel::TEXT_TYPE,
			MetaFieldModel::TEXTAREA_TYPE,
			MetaFieldModel::TOGGLE_TYPE,
		];
	}

	/**
	 * @return string
	 */
	public function get_category()
	{
		return self::CATEGORY_TEXT;
	}

	/**
	 * @return string
	 */
	public function get_id()
	{
		return 'acpt-field-text';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Textual field');
	}

	/**
	 * @param mixed $fieldObject
	 *
	 * @throws \Exception
	 */
	public function render($fieldObject)
	{
		//#! Invalid entry, nothing to do here
		if ( empty( $fieldObject[ 'field_name' ] ) ) {
			return;
		}

		$fieldSettings = FieldSettings::get($fieldObject[ 'field_name' ]);

		if($fieldSettings === false or empty($fieldSettings)){
			return;
		}

		/** @var MetaFieldModel $metaFieldModel */
		$metaFieldModel = $fieldSettings['model'];
		$belongsTo = $fieldSettings['belongsTo'];

		if(!$this->isSupportedFieldType($metaFieldModel->getType())){
			return;
		}

		$rawValue = FieldValue::raw($belongsTo, $metaFieldModel);

		if(empty($rawValue)){
			return;
		}

		switch ($metaFieldModel->getType()){
			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
				if(!is_array($rawValue)){
					return;
				}

				echo implode(',', $rawValue);
				break;

			case MetaFieldModel::TEXTAREA_TYPE:

				if(is_string($rawValue)){
					echo WPUtils::renderShortCode($rawValue, true);
				}

				break;

			case MetaFieldModel::TOGGLE_TYPE:

				echo ($rawValue == 1) ? '1' : '0';
				break;

			default:
			echo $rawValue;
		}
	}
}