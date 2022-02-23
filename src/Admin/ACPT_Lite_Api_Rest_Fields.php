<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Includes\ACPT_Lite_DB;

class ACPT_Lite_Api_Rest_Fields
{
    /**
     * Register `acpt` field for every registered Custom Post Type API Rest resource
     */
    public function registerRestFields()
    {
        // loop acpt cpt and register only cpt with rest api enabled
        $posts = ACPT_Lite_DB::get([], true);

        foreach ($posts as $post){
            if($post->isNative() or ( $post->getSettings()['show_in_rest'] === true  )  ){
                $this->registerRestField($post->getName(), 'acpt', [
                    'get_callback' => [$this, 'getCallback'],
                    'update_callback' => [$this, 'updateCallback'],
                    'schema' => [
                        'type' => 'object',
                        'arg_options' => [
                            'sanitize_callback' => [$this, 'sanitizeCallback'],
                            'validate_callback' => [$this, 'validateCallback'],
                        ],
                    ],
                ]);
            }
        }
    }

    /**
     * Please see:
     * https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/
     *
     * @param $route
     * @param $field
     * @param $callback
     */
    private function registerRestField($route, $field, $callback)
    {
        register_rest_field($route, $field, $callback);
    }

    /**
     * @param $object
     *
     * @return array
     * @throws \Exception
     */
    public function getCallback($object)
    {
        $pid = $object['id'];
        $postType = $object['type'];

        $meta = [
            'meta_boxes' => [],
        ];

        $metaBoxes = ACPT_Lite_DB::getMeta($postType);

        foreach ($metaBoxes as $metaBox){

            $metaFields = [];

            foreach ($metaBox->getFields() as $field){

                $options = [];

                foreach ($field->getOptions() as $option){
                    $options[] = [
                        'label' => $option->getLabel(),
                        'value' => $option->getValue(),
                    ];
                }

                $metaFields[] = [
                    "name" => $field->getName(),
                    "type" => $field->getType(),
                    "options" => $options,
                    "value" => get_post_meta($pid, $field->getDbName(), true),
                    "default" => $field->getDefaultValue(),
                    "required" => $field->isRequired() === '1',
                    "showInAdmin" => $field->isShowInArchive() === '1',
                ];
            }

            $meta['meta_boxes'][] = [
                "meta_box" => $metaBox->getName(),
                "meta_fields" => $metaFields,
            ];
        }

        if( $postType === 'product' and class_exists( 'woocommerce' )  ){
            $meta['wc_product_data'] = [];
            $productData = ACPT_Lite_DB::getWooCommerceProductData();

            foreach ($productData as $productDatum) {

                $productDataFields = [];

                foreach ($productDatum->getFields() as $field){

                    $options = [];

                    foreach ($field->getOptions() as $option){
                        $options[] = [
                                'label' => $option->getLabel(),
                                'value' => $option->getValue(),
                        ];
                    }

                    $productDataFields[] = [
                        'name' => $field->getName(),
                        'type' => $field->getType(),
                        "options" => $options,
                        'value' => get_post_meta($pid, $field->getDbName(), true),
                        'default' => $field->getDefaultValue(),
                        'required' => $field->isRequired() === '1',
                    ];
                }

                $meta['wc_product_data'][] = [
                    'name' => $productDatum->getName(),
                    'icon' => $productDatum->getIcon(),
                    'visibility' => $productDatum->getVisibility(),
                    'fields' => $productDataFields,
                ];
            }
        }

        return $meta;
    }

    /**
     * @param $value
     * @param $object
     */
    public function updateCallback($value, $object)
    {
        var_dump($value);
        die();
    }

    /**
     * @param $value
     *
     * @return mixed
     */
    public function sanitizeCallback($value)
    {
        return $value;
    }

    /**
     * @param $value
     *
     * @return bool
     */
    public function validateCallback($value)
    {
        return true;
    }
}