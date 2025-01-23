<?php

namespace ACPT_Lite\Core\JSON;

class TaxonomySchema extends AbstractJSONSchema
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
                'slug' => [ // in put NO
                    'type' => 'string',
                    'maxLength' => 32,
                    'example' => 'year',
                ],
                'singular' => [
                    'type' => 'string',
                    'example' => 'Year',
                ],
                'plural' => [
                    'type' => 'string',
                    'example' => 'Years',
                ],
                'labels' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        "name" => [
                            'type' => 'string',
                            'example' => 'Year',
                        ],
                        "singular_name" => [
                             'type' => 'string'
                        ],
                        "search_items" => [
                             'type' => 'string'
                        ],
                        "popular_items" => [
                             'type' => 'string'
                        ],
                        "all_items" => [
                             'type' => 'string'
                        ],
                        "parent_item" => [
                             'type' => 'string'
                        ],
                        "parent_item_colon" => [
                             'type' => 'string'
                        ],
                        "edit_item" => [
                             'type' => 'string'
                        ],
                        "view_item" => [
                             'type' => 'string'
                        ],
                        "update_item" => [
                             'type' => 'string'
                        ],
                        "add_new_item" => [
                             'type' => 'string'
                        ],
                        "new_item_name" => [
                             'type' => 'string'
                        ],
                        "separate_items_with_commas" => [
                             'type' => 'string'
                        ],
                        "add_or_remove_items" => [
                             'type' => 'string'
                        ],
                        "choose_from_most_used" => [
                             'type' => 'string'
                        ],
                        "not_found" => [
                             'type' => 'string'
                        ],
                        "no_terms" => [
                             'type' => 'string'
                        ],
                        "filter_by_item" => [
                             'type' => 'string'
                        ],
                        "items_list_navigation" => [
                             'type' => 'string'
                        ],
                        "items_list" => [
                             'type' => 'string'
                        ],
                        "most_used" => [
                             'type' => 'string'
                        ],
                        "back_to_items" => [
                             'type' => 'string'
                        ],
                    ]
                ],
                'settings' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        "public" => [
                            'type' => 'boolean'
                        ],
                        "publicly_queryable" => [
                            'type' => 'string'
                        ],
                        "hierarchical" => [
                            'type' => 'boolean'
                        ],
                        "show_ui" => [
                            'type' => 'boolean'
                        ],
                        "show_in_menu" => [
                            'type' => 'boolean'
                        ],
                        "show_in_nav_menus" => [
                            'type' => 'boolean'
                        ],
                        "show_in_rest" => [
                            'type' => 'boolean'
                        ],
                        "rest_base" => [
                            'type' => 'string'
                        ],
                        "rest_controller_class" => [
                            'type' => 'string'
                        ],
                        "show_tagcloud" => [
                            'type' => 'boolean'
                        ],
                        "show_in_quick_edit" => [
                            'type' => 'boolean'
                        ],
                        "show_admin_column" => [
                            'type' => 'boolean'
                        ],
                        "capabilities" => [
                            'type' => 'array',
                            'example' => [
                                "manage_terms",
                                "edit_terms",
                                "delete_terms",
                                "assign_terms"
                            ],
                            'items' => [
                                'type' => 'string',
                                'enum' => [
                                    "manage_terms",
                                    "edit_terms",
                                    "delete_terms",
                                    "assign_terms"
                                ],
                            ],
                        ],
                        "rewrite" => [
                            'type' => 'string'
                        ],
                        "custom_rewrite" => [
                             'type' => 'string'
                        ],
                        "query_var" => [
                             'type' => 'string'
                        ],
                        "custom_query_var" => [
                             'type' => 'string'
                        ],
                        "default_term" => [
                             'type' => 'string'
                        ],
                        "sort" => [
                             'type' => 'string'
                        ],
                    ]
                ],
                'customPostTypes' => [
                    'type' => 'array',
                    'readOnly' => true,
                    'items' => (new CustomPostTypeSchema())->toArray(),
                ],
                "templates" => [
                    'type' => 'array',
                    'readOnly' => true,
                ],
            ],
        ];
    }
}