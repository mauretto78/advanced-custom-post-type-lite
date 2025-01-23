<?php

namespace ACPT_Lite\Core\JSON;

class MetaFieldAdvancedOptionSchema extends AbstractJSONSchema
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
                'key' => [
                    'type' => 'string',
                ],
                'value' => [
                    'type' => "string",
                ],
            ],
            'required' => [
                'key',
                'value',
            ]
        ];
    }
}
