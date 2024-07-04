<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTTimeField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('format',  Translator::translate('Format'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => array_merge(
					[['text' => 'Default', 'value' => 'H:i']],
					\Breakdance\DynamicData\get_time_formats(),
					[
						['text' => 'Custom', 'value' => 'Custom'],
					]
				)
			]),
			\Breakdance\Elements\control('custom_format',  Translator::translate('Custom Format'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.format',
					'operand' => 'equals',
					'value' => 'Custom'
				]
			])
		];
	}

	/**
	 * @inheritDoc
	 */
	public function defaultAttributes()
	{
		return [
			'format' => 'H:i'
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
		$format = $attributes['format'] ?? 'H:i';
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_string($value) or $value === null){
			return StringData::emptyString();
		}

		if ($format === 'Custom') {
			$format = $attributes['custom_format'] ?? 'H:i';
		}

		$value = date_i18n($format, strtotime($value));

		return StringData::fromString($value);
	}
}