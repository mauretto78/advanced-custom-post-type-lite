<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Constants\Relationships;

class MetaFieldRelationSchema extends AbstractJSONSchema
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
                    'type' => 'string',
                    'enum' => [
                        Relationships::ONE_TO_ONE_UNI,
                        Relationships::ONE_TO_ONE_BI,
                        Relationships::ONE_TO_MANY_UNI,
                        Relationships::ONE_TO_MANY_BI,
                        Relationships::MANY_TO_ONE_UNI,
                        Relationships::MANY_TO_ONE_BI,
                        Relationships::MANY_TO_MANY_UNI,
                        Relationships::MANY_TO_MANY_BI,
                    ],
                ],
                'relatedPostType' => [
                    'type' => 'string',
                ],
                'inversedBoxId' => [
                    'type' => 'string',
                    'format' => 'uuid',
                    'readOnly' => true,
                ],
                'inversedBoxName' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'inversedFieldName' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'inversedFieldId' => [
                    'type' => 'string',
                    'format' => 'uuid',
                ],
            ],
            'required' => [
                'type',
                'relatedPostType',
                'inversedFieldId',
            ]
        ];
    }
}
