<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTCurrencyField extends ACPTStringField
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
					'0' => ['text' => 'Value and currency', 'value' => 'both'],
					'1' => ['text' => 'Only value', 'value' => 'value'],
					'2' => ['text' => 'Only currency', 'value' => 'currency'],
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
			\Breakdance\Elements\control('currency_format', Translator::translate('Currency format'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => 'Full currency name', 'value' => 'full'],
					['text' => 'Abbreviation', 'value' => 'abbreviation'],
				],
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'is one of',
					'value' => [
						'0' => 'both',
						'1' => 'currency'
					]
				]
			]),
			\Breakdance\Elements\control('currency_position', Translator::translate('Currency position'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => 'After value', 'value' => 'after'],
					['text' => 'Before value', 'value' => 'before'],
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
			'currency_format' => 'full',
			'currency_position' => 'after',
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

		if($decimalPoints < 0){
			$decimalPoints = 0;
		}

		$decimalSeparator = $attributes['value_format_decimal_separator'] ?? ".";
		$thousandsSeparator = $attributes['value_format_thousands_separator'] ?? ",";
		$currencyFormat = $attributes['currency_format'] ?? "full";
		$currencyPosition = $attributes['currency_position'] ?? "after";

		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_array($value)){
			return StringData::emptyString();
		}

		if(!isset($value['amount'])){
			return StringData::emptyString();
		}

		if(!isset($value['unit'])){
			return StringData::emptyString();
		}

		$amount = $value['amount'];
		$unit = $value['unit'];

		$amount = number_format($amount, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
		$unit = ($currencyFormat === 'abbreviation') ? Currencies::getSymbol($unit) : $unit;

		if($render === 'value'){
			if($amount === null){
				return StringData::emptyString();
			}

			return StringData::fromString($amount);
		}

		if($render === 'currency'){
			if($unit === null){
				return StringData::emptyString();
			}

			return StringData::fromString($unit);
		}

		if($currencyPosition === 'before'){
			if($unit === null or $amount === null){
				return StringData::emptyString();
			}

			return StringData::fromString($unit . ' ' . $amount);
		}

		if($unit === null or $amount === null){
			return StringData::emptyString();
		}

		return StringData::fromString($amount . ' ' . $unit);
	}
}
