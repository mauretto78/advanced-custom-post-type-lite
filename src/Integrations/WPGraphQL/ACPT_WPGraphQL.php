<?php

namespace ACPT_Lite\Integrations\WPGraphQL;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Utils\Data\Meta;

class ACPT_WPGraphQL extends AbstractIntegration
{
    /**
     * @inheritDoc
     */
    protected function isActive()
    {
        return is_plugin_active( 'wp-graphql/wp-graphql.php' );
    }

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
    protected function runIntegration()
    {
        $postTypes = CustomPostTypeRepository::get([]);

        /** @var CustomPostTypeModel $postType */
        foreach ($postTypes as $postType){

            $this->saveSettingsForNativePosts($postType);
            $settings = $postType->getSettings();

            if(isset($settings['show_in_graphql']) and $settings['show_in_graphql'] === true){

                $singleName = $settings["graphql_single_name"];
                $pluralName = $settings["graphql_plural_name"];

                add_action( 'graphql_register_types', function() use ($singleName, $pluralName, $postType) {

                    register_graphql_field('RootQueryTo'.ucfirst($singleName).'ConnectionWhereArgs',
            'query', [
                            'type' => 'AcptQuery',
                            'description' => __('The meta query object to filter by', ACPT_LITE_PLUGIN_NAME),
                        ]
                    );

                    $this->registerAcptTypes();
                    register_graphql_field( $singleName, 'acpt', $this->acptFieldSettings($postType));
                    register_graphql_field( $pluralName, 'acpt', $this->acptFieldSettings($postType));
                });

                add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $args, $context, $info) {

                    $query = $args['where']['query'];

                    if (isset($query)) {
                        $query_args['meta_query'] = $query;
                    }

                    return $query_args;
                }, 10, 5);
            }
        }
    }

    /**
     * @param CustomPostTypeModel $postType
     *
     * @throws \Exception
     */
    private function saveSettingsForNativePosts(CustomPostTypeModel $postType)
    {
        if($postType->isNative() and !isset($settings['show_in_graphql'])){

            $settings['show_in_graphql'] = true;
            $settings['graphql_single_name'] = strtolower($postType->getSingular());
            $settings['graphql_plural_name'] = strtolower($postType->getPlural());
            $postType->modifySettings($settings);

            CustomPostTypeRepository::save($postType);
        }
    }

    /**
     * Register ACPT types and subtypes
     */
    private function registerAcptTypes()
    {
        // acpt
        register_graphql_object_type( 'Acpt', [
            'description' => __( "ACPT meta data", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'meta' => [
                    'type' => [ 'list_of' => 'AcptMetaBox' ],
                    'description' => __( 'List of all meta', ACPT_LITE_PLUGIN_NAME ),
                ],
                'product_data' => [
                    'type' => [ 'list_of' => 'WooCommerceProductData' ],
                    'description' => __( 'List of all product data (only for WooCommerce product post type)', ACPT_LITE_PLUGIN_NAME ),
                ],
            ],
        ] );

        // box
        register_graphql_object_type( 'AcptMetaBox', [
            'description' => __( "ACPT meta box", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'meta_box' => [
                    'type' => 'String',
                    'description' => __( 'The name of the meta box', ACPT_LITE_PLUGIN_NAME ),
                ],
                'meta_fields' => [
                    'type' => [ 'list_of' => 'AcptMetaField' ]
                ],
            ],
        ]);

        // field
        register_graphql_object_type( 'AcptMetaField', [
            'description' => __( "ACPT meta field", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'name' => [
                    'type' => 'String',
                    'description' => __( 'The name of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
                'type' => [
                    'type' => 'String',
                    'description' => __( 'The type of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
                'values' => [
                    'type' => [ 'list_of' => 'String' ],
                    'description' => __( 'The value of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
            ],
        ]);

        register_graphql_object_type( 'WooCommerceProductData', [
            'description' => __( "WooCommerce product data", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'name' => [
                    'type' => 'String',
                    'description' => __( 'The name of the meta box', ACPT_LITE_PLUGIN_NAME ),
                ],
                'fields' => [
                    'type' => [ 'list_of' => 'WooCommerceProductDataField' ]
                ],
            ],
        ]);

        register_graphql_object_type( 'WooCommerceProductDataField', [
            'description' => __( "WooCommerce product data field", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'name' => [
                    'type' => 'String',
                    'description' => __( 'The name of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
                'type' => [
                    'type' => 'String',
                    'description' => __( 'The type of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
                'values' => [
                    'type' => [ 'list_of' => 'String' ],
                    'description' => __( 'The value of the meta field', ACPT_LITE_PLUGIN_NAME ),
                ],
            ],
        ]);

        // @TODO enums?
        // https://github.com/wp-graphql/wp-graphql-meta-query/blob/develop/wp-graphql-meta-query.php

        // query object
        register_graphql_input_type( 'AcptQuery', [
            'description' => __( "Query object", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'meta_query' => [
                    'type' => 'AcptMetaQuery',
                    'description' => __( 'Meta query', ACPT_LITE_PLUGIN_NAME ),
                ],
            ]
        ]);

        // meta_query
        register_graphql_input_type( 'AcptMetaQuery', [
            'description' => __( "Meta query object", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'relation' => [
                    'type' => 'String',
                    'description' => __( 'Meta query relation', ACPT_LITE_PLUGIN_NAME ),
                ],
                'elements' => [
                    'type' => [ 'list_of' => 'AcptMetaQueryElement' ],
                    'description' => __( 'Meta query element object', ACPT_LITE_PLUGIN_NAME ),
                ],
            ],
        ]);

        // meta_query element
        register_graphql_input_type( 'AcptMetaQueryElement', [
            'description' => __( "Meta query element object", ACPT_LITE_PLUGIN_NAME ),
            'fields' => [
                'type' => [
                    'type' => 'String',
                    'description' => __( 'Meta query element type', ACPT_LITE_PLUGIN_NAME ),
                ],
                'key' => [
                    'type' => 'String',
                    'description' => __( 'Meta query element key', ACPT_LITE_PLUGIN_NAME ),
                ],
                'value' => [
                    'type' => 'String',
                    'description' => __( 'Meta query element value', ACPT_LITE_PLUGIN_NAME ),
                ],
                'value_num'  => [
                    'type' => 'Integer',
                    'description' => __( 'Meta query element value (numeric)', ACPT_LITE_PLUGIN_NAME ),
                ],
                'compare' => [
                    'type' => 'String',
                    'description' => __( 'Meta query element compare operator', ACPT_LITE_PLUGIN_NAME ),
                ],
            ],
        ]);
    }

    /**
     * ACPT field settings
     *
     * @param CustomPostTypeModel $postType
     * @see https://www.wpgraphql.com/2020/03/11/registering-graphql-fields-with-arguments
     *
     * @return array
     */
    private function acptFieldSettings( CustomPostTypeModel $postType)
    {
        return [
            'type' => 'Acpt',
            'resolve' => function( $post, $args, $context, $info ) use ($postType) {

                $postId = (int)$post->databaseId;

                $meta = [];
                $meta['meta'] = [];
                $meta['product_data'] = [];

                $metaGroups = MetaRepository::get([
	                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
	                'find' => $postType,
                ]);

                foreach ($metaGroups as $group){
	                foreach ($group->getBoxes() as $metaBox){

		                $metaBoxArray = [];
		                $metaBoxArray['meta_box'] = $metaBox->getName();
		                $metaBoxArray['meta_fields'] = [];

		                foreach ($metaBox->getFields() as $field){

			                $listTypes = [
				                MetaFieldModel::GALLERY_TYPE,
				                MetaFieldModel::LIST_TYPE,
				                MetaFieldModel::SELECT_MULTI_TYPE,
			                ];
			                $key = Strings::toDBFormat($metaBox->getName()) . '_' . Strings::toDBFormat($field->getName());
			                $values = (in_array($field->getType(), $listTypes)) ? Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, $key, true) : [Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, $key, true)];

			                $metaBoxArray['meta_fields'][] = [
				                'name' => $field->getName(),
				                'type' => $field->getType(),
				                'values' => (!empty($values)) ? $values : [],
			                ];
		                }

		                $meta['meta'][] = $metaBoxArray;
	                }
                }

                // WooCommerce
                if($postType->isWooCommerce()){

                    /** @var WooCommerceProductDataModel $productDatum */
                    foreach ($postType->getWoocommerceProductData() as $productDatum){

                        $productDatumArray = [];
                        $productDatumArray['name'] = $productDatum->getName();
                        $productDatumArray['fields'] = [];

                        /** @var WooCommerceProductDataFieldModel $field */
                        foreach ($productDatum->getFields() as $field){

                            $listTypes = [
                                WooCommerceProductDataFieldModel::SELECT_TYPE,
                                WooCommerceProductDataFieldModel::RADIO_TYPE,
                            ];

                            $key = $field->getDbName();
                            $values = (in_array($field->getType(), $listTypes)) ? Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, $key, true) : [Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, $key, true)];

                            $productDatumArray['fields'][] = [
                                    'name' => $field->getName(),
                                    'type' => $field->getType(),
                                    'values' => (!empty($values)) ? $values : [],
                            ];
                        }

                        $meta['product_data'][] = $productDatumArray;
                    }
                }

                return $meta;
            },
        ];
    }
}