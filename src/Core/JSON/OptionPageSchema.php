<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Constants\Capabilities;
use ACPT_Lite\Constants\Dashicons;

class OptionPageSchema extends AbstractJSONSchema
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
				'parentId' => [
					'type' => ['string', 'null'],
					'format' => 'uuid',
					'example' => '0a3154e2-0bc6-49a4-b91d-bc8fec485e57',
					'nullable' => true,
				],
				'pageTitle' => [
					'type' => "string",
					'example' => 'Page title',
				],
				'menuTitle' => [
					'type' => "string",
					'example' => 'Menu title',
				],
				'capability' => [
					'type' => "string",
					'enum' => Capabilities::ALLOWED_VALUES,
					'example' => 'manage_options',
				],
				'menuSlug' => [
					'type' => "string",
					'example' => 'menu-slug',
				],
				'icon' =>  [
					'type' => ['string', 'null'],
					'enum' => Dashicons::ALLOWED_VALUES,
					'example' => 'admin-multisite',
					'nullable' => true,
				],
				'description' => [
					'type' => ['string', 'null'],
					'example' => 'lorem ipsum',
					'nullable' => true,
				],
				'position' => [
					'type' => 'integer',
					'example' => 1,
				],
				"sort" => [
					'type' => 'integer',
					'example' => 1,
					'readOnly' => true,
				],
			],
			'required' => [
				'pageTitle',
				'menuTitle',
				'capability',
				'menuSlug',
				'position',
			]
		];
	}
}
