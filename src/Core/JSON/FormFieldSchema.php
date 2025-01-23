<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Core\Models\Form\FormFieldModel;

class FormFieldSchema extends AbstractJSONSchema
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
				'group' => [
					'type' => 'string',
				],
				'name' => [
					'type' => 'string',
				],
				'key' => [
					'type' => 'string',
				],
				'label' => [
					'type' => 'string',
				],
				'type' => [
					'type' => 'string',
					'enum' => [
						FormFieldModel::ADDRESS_TYPE,
						FormFieldModel::BUTTON_TYPE,
						FormFieldModel::CAPTCHA_TYPE,
						FormFieldModel::CHECKBOX_TYPE,
						FormFieldModel::COLOR_TYPE,
						FormFieldModel::CURRENCY_TYPE,
						FormFieldModel::DATE_TYPE,
						FormFieldModel::DATE_TIME_TYPE,
						FormFieldModel::DATE_RANGE_TYPE,
						FormFieldModel::EMAIL_TYPE,
						FormFieldModel::FILE_TYPE,
						FormFieldModel::HIDDEN_TYPE,
						FormFieldModel::HTML_TYPE,
						FormFieldModel::ICON_TYPE,
						FormFieldModel::LENGTH_TYPE,
						FormFieldModel::NUMBER_TYPE,
						FormFieldModel::PHONE_TYPE,
						FormFieldModel::RADIO_TYPE,
						FormFieldModel::RANGE_TYPE,
						FormFieldModel::RATING_TYPE,
						FormFieldModel::SELECT_TYPE,
						FormFieldModel::TEXT_TYPE,
						FormFieldModel::TEXTAREA_TYPE,
						FormFieldModel::TIME_TYPE,
						FormFieldModel::TOGGLE_TYPE,
						FormFieldModel::URL_TYPE,
						FormFieldModel::WEIGHT_TYPE,
						FormFieldModel::WORDPRESS_POST_THUMBNAIL,
						FormFieldModel::WORDPRESS_POST_TITLE,
						FormFieldModel::WORDPRESS_POST_CONTENT,
						FormFieldModel::WORDPRESS_POST_EXCERPT,
						FormFieldModel::WORDPRESS_POST_DATE,
						FormFieldModel::WORDPRESS_POST_AUTHOR,
						FormFieldModel::WORDPRESS_USER_EMAIL,
						FormFieldModel::WORDPRESS_USER_FIRST_NAME,
						FormFieldModel::WORDPRESS_USER_LAST_NAME,
						FormFieldModel::WORDPRESS_USER_USERNAME,
						FormFieldModel::WORDPRESS_USER_PASSWORD,
					],
				],
				'description' => [
					'type' => 'string',
				],
				'isRequired' => [
					'type' => 'boolean',
				],
				'extra' => [
					'type' => 'array',
					'items' => [
						'type' => 'object',
						"patternProperties" => [
							"^\\d+$" => [
								"type" => "object",
								"etc" => "etc"
							]
						]
					]
				],
				'settings' => [
					'type' => 'array',
					'items' => [
						'type' => 'object',
						"patternProperties" => [
							"^\\d+$" => [
								"type" => "object",
                                "etc" => "etc"
							]
						]
					]
				],
				'validationRules' => [
					'type' => 'array',
					'items' => (new ValidationRuleSchema())->toArray(),
				],
				'sort' => [
					'type' => 'integer',
					'example' => 1,
					'readOnly' => true,
				],
			],
			'required' => [
				'group',
				'name',
				'key',
				'type',
				'isRequired',
			]
		];
	}
}