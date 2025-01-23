<?php

namespace ACPT_Lite\Core\JSON;

class MetaFieldvisibilityConditionSchema extends AbstractJSONSchema
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
                'type' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        'type' => [
                            'type' => 'string',
                            'enum' => [
                                'VALUE',
                                'POST_ID',
                                'TAXONOMY',
                                'OTHER_FIELDS',
                            ],
                            'example' => 'VALUE',
                        ],
                        'value' => [
                            'type' => 'string',
                            'example' => 'foo',
                        ],
                    ]
                ],
                'operator' => [
                    'type' => 'string',
                    'enum' => [
                        '=',
                        '!=',
                        '<',
                        '>',
                        '<=',
                        '>=',
                        'LIKE',
                        'NOT_LIKE',
                        'IN',
                        'NOT_IN',
                        'NULL',
                        'NOT_NULL',
                        'BLANK',
                        'NOT_BLANK',
                    ],
                    'example' => '=',
                ],
                'value' => [
                    'type' => ["integer", "string"],
                    'example' => 'foo',
                ],
                'logic' => [
                    'type' => 'string',
                    'enum' => [
                        'AND',
                        'OR',
                        '',
                    ],
                    'example' => 'AND',
                ],
                "sort" => [
                    'type' => 'integer',
                    'example' => 1,
                    'readOnly' => true,
                ],
            ],
            'required' => [
                'type',
                'operator',
            ]
        ];
    }
}
