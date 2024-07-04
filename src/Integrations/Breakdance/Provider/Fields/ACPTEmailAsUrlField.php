<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use Breakdance\DynamicData\StringData;

class ACPTEmailAsUrlField extends ACPTStringAsUrlField
{
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

		$value = "mailto:".sanitize_email(strip_tags($value));

		return StringData::fromString($value);
	}
}
