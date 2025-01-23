<?php

namespace ACPT_Lite\Core\JSON;

class FormMetadataSchema extends AbstractJSONSchema
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
				'formId' => [
					'type' => 'string',
					'format' => 'uuid',
				],
				'key' => [
					'type' => 'string',
				],
				'value' => [
					'type' => 'string',
				],
			],
			'required' => [
				'key',
				'value',
			]
		];
	}
}
