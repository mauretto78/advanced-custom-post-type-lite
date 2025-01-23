<?php

namespace ACPT_Lite\Core\JSON;

class WooCommerceProductDataSchema extends AbstractJSONSchema
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
                    'type' => 'string',
                    'format' => 'uuid',
                    'readOnly' => true,
                ],
                'name' => [
                    'type' => 'string',
                    'example' => 'info',
                ],
                'sluggedName' => [
                        'type' => 'string',
                        'example' => 'info',
                        'readOnly' => true,
                ],
                'icon' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        'icon' => [
                            'type' => 'string',
                            'example' => 'ccv',
                        ],
                        'value' => [
                            'type' => 'string',
                            'example' => '\\e604',
                        ],
                    ],
                    'required' => [
                        'icon',
                        'value',
                    ],
                ],
                'visibility' => [
                    'type' => 'array',
                    'example' => [
                        'show_if_simple',
                        'show_if_variable',
                        'show_if_grouped',
                    ],
                    'items' => [
                        'type' => 'string',
                        'enum' => [
                            'show_if_simple',
                            'show_if_variable',
                            'show_if_grouped',
                            'show_if_external',
                            'hide_if_virtual',
                            'hide_if_external',
                        ]
                    ]
                ],
                'showInUI' => [
                    'type' => 'boolean',
                ],
                'content' => [
                    'type' => 'string',
                    'nullable' => true,
                    'example' => null,
                    'readOnly' => true,
                ],
                'fields' => [
                    'type' => 'array',
                    'readOnly' => true,
                    'items' => (new WooCommerceProductDataFieldSchema())->toArray(),
                ],
            ],
            'required' => [
                'name',
                'icon',
                'visibility',
                'showInUI',
            ],
        ];
    }
}