<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTLengthField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('render', Translator::translate('Render as'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					'0' => ['text' => Translator::translate('Value and UOM'), 'value' => 'both'],
					'1' => ['text' => Translator::translate('Only value'), 'value' => 'value'],
					'2' => ['text' => Translator::translate('Only UOM'), 'value' => 'uom'],
				]
			]),
			\Breakdance\Elements\control('value_format_decimal_points', Translator::translate('Value format (Decimal points)'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both',
						'1' => 'value',
					]
				]
			]),
			\Breakdance\Elements\control('value_format_decimal_separator', Translator::translate('Value format (Decimal separator)'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both',
						'1' => 'value'
					]
				]
			]),
			\Breakdance\Elements\control('value_format_thousands_separator', Translator::translate('Value format (Thousands separator)'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both',
						'1' => 'value'
					]
				]
			]),
			\Breakdance\Elements\control('uom_format', Translator::translate('UOM format'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => Translator::translate('Full UOM name'), 'value' => 'full'],
					['text' => Translator::translate('Abbreviation'), 'value' => 'abbreviation'],
				],
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both',
						'1' => 'uom'
					]
				]
			]),
			\Breakdance\Elements\control('uom_position', Translator::translate('UOM position'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => Translator::translate('After value'), 'value' => 'after'],
					['text' => Translator::translate('Before value'), 'value' => 'before'],
				],
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both'
					]
				]
			]),
		];
	}

	/**
	 * @inheritDoc
	 */
	public function defaultAttributes()
	{
		return [
			'render' => 'value',
			'value_format_decimal_points' => '0',
			'value_format_decimal_separator' => '.',
			'value_format_thousands_separator' => ',',
			'uom_format' => 'full',
			'uom_position' => 'after',
		];
	}

	/**
	 * @param mixed $attributes
	 *
	 * @return StringData
	 * @throws \Exception
	 */
	public function handler($attributes): StringData
	{
		$render = $attributes['render'] ?? null;
		$decimalPoints = $attributes['value_format_decimal_points'] ?? 0;
		$decimalSeparator = $attributes['value_format_decimal_separator'] ?? ".";
		$thousandsSeparator = $attributes['value_format_thousands_separator'] ?? ",";
		$uomFormat = $attributes['uom_format'] ?? "full";
		$uomPosition = $attributes['uom_position'] ?? "after";

		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_array($value)){
			return StringData::emptyString();
		}

		if(!isset($value['length'])){
			return StringData::emptyString();
		}

		if(!isset($value['unit'])){
			return StringData::emptyString();
		}

		$length = $value['length'];
		$unit = $value['unit'];

		$length = number_format($length, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
		$unit = ($uomFormat === 'abbreviation') ? Lengths::getSymbol($unit) : $unit;

		if($render === 'value'){
			if($length === null){
				return StringData::emptyString();
			}

			return StringData::fromString($length);
		}

		if($render === 'uom'){
			if($unit === null){
				return StringData::emptyString();
			}

			return StringData::fromString($unit);
		}

		if($uomPosition === 'before'){
			if($unit === null or $length === null){
				return StringData::emptyString();
			}

			return StringData::fromString($unit . ' ' . $length);
		}

		if($unit === null or $length === null){
			return StringData::emptyString();
		}

		return StringData::fromString($length . ' ' . $unit);
	}
}
