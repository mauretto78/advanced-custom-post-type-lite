<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Breakdance\DynamicData\StringData;

class ACPTVideoAsUrlField extends ACPTStringAsUrlField
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

		if(empty($value)){
			return StringData::emptyString();
		}

		if(!$value instanceof WPAttachment){
			return StringData::emptyString();
		}

		return StringData::fromString($value->getSrc());
	}
}
