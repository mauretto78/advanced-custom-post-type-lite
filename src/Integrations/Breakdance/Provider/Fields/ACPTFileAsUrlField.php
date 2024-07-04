<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Fields;

use ACPT_Lite\Utils\Wordpress\WPAttachment;
use Breakdance\DynamicData\StringData;

class ACPTFileAsUrlField extends ACPTStringAsUrlField
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

		if(!isset($value['file']) or !$value['file'] instanceof WPAttachment){
			return StringData::emptyString();
		}

		/** @var WPAttachment $file */
		$file = $value['file'];
		$src = $file->getSrc();

		return StringData::fromString($src);
	}
}
