<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;

class ValidationRuleSchema extends AbstractJSONSchema
{
	/**
	 * @inheritDoc
	 */
	function toArray()
	{
		return [
			'type' => 'object',
			'additionalProperties' => false,
			'properties' => [
				'id' => [
					'type' => 'string',
					'format' => 'uuid',
					'readOnly' => true,
				],
				'condition' => [
					'type' => 'string',
					'enum' => [
						ValidationRuleModel::IS_BLANK,
						ValidationRuleModel::IS_NOT_BLANK,
						ValidationRuleModel::EQUALS,
						ValidationRuleModel::NOT_EQUALS,
						ValidationRuleModel::GREATER_THAN,
						ValidationRuleModel::GREATER_THAN_EQUALS,
						ValidationRuleModel::LOWER_THAN,
						ValidationRuleModel::LOWER_THAN_EQUALS,
						ValidationRuleModel::MAX_LENGTH,
						ValidationRuleModel::MIN_LENGTH,
						ValidationRuleModel::REGEX,
					]
				],
				'value' => [
					'type' => 'string',
					'nullable' => true
				],
				'message' => [
					'type' => 'string',
					'nullable' => true
				],
			],
			'required' => [
				'condition',
			]
		];
	}
}