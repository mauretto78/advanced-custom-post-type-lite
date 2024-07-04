<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTLabelValueField extends ACPTStringField
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
					['text' => Translator::translate('Label'), 'value' => 'label'],
					['text' => Translator::translate('Value'), 'value' => 'value'],
				]
			]),
			\Breakdance\Elements\control('separator',  Translator::translate('String separator'), [
				'type' => 'text',
				'layout' => 'vertical',
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
			'separator' => ',',
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
		$format = $attributes['render'] ?? 'value';
		$separator = (isset($attributes['separator']) and $attributes['separator'] !== null) ? $attributes['separator'] : ',';
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(empty($value)){
			return StringData::emptyString();
		}

		if(is_array($value)){
			$items = [];

			foreach ($value as $item){
				$items[] = ($format === 'label') ? $this->fieldModel->getOptionLabel($item) : $item;
			}

			if(!is_array($items)){
				return StringData::emptyString();
			}

			$value = implode($separator, $items);

			return StringData::fromString($value);
		}

		$value = ($format === 'label') ? $this->fieldModel->getOptionLabel($value) : $value;

		return StringData::fromString($value);
	}
}