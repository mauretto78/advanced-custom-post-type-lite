<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeDate extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::DATE_TYPE,
			MetaFieldModel::DATE_TIME_TYPE,
			MetaFieldModel::DATE_RANGE_TYPE,
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
		return 'acpt-field-date';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT Date field');
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
				'format' => [
					'type'        => 'select',
					'title'       => Translator::translate('Date format'),
					'description' => Translator::translate('Select the date format'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'F j, Y',
					'options'     => [
						['name' => 'F j, Y', 'id' => 'F j, Y'],
						['name' => 'Y-m-d', 'id' => 'Y-m-d'],
						['name' => 'm/d/Y', 'id' => 'm/d/Y'],
						['name' => 'd/m/Y', 'id' => 'd/m/Y'],
					]
				],
				'time_format' => [
					'type'        => 'select',
					'title'       => Translator::translate('Time format'),
					'description' => Translator::translate('Select the time format'),
					'placeholder' => Translator::translate('--Select--'),
					'default'     => 'F j, Y',
					'options'     => [
						['name' => 'H:i', 'id' => 'H:i'],
						['name' => 'g:i a', 'id' => 'g:i a'],
						['name' => 'g:i A', 'id' => 'g:i A'],
					]
				],
				'separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('Date range separator'),
					'description' => Translator::translate('Select the date range separator'),
					'default'     => '-',
				]
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

		$format = $fieldObject['format'] ?? 'F j, Y';
		$timeFormat = $fieldObject['time_format'] ?? 'H:i';
		$separator = $fieldObject['separator'] ?? '-';

		switch ($metaFieldModel->getType()){
			case MetaFieldModel::DATE_TYPE:
				echo date_i18n($format, strtotime($rawValue));
				break;

			case MetaFieldModel::DATE_TIME_TYPE:
				$format = $format . ' ' . $timeFormat;
				echo date_i18n($format, strtotime($rawValue));
				break;

			case MetaFieldModel::DATE_RANGE_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(count($rawValue) !== 2){
					return;
				}

				$start = $rawValue[0];
				$end = $rawValue[1];

				echo date_i18n($format, strtotime($start)) . $separator .  date_i18n($format, strtotime($end));
				break;

			default:
			echo $rawValue;
		}
	}
}