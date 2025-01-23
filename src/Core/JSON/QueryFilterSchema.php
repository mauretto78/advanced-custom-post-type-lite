<?php

namespace ACPT_Lite\Core\JSON;

class QueryFilterSchema extends AbstractJSONSchema
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
                'params' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        'author' => [
                            'type' => 'integer'
                        ],
                        'author_name' => [
                                'type' => 'string'
                        ],
                        'author__in' => [
                                'type' => 'array'
                        ],
                        'author__not_in' => [
                                'type' => 'array'
                        ],
                        'cat' => [
                                'type' => 'integer'
                        ],
                        'category_name' => [
                                'type' => 'string'
                        ],
                        'category__and' => [
                                'type' => 'array'
                        ],
                        'category__in' => [
                                'type' => 'array'
                        ],
                        'category__not_in' => [
                                'type' => 'array'
                        ],
                        'tag_id' => [
                                'type' => 'integer'
                        ],
                        'tag' => [
                                'type' => 'string'
                        ],
                        'tag__and' => [
                                'type' => 'array'
                        ],
                        'tag__in' => [
                                'type' => 'array'
                        ],
                        'tag__not_in' => [
                                'type' => 'array'
                        ],
                        'tag_slug__and' => [
                                'type' => 'array'
                        ],
                        'tag_slug__in' => [
                                'type' => 'array'
                        ],
                        's' => [
                                'type' => 'string'
                        ],
                        'p' => [
                                'type' => 'integer'
                        ],
                        'name' => [
                                'type' => 'string'
                        ],
                        'page_id' => [
                                'type' => 'integer'
                        ],
                        'pagename' => [
                                'type' => 'string'
                        ],
                        'post_parent' => [
                                'type' => 'integer'
                        ],
                        'post_parent__in' => [
                                'type' => 'array'
                        ],
                        'post_parent__not_in' => [
                                'type' => 'array'
                        ],
                        'post__in' => [
                                'type' => 'array'
                        ],
                        'post__not_in' => [
                                'type' => 'array'
                        ],
                        'post_name__in' => [
                                'type' => 'array'
                        ],
                        'has_password' => [
                                'type' => 'boolean'
                        ],
                        'post_password' => [
                                'type' => 'string'
                        ],
                        'post_status' => [
                            'oneOf' => [
                                ['type' => 'string'],
                                [
                                    'type' => 'array',
                                    'enum' => [
                                        'publish',
                                        'pending',
                                        'draft',
                                        'auto-draft',
                                        'future',
                                        'private',
                                        'inherit',
                                        'trash',
                                        'any',
                                    ],
                                ],
                            ]
                        ],
                        'tax_query' => [
                            'type' => 'object',
                            'additionalProperties' => false,
                            'properties' => [
                                'relation' => [
                                    'type' => 'string'
                                ],
                                'taxonomy' => [
                                    'type' => 'string'
                                ],
                                'field' => [
                                    'type' => 'string',
                                    'enum' => [
                                        'term_id',
                                        'name',
                                        'slug',
                                        'auto-term_taxonomy_id',
                                    ],
                                ],
                                'terms' => [
                                    'oneOf' => [
                                        ['type' => 'integer'],
                                        ['type' => 'string'],
                                        ['type' => 'array'],
                                    ]
                                ],
                                'include_children' => [
                                    'type' => 'boolean'
                                ],
                                'operator' => [
                                    'type' => 'string',
                                    'enum' => [
                                        'IN',
                                        'NOT IN',
                                        'EXISTS',
                                        'NOT EXISTS',
                                    ],
                                    'default' => 'IN'
                                ],
                            ]
                        ],
                    ]
                ],
                'date_query' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                                'year' => [
                                        'type' => 'integer',
                                        'default' => 2011
                                ],
                                'month' => [
                                        'type' => 'integer',
                                        'default' => 11
                                ],
                                'week' => [
                                        'type' => 'integer',
                                        'default' => 15
                                ],
                                'day' => [
                                        'type' => 'integer',
                                        'default' =>  1
                                ],
                                'hour' => [
                                        'type' => 'integer',
                                        'default' =>  11
                                ],
                                'minute' => [
                                        'type' => 'integer',
                                        'default' =>  30
                                ],
                                'second' => [
                                        'type' => 'integer',
                                        'default' =>  59
                                ],
                                'after' => [
                                    'oneOf' => [
                                        ['type' => 'string'],
                                        [
                                            'type' => 'object',
                                            'additionalProperties' => false,
                                            'properties' => [
                                                    'year' => [
                                                            'type' => 'integer',
                                                            'default' => 2011
                                                    ],
                                                    'month' => [
                                                            'type' => 'integer',
                                                            'default' => 11
                                                    ],
                                                    'week' => [
                                                            'type' => 'integer',
                                                            'default' => 15
                                                    ],
                                                    'day' => [
                                                            'type' => 'integer',
                                                            'default' =>  1
                                                    ],
                                            ],
                                        ],
                                    ]
                                ],
                                'before' => [
                                        'oneOf' => [
                                                ['type' => 'string'],
                                                [
                                                        'type' => 'object',
                                                        'additionalProperties' => false,
                                                        'properties' => [
                                                                'year' => [
                                                                        'type' => 'integer',
                                                                        'default' => 2011
                                                                ],
                                                                'month' => [
                                                                        'type' => 'integer',
                                                                        'default' => 11
                                                                ],
                                                                'week' => [
                                                                        'type' => 'integer',
                                                                        'default' => 15
                                                                ],
                                                                'day' => [
                                                                        'type' => 'integer',
                                                                        'default' =>  1
                                                                ],
                                                        ],
                                                ],
                                        ]
                                ],
                                'inclusive' => [
                                        'type' => 'boolean',
                                ],
                                'compare' => [
                                        'type' => 'string'
                                ],
                                'column' => [
                                        'type' => 'string',
                                        'default' => 'post_date',
                                ],
                                'relation' => [
                                        'type' => 'string',
                                        'enum' => [
                                                'AND',
                                                'OR',
                                        ],
                                        'default' => 'AND',
                                ],
                        ],
                ],
                'meta_query' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        'relation' => [
                            'type' => 'string',
                            'enum' => [
                                    'AND',
                                    'OR',
                            ],
                            'default' => 'AND',
                        ],
                        'elements' => [
                            'type' => 'array',
                            'items' => [
                                    'type' => 'object',
                                    'additionalProperties' => false,
                                    'properties' => [
                                            'type' => [
                                                    'type' => 'string',
                                                    'enum' => [
                                                            'NUMERIC',
                                                            'BINARY',
                                                            'CHAR',
                                                            'DATE',
                                                            'DATETIME',
                                                            'DECIMAL',
                                                            'SIGNED',
                                                            'TIME',
                                                            'UNSIGNED'
                                                    ],
                                                    'default' => 'data',
                                            ],
                                            'key' => [
                                                    'oneOf' => [
                                                            ['type' => 'string'],
                                                            ['type' => 'array'],
                                                    ]
                                            ],
                                            'value' => [
                                                    'type' => 'string',
                                            ],
                                            'value_num' => [
                                                    'type' => 'integer',
                                            ],
                                            'compare' => [
                                                    'type' => 'string',
                                                    'enum' => [
                                                            '=',
                                                            '!=',
                                                            '>',
                                                            '>=',
                                                            '<',
                                                            '<=',
                                                            'LIKE',
                                                            'NOT LIKE',
                                                            'IN',
                                                            'NOT IN',
                                                            'BETWEEN',
                                                            'NOT BETWEEN',
                                                            'NOT EXISTS',
                                                            'REGEXP',
                                                            'NOT REGEXP',
                                                            'RLIKE'
                                                    ],
                                                    'default' => '=',
                                            ],
                                    ],
                                    'required' => [
                                            'key',
                                            'value',
                                    ]
                            ],
                        ]
                    ]
                ],
                'order' => [
                    'type' => 'string',
                    'enum' => [
                        'ASC',
                        'DESC',
                    ],
                    'default' => 'ASC',
                ],
                'orderBy' => [
                    'oneOf' => [
                        ['type' => 'string'],
                        ['type' => 'array'],
                    ]
                ],
            ],
            'required' => []
        ];
    }

    /**
     * @inheritDoc
     */
    function tdsadsaoArray()
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'properties' => [
                'params' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'properties' => [
                                'author' => [
                                        'type' => 'integer'
                                ],
                        ]
                ]
            ],
        ];
    }
}