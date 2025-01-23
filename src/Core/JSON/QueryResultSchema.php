<?php

namespace ACPT_Lite\Core\JSON;

class QueryResultSchema extends AbstractJSONSchema
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'properties' => [
                'id' => [
                    'type' => 'integer',
                    'example' => 1
                ]
            ],
        ];
    }
}