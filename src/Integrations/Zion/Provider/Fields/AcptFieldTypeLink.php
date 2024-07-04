<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\PHP\Phone;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class AcptFieldTypeLink extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::EMAIL_TYPE,
			MetaFieldModel::FILE_TYPE,
			MetaFieldModel::IMAGE_TYPE,
			MetaFieldModel::PHONE_TYPE,
			MetaFieldModel::URL_TYPE,
			MetaFieldModel::VIDEO_TYPE,
		];
	}

	/**
	 * @return string
	 */
	public function get_category()
	{
		return self::CATEGORY_LINK;
	}

	/**
	 * @return string
	 */
	public function get_id()
	{
		return 'acpt-field-link';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Link field');
	}

	/**
	 * @param mixed $fieldObject
	 *
	 * @throws \Exception
	 */
	public function render($fieldObject)
	{
		//#! Invalid entry, nothing to do here
		if(empty( $fieldObject['field_name'])) {
			return;
		}

		$fieldSettings = FieldSettings::get($fieldObject['field_name']);

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
			case MetaFieldModel::EMAIL_TYPE:
				echo esc_url('mailto:'.sanitize_email(strip_tags($rawValue)));
				break;

			case MetaFieldModel::IMAGE_TYPE:
			case MetaFieldModel::VIDEO_TYPE:

				if(!$rawValue instanceof WPAttachment){
					return;
				}

				echo $rawValue->getSrc();
				break;

			case MetaFieldModel::FILE_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(!isset($rawValue['file'])){
					return;
				}

				if(!$rawValue['file'] instanceof WPAttachment){
					return;
				}

				/** @var WPAttachment $file */
				$file = $rawValue['file'];

				echo $file->getSrc();
				break;

			case MetaFieldModel::PHONE_TYPE:
				echo esc_url('tel:'.Phone::url($rawValue));
				break;

			case MetaFieldModel::URL_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(!isset($rawValue['url'])){
					return;
				}

				echo esc_url(strip_tags($rawValue['url']));
				break;

			default:
				echo $rawValue;
		}
	}
}