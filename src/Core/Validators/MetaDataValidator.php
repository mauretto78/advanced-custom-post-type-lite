<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Assert;

class MetaDataValidator
{
	/**
	 * @param string $type
	 * @param mixed $rawData
	 * @param bool $isRequired
	 */
	public static function validate($type, $rawData, $isRequired = false)
	{
		if($isRequired){
			Assert::notEmpty($rawData);
		}

		if(!$isRequired and empty($rawData)){
			return;
		}

		switch ($type){

			case MetaFieldModel::DATE_TYPE:
				Assert::date($rawData);
				break;

			case MetaFieldModel::EMAIL_TYPE:
				Assert::email($rawData);
				break;

			default:
				Assert::string($rawData);
		}
	}
}