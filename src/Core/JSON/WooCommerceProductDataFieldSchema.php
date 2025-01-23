<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;

class WooCommerceProductDataFieldSchema extends AbstractJSONSchema
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
                'productData' => [
                    'type' => 'string',
                    'format' => 'uuid',
                    'readOnly' => true,
                ],
                'db_name' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'ui_name' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'name' => [
                    'type' => 'string',
                ],
                'type' => [
                    'type' => 'string',
                    'enum' => [
                        WooCommerceProductDataFieldModel::CHECKBOX_TYPE,
                        WooCommerceProductDataFieldModel::RADIO_TYPE,
                        WooCommerceProductDataFieldModel::SELECT_TYPE,
                        WooCommerceProductDataFieldModel::TEXT_TYPE,
                        WooCommerceProductDataFieldModel::TEXTAREA_TYPE,
                    ],
                    'example' => WooCommerceProductDataFieldModel::TEXT_TYPE
                ],
                'defaultValue' => [
                    'type' => [
                            'string',
                            'null',
                    ],
                ],
                'description' => [
                    'type' => [
                            'string',
                            'null',
                    ],
                ],
                'isRequired' => [
                    'type' => 'boolean',
                ],
                'sort' => [
                    'type' => 'integer',
                    'example' => 1,
                    'readOnly' => true,
                ],
                'options' => [
                    'type' => 'array',
                    'items' => (new WooCommerceProductDataFieldOptionSchema())->toArray(),
                    'default'=> [],
                ]
            ],
            'required' => [
                'name',
                'type',
                'defaultValue',
                'description',
                'isRequired',
            ],
        ];
    }
}