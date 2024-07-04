<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Fields;

use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldSettings;
use ACPT_Lite\Integrations\Zion\Provider\Utils\FieldValue;
use ACPT_Lite\Utils\Wordpress\Translator;

class AcptFieldTypeUOM extends AcptFieldBase
{
	/**
	 * Retrieve the list of all supported field types
	 * @return array
	 */
	public static function getSupportedFieldTypes()
	{
		return [
			MetaFieldModel::CURRENCY_TYPE,
			MetaFieldModel::LENGTH_TYPE,
			MetaFieldModel::WEIGHT_TYPE,
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
		return 'acpt-field-uom';
	}

	/**
	 * @return string
	 */
	public function get_name()
	{
		return Translator::translate( 'ACPT UOM field');
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
				'decimal_points' => [
					'type'        => 'number',
					'title'       => Translator::translate('Decimal points'),
					'description' => Translator::translate('Set the decimal points.'),
					'default'     => '0',
				],
				'decimal_separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('Decimal separator'),
					'description' => Translator::translate('Set the decimal separator.'),
					'default'     => '.',
				],
				'thousands_separator' => [
					'type'        => 'text',
					'title'       => Translator::translate('Thousands separator'),
					'description' => Translator::translate('Set the thousands separator.'),
					'default'     => ',',
				],
				'uom_format' => [
					'type'        => 'select',
					'title'       => Translator::translate('UOM format'),
					'description' => Translator::translate('Select the UOM format.'),
					'default'     => 'full',
					'options'     => [
						['name' => Translator::translate('Full UOM name'), 'id' => 'full'],
						['name' => Translator::translate('Abbreviation'), 'id' => 'abbreviation'],
					]
				],
				'position' => [
					'type'        => 'select',
					'title'       => Translator::translate('UOM position'),
					'description' => Translator::translate('Select the UOM position'),
					'default'     => 'after',
					'options'     => [
						['name' => Translator::translate('After value'), 'id' => 'after'],
						['name' => Translator::translate('Before value'), 'id' => 'before'],
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

		if(!$this->isSupportedFieldType($metaFieldModel->getType())){
			return;
		}

		$rawValue = FieldValue::raw($belongsTo, $metaFieldModel);

		if(empty($rawValue)){
			return;
		}

		$decimalPoints = $fieldObject['decimal_points'] ?? 0;

		if($decimalPoints < 0){
			$decimalPoints = 0;
		}

		$decimalSeparator = $fieldObject['decimal_separator'] ?? '.';
		$thousandsSeparator = $fieldObject['thousands_separator'] ?? ',';
		$uomFormat = $fieldObject['uom_format'] ?? 'full';
		$position = $fieldObject['position'] ?? 'after';

		switch ($metaFieldModel->getType()){
			case MetaFieldModel::CURRENCY_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(!isset($rawValue['amount']) and !isset($rawValue['unit'])){
					return;
				}

				$amount = $rawValue['amount'];
				$unit = $rawValue['unit'];

				$amount = number_format($amount, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($uomFormat === 'abbreviation') ? Currencies::getSymbol($unit) : $unit;

				if($position === 'before'){
					echo $unit . ' ' . $amount;
				} else {
					echo $amount . ' ' . $unit;
				}

				break;

			case MetaFieldModel::LENGTH_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(!isset($rawValue['amount']) and !isset($rawValue['unit'])){
					return;
				}

				$length = $rawValue['length'];
				$unit = $rawValue['unit'];

				$length = number_format($length, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($uomFormat === 'abbreviation') ? Lengths::getSymbol($unit) : $unit;

				if($position === 'before'){
					echo $unit . ' ' . $length;
				} else {
					echo $length . ' ' . $unit;
				}

				break;

			case MetaFieldModel::WEIGHT_TYPE:

				if(empty($rawValue)){
					return;
				}

				if(!isset($rawValue['amount']) and !isset($rawValue['unit'])){
					return;
				}

				$weight = $rawValue['weight'];
				$unit = $rawValue['unit'];

				$weight = number_format($weight, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
				$unit = ($uomFormat === 'abbreviation') ? Weights::getSymbol($unit) : $unit;

				if($position === 'before'){
					echo $unit . ' ' . $weight;
				} else {
					echo $weight . ' ' . $unit;
				}

				break;

			default:
			echo $rawValue;
		}
	}
}