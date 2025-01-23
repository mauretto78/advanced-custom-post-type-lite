<?php

namespace ACPT_Lite\Core\JSON;

class MetaBoxSchema extends AbstractJSONSchema
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
                'fields' => [
	                'type' => 'array',
	                'items' => (new MetaFieldSchema())->toArray(),
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
