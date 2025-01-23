<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Constants\Dashicons;

class CustomPostTypeSchema extends AbstractJSONSchema
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
                'post_name' => [ // in put NO
                    'type' => 'string',
                    'maxLength' => 20,
                    'example' => 'movie',
                ],
                'singular_label' => [
                    'type' => 'string',
                    'example' => 'Movie',
                ],
                'plural_label' => [
                    'type' => 'string',
                    'example' => 'Movies',
                ],
                'icon' =>  [
                    'type' => 'string',
                    'enum' => Dashicons::ALLOWED_VALUES,
                    'example' => 'admin-multisite',
                ],
                'isNative' => [
                    'type' => 'boolean',
                    'readOnly' => true,
                ],
                'postCount' => [
                    'type' => 'integer',
                    'readOnly' => true,
                ],
                'supports' => [
                    'type' => 'array',
                    'example' => [
                        'title',
                        'editor',
                        'thumbnail',
                    ],
                    'items' => [
                        'type' => 'string',
                        'enum' => [
                            'title',
                            'editor',
                            'thumbnail',
                            'excerpt',
                            'author',
                            'trackbacks',
                            'custom-fields',
                            'comments',
                            'revisions',
                            'page-attributes',
                            'post-formats',
                        ]
                    ]
                ],
                'labels' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'properties' => [
                        "menu_name" => [
                            'type' => 'string',
                            'example' => 'Movie',
                        ],
                        "all_items" => [
                             'type' => 'string'
                        ],
                        "add_new" => [
                             'type' => 'string'
                        ],
                        "add_new_item" => [
                             'type' => 'string'
                        ],
                        "edit_item" => [
                             'type' => 'string'
                        ],
                        "new_item" => [
                             'type' => 'string'
                        ],
                        "view_item" => [
                             'type' => 'string'
                        ],
                        "view_items" => [
                             'type' => 'string'
                        ],
                        "search_item" => [
                             'type' => 'string'
                        ],
                        "not_found" => [
                             'type' => 'string'
                        ],
                        "not_found_in_trash" => [
                             'type' => 'string'
                        ],
                        "parent_item_colon" => [
                             'type' => 'string'
                        ],
                        "featured_image" => [
                             'type' => 'string'
                        ],
                        "set_featured_image" => [
                             'type' => 'string'
                        ],
                        "remove_featured_image" => [
                             'type' => 'string'
                        ],
                        "use_featured_image" => [
                             'type' => 'string'
                        ],
                        "archives" => [
                             'type' => 'string'
                        ],
                        "insert_into_item" => [
                             'type' => 'string'
                        ],
                        "uploaded_to_this_item" => [
                             'type' => 'string'
                        ],
                        "filter_items_list" => [
                             'type' => 'string'
                        ],
                        "items_list_navigation" => [
                             'type' => 'string'
                        ],
                        "items_list" => [
                             'type' => 'string'
                        ],
                        "filter_by_date" => [
                             'type' => 'string'
                        ],
                        "item_published" => [
                             'type' => 'string'
                        ],
                        "item_published_privately" => [
                             'type' => 'string'
                        ],
                        "item_reverted_to_draft" => [
                             'type' => 'string'
                        ],
                        "item_scheduled" => [
                             'type' => 'string'
                        ],
                        "item_updated" => [
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
                        "show_ui" => [
                             'type' => 'boolean'
                        ],
                        "show_in_menu" => [
                             'type' => 'boolean'
                        ],
                        "show_in_nav_menus" => [
                             'type' => 'boolean'
                        ],
                        "show_in_admin_bar" => [
                             'type' => 'boolean'
                        ],
                        "show_in_rest" => [
                             'type' => 'boolean'
                        ],
                        "rest_base" => [
                             'type' => 'string'
                        ],
                        "menu_position" => [
                             'type' => 'string'
                        ],
                        "capability_type" => [
                             'type' => 'string'
                        ],
                        "has_archive" => [
                             'type' => 'boolean'
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
                        ]
                    ],
                ],
                "taxonomies" => [
                    'type' => 'array',
                    'readOnly' => true,
                ],
                "templates" => [
                    'type' => 'array',
                    'readOnly' => true,
                ],
                "existsArchivePageInTheme" =>  [
                    'type' => 'boolean',
                    'readOnly' => true,
                ],
                "existsSinglePageInTheme" => [
                    'type' => 'boolean',
                    'readOnly' => true,
                ],
                "isWooCommerce"=> [
                        'type' => 'boolean',
                        'readOnly' => true,
                ],
                "woocommerceProductData" => [
                    'type' => 'array',
                    'readOnly' => true,
                ],
            ],
            'required' => [
                'post_name',
                'singular_label',
                'plural_label',
                'icon',
                'supports',
                'labels',
                'settings',
            ]
        ];
    }
}

