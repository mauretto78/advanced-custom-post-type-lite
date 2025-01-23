<?php

namespace ACPT_Lite\Core\JSON;

class MetaFieldBlockSchema extends AbstractJSONSchema
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
				'boxId' => [
					'type' => 'string',
					'format' => 'uuid',
					'readOnly' => true,
				],
				'fieldId' => [
					'type' => 'string',
					'format' => 'uuid',
					'readOnly' => true,
				],
				"name" => [
					'type' => 'string',
					'example' => 'block',
				],
				"label" => [
					'type' => ['string', 'null'],
					'example' => 'Block label',
					'nullable' => true,
				],
				"sort" => [
					'type' => 'integer',
					'example' => 1,
					'readOnly' => true,
				],
				"fields" => [
					'type' => 'array',
					'items' => (new MetaFieldSchema(false, false))->toArray(),
				]
			],
			'required' => [
				'name',
				'fields',
			],
		];
	}
}
