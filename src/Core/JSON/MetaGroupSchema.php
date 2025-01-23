<?php

namespace ACPT_Lite\Core\JSON;

class MetaGroupSchema extends AbstractJSONSchema
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
				'name' => [
					'type' => 'string',
				],
				'label' => [
					'type' => 'string',
				],
				'belongs' => [
					'type' => 'array',
					'items' => (new BelongSchema())->toArray(),
				],
				'boxes' => [
					'type' => 'array',
					'items' => (new MetaBoxSchema())->toArray(),
				],
				"sort" => [
					'type' => 'integer',
					'example' => 1,
					'readOnly' => true,
				],
			],
			'required' => [
				'name',
			]
		];
	}
}