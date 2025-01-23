<?php

namespace ACPT_Lite\Core\Generators\Validation;

use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class DataValidateAttributes
{
	/**
	 * @param ValidationRuleModel[] $rules
	 * @param bool $isTextualField
	 * @param bool $isRequired
	 *
	 * @return string
	 */
	public static function generate(array $rules, $isTextualField = false, $isRequired = false)
	{
		$attributes = ' data-acpt-validate';

		if($isRequired){
			$attributes .= ' data-acpt-validate-required="'.Translator::translate("Field required").'" ';
		}

		foreach($rules as $validationRule){
			$attributeName = self::resolveDataValidateAttributeName($validationRule, $isTextualField);
			$value = $validationRule->getValue() ? $validationRule->getValue() : 'true';
			$attributes .= ' '.$attributeName.'="'.$value.'"';
			$attributes .= ' '.$attributeName.'-message="'.str_replace("{{v}}", $validationRule->getValue(), $validationRule->getMessage()).'"';
		}

		return $attributes;
	}

	/**
	 * @param ValidationRuleModel $validationRule
	 * @param $isTextualField
	 *
	 * @return string
	 */
	private static function resolveDataValidateAttributeName(ValidationRuleModel $validationRule, $isTextualField)
	{
		switch ($validationRule->getCondition()){
			case ValidationRuleModel::IS_BLANK:
				return "data-acpt-validate-blank";

			case ValidationRuleModel::IS_NOT_BLANK:
				return "data-acpt-validate-not-blank";

			case ValidationRuleModel::EQUALS:
				return "data-acpt-validate-equals";

			case ValidationRuleModel::NOT_EQUALS:
				return "data-acpt-validate-not-equals";

			case ValidationRuleModel::GREATER_THAN:
				return "data-acpt-validate-gt";

			case ValidationRuleModel::GREATER_THAN_EQUALS:
				return "data-acpt-validate-gte";

			case ValidationRuleModel::LOWER_THAN:
				return "data-acpt-validate-lt";

			case ValidationRuleModel::LOWER_THAN_EQUALS:
				return "data-acpt-validate-lte";

			case ValidationRuleModel::MIN_LENGTH:

				if($isTextualField){
					return "data-acpt-validate-minlength";
				}

				return "data-acpt-validate-min";

			case ValidationRuleModel::MAX_LENGTH:

				if($isTextualField){
					return "data-acpt-validate-maxlength";
				}

				return "data-acpt-validate-max";

			case ValidationRuleModel::REGEX:
				return "data-acpt-validate-regex";
		}

		return 'data-acpt-validate-equals';
	}
}