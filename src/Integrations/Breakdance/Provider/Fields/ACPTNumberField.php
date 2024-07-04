<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTNumberField extends ACPTStringField
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
					['text' => 'Integer', 'value' => 'integer'],
					['text' => 'Float', 'value' => 'float'],
				]
			]),
			\Breakdance\Elements\control('decimal_points', Translator::translate('Decimal points'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'float'
				]
			]),
			\Breakdance\Elements\control('decimal_separator', Translator::translate('Decimal separator'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'float'
				]
			]),
			\Breakdance\Elements\control('thousands_separator', Translator::translate('Thousands separator'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.render',
					'operand' => 'equals',
					'value' => 'float'
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
			'render' => 'integer',
			'decimal_points' => '0',
			'decimal_separator' => '.',
			'thousands_separator' => ',',
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
		$format = $attributes['render'] ?? null;

		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if($format === 'float'){
			$decimalPoints = $attributes['decimal_points'] ?? 0;
			$decimalSeparator = $attributes['decimal_separator'] ?? ".";
			$thousandsSeparator = $attributes['thousands_separator'] ?? ",";

			$value = number_format($value, (int)$decimalPoints, $decimalSeparator, $thousandsSeparator);
		}

		if($value === null){
			return StringData::emptyString();
		}

		return StringData::fromString($value);
	}
}
