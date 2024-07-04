<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\PHP\Country;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeCountry extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::COUNTRY_TYPE,
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
		return 'acpt-field-country';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Country field');
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	public function get_options()
	{
		return array_merge(
			parent::get_options(),
			[
				'render' => [
					'type'        => 'select',
					'title'       => Translator::translate('What you want to display?'),
					'description' => Translator::translate('What you want to display?'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'text',
					'options'     => [
						['name' => 'Plain text', 'id' => 'text'],
						['name' => 'Flag', 'id' => 'flag'],
						['name' => 'Flag and text', 'id' => 'full'],
					]
				],
			]
		);
	}

	/**
	 * @param mixed $fieldObject
	 *
	 * @throws \Exception
	 */
	public function render($fieldObject)
	{
		//#! Invalid entry, nothing to do here
		if (empty($fieldObject[ 'field_name' ])) {
			return;
		}

		$fieldSettings = FieldSettings::get($fieldObject[ 'field_name' ]);

		if($fieldSettings === false or empty($fieldSettings)){
			return;
		}

		/** @var MetaFieldModel $metaFieldModel */
		$metaFieldModel = $fieldSettings['model'];
		$belongsTo = $fieldSettings['belongsTo'];
		$find = $fieldSettings['find'];

		$metaFieldModel->setBelongsToLabel($belongsTo);
		$metaFieldModel->setFindLabel($find);

		if(!$this->isSupportedFieldType($metaFieldModel->getType())){
			return;
		}

		$rawValue = FieldValue::raw($belongsTo, $metaFieldModel);

		if(empty($rawValue)){
			return;
		}

		$render = $fieldObject['render'] ?? 'text';

		if(is_array($rawValue) and isset($rawValue['value']) and isset($rawValue['country'])){
			$countryName = $rawValue['value'];
			$countryCode = $rawValue['country'];

			switch ($render){
				case "flag":
					echo Country::getFlag($countryCode);
					break;

				case "full":
					echo Country::fullFormat($countryCode, $countryName);
					break;

				default:
				case "text":
					echo $countryName;
					break;
			}
		}
	}
}