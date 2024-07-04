<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\PHP\Country;
use ACPT_Lite\Utils\Wordpress\Translator;
use Breakdance\DynamicData\StringData;

class ACPTCountryField extends ACPTStringField
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
					'0' => ['text' => 'Plain text', 'value' => 'text'],
					'1' => ['text' => 'Flag', 'value' => 'flag'],
					'2' => ['text' => 'Flag and text', 'value' => 'full'],
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
			'render' => 'text',
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
		$render = $attributes['render'] ?? 'text';

		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_array($value)){
			return StringData::emptyString();
		}

		if(!isset($value['value'])){
			return StringData::emptyString();
		}

		if(!isset($value['country'])){
			return StringData::emptyString();
		}

		$countryName = $value['value'];
		$countryCode = $value['country'];

		if($render === 'flag'){
			return StringData::fromString(Country::getFlag($countryCode));
		}

		if($render === 'full'){
			return StringData::fromString(Country::fullFormat($countryCode, $countryName));
		}

		return StringData::fromString($countryName);
	}
}
