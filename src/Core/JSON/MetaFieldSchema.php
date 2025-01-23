<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class MetaFieldSchema extends AbstractJSONSchema
{
	/**
	 * @var bool
	 */
	private $showChildren;

	/**
	 * @var bool
	 */
	private $showBlocks;

	/**
	 * MetaBoxFieldSchema constructor.
	 *
	 * @param bool $showChildren
	 * @param bool $showBlocks
	 */
	public function __construct($showChildren = true, $showBlocks = true)
	{
		$this->showChildren = $showChildren;
		$this->showBlocks = $showBlocks;
	}

	/**
	 * @inheritDoc
	 */
	function toArray()
	{
		$return = [
			'type' => 'object',
			'additionalProperties' => false,
			'properties' => [
				'id' => [
					'type' => 'string',
					'format' => 'uuid',
					'readOnly' => true,
				],
				'boxId' => [
					'type' => 'string',
					'format' => 'uuid',
					'readOnly' => true,
				],
				'db_name' => [
					'type' => 'string',
					'readOnly' => true,
				],
				'ui_name' => [
					'type' => 'string',
					'readOnly' => true,
				],
				'name' => [
					'type' => 'string',
				],
				'type' => [
					'type' => 'string',
					'enum' => [
						MetaFieldModel::ADDRESS_TYPE,
						MetaFieldModel::COLOR_TYPE,
						MetaFieldModel::CHECKBOX_TYPE,
						MetaFieldModel::CURRENCY_TYPE,
						MetaFieldModel::DATE_TYPE,
						MetaFieldModel::DATE_TIME_TYPE,
						MetaFieldModel::DATE_RANGE_TYPE,
						MetaFieldModel::EDITOR_TYPE,
						MetaFieldModel::EMAIL_TYPE,
						MetaFieldModel::EMBED_TYPE,
						MetaFieldModel::FILE_TYPE,
						MetaFieldModel::HTML_TYPE,
						MetaFieldModel::FLEXIBLE_CONTENT_TYPE,
						MetaFieldModel::GALLERY_TYPE,
						MetaFieldModel::ICON_TYPE,
						MetaFieldModel::IMAGE_TYPE,
						MetaFieldModel::LENGTH_TYPE,
						MetaFieldModel::LIST_TYPE,
						MetaFieldModel::NUMBER_TYPE,
						MetaFieldModel::POST_TYPE,
						MetaFieldModel::PHONE_TYPE,
						MetaFieldModel::REPEATER_TYPE,
						MetaFieldModel::RADIO_TYPE,
						MetaFieldModel::RANGE_TYPE,
						MetaFieldModel::RATING_TYPE,
						MetaFieldModel::SELECT_TYPE,
						MetaFieldModel::SELECT_MULTI_TYPE,
						MetaFieldModel::TEXT_TYPE,
						MetaFieldModel::TEXTAREA_TYPE,
						MetaFieldModel::TIME_TYPE,
						MetaFieldModel::TOGGLE_TYPE,
						MetaFieldModel::VIDEO_TYPE,
						MetaFieldModel::WEIGHT_TYPE,
						MetaFieldModel::URL_TYPE,
						MetaFieldModel::USER_TYPE,
						MetaFieldModel::USER_MULTI_TYPE,
					],
					'example' => MetaFieldModel::TEXT_TYPE
				],
				'defaultValue' => [
					'type' => ['string', 'null'],
					'example' => 'Default value',
					'nullable' => true,
				],
				'description' => [
					'type' => 'string',
				],
				'isRequired' => [
					'type' => 'boolean',
				],
				'showInArchive' => [
					'type' => 'boolean',
				],
				'sort' => [
					'type' => 'integer',
					'example' => 1,
					'readOnly' => true,
				],
				'options' => [
					'type' => 'array',
					'items' => (new MetaFieldOptionSchema())->toArray(),
				],
				'visibilityConditions' => [
					'type' => 'array',
					'items' => (new MetaFieldvisibilityConditionSchema())->toArray(),
				],
				'advancedOptions' => [
					'type' => 'array',
					'items' => (new MetaFieldAdvancedOptionSchema())->toArray(),
				],
				'relations' => [
					'type' => 'array',
					'items' => (new MetaFieldRelationSchema())->toArray(),
				],
				'validationRules' => [
					'type' => 'array',
					'items' => (new ValidationRuleSchema())->toArray(),
				],
				'hasChildren' => [
					'type' => 'boolean',
				],
			],
			'required' => [
				'name',
				'type',
				'isRequired',
			]
		];

		if($this->showBlocks){
			$return['properties']['blocks'] = [
				'type' => 'array',
				'items' => (new MetaFieldBlockSchema())->toArray(),
			];
		}


		if($this->showChildren){
			$return['properties']['children'] = [
				'type' => 'array',
				'items' => (new MetaFieldSchema( false, false))->toArray(),
			];
		}

		return $return;
	}
}
