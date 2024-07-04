<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use Breakdance\DynamicData\StringData;

class ACPTUrlAsUrlField extends ACPTStringAsUrlField
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

		if(!isset($value['url']) or empty($value['url'])){
			return StringData::emptyString();
		}

		$href = $value['url'];

		return StringData::fromString($href);
	}
}
