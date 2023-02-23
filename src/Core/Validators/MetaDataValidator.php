<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Utils\Assert;

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

		switch ($type){

			case CustomPostTypeMetaBoxFieldModel::EMAIL_TYPE:
				Assert::email($rawData);
				break;

			default:
				Assert::string($rawData);
		}
	}
}