<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTDateRangeField extends ACPTDateField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [
			\Breakdance\Elements\control('render',  Translator::translate('Render as'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => [
					['text' => 'Start date, end date', 'value' => 'both'],
					['text' => 'Only start date', 'value' => 'start'],
					['text' => 'Only end date', 'value' => 'end'],
				],
			]),
			\Breakdance\Elements\control('separator',  Translator::translate('Date separator'), [
				'type' => 'text',
				'layout' => 'vertical',
			]),
			\Breakdance\Elements\control('format', Translator::translate('Format'), [
				'type' => 'dropdown',
				'layout' => 'vertical',
				'items' => array_merge(
					[
						['text' => 'Default', 'value' => '']
					],
					\Breakdance\DynamicData\get_date_formats(),
					[
						['text' => 'Custom', 'value' => 'Custom'],
						['text' => 'Human', 'value' => 'Human']
					]
				),
				[
					['text' => 'Custom', 'value' => 'Custom'],
					['text' => 'Human', 'value' => 'Human']
				]
			]),
			\Breakdance\Elements\control('custom_format', Translator::translate('Custom Format'), [
				'type' => 'text',
				'layout' => 'vertical',
				'condition' => [
					'path' => 'attributes.format',
					'operand' => 'equals',
					'value' => 'Custom'
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
			'render' => 'both',
			'separator' => '/',
			'format' => 'F j, Y',
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
		$format = $attributes['format'] ?? get_option('date_format');
		$render = $attributes['render'] ?? 'both';
		$separator = $attributes['separator'] ?? '/';
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_array($value) or empty($value)){
			return StringData::emptyString();
		}

		$start = $value[0];
		$end = $value[1];

		try {
			$startDatetime = new \DateTime($start);
			$endDatetime = new \DateTime($end);
		} catch (\Exception $exception){
			return StringData::emptyString();
		}

		if ($format === 'Custom') {
			$format = $attributes['custom_format'] ?? 'F j, Y';
		}

		$startDate = $this->dateString($startDatetime, $format);
		$endDate = $this->dateString($endDatetime, $format);

		if($render === 'start'){
			return StringData::fromString($startDate);
		}

		if($render === 'end'){
			return StringData::fromString($endDate);
		}

		return StringData::fromString($startDate.$separator.$endDate);
	}
}