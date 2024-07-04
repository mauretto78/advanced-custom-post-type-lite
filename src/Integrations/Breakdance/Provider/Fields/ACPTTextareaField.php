<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\WPUtils;
use Breakdance\DynamicData\StringData;

class ACPTTextareaField extends ACPTStringField
{
	/**
	 * @return array
	 */
	public function controls()
	{
		return [];
	}

	/**
	 * @inheritDoc
	 */
	public function defaultAttributes()
	{
		return [];
	}

	/**
	 * @param mixed $attributes
	 *
	 * @return StringData
	 * @throws \Exception
	 */
	public function handler($attributes): StringData
	{
		$value = ACPTField::getValue($this->fieldModel, $attributes);

		if(!is_string($value) or $value === null){
			return StringData::emptyString();
		}

		$value = WPUtils::renderShortCode($value, true);

		return StringData::fromString($value);
	}
}
