<?php

namespace ACPT_Lite\Core\JSON;

class MetaFieldOptionSchema extends AbstractJSONSchema
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
                'label' => [
                    'type' => 'string',
                    "example" => "option label",
                ],
                'value' => [
                    'type' => ["integer", "string"],
	                "example" => "option value",
                ],
                "sort" => [
                    'type' => 'integer',
                    'example' => 1,
                    'readOnly' => true,
                ],
	            'isDefault' => [
		            'type' => 'boolean',
	            ],
            ],
            'required' => [
                'label',
                'value',
            ]
        ];
    }
}
