<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\Assert;

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
        var_dump("updateCallback");
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
        var_dump("sanitizeCallback");
        var_dump($value);
        die();
    }

    /**
     * @param $meta
     *
     * @return bool
     */
    public function validateCallback($meta)
    {
        if(!is_array($meta)){
            return false;
        }

        if(empty($meta)){
            return false;
        }

        // meta_boxes
        if(!isset($meta['meta_boxes'])){
            return false;
        }

        try {
            Assert::isArray($meta['meta_boxes']);
        } catch (\Exception $exception){
            return false;
        }

        foreach ($meta['meta_boxes'] as $box){
            if(!$this->validateMetaBox($box)){
                return false;
            }
        }

        // wc_product_data
        $requestUri = explode("/", $_SERVER['REQUEST_URI']);

        if( $requestUri[4] === 'product' and class_exists( 'woocommerce' )  ){
            if(!isset($meta['wc_product_data'])){
                return false;
            }

            try {
                Assert::isArray($meta['wc_product_data']);
            } catch (\Exception $exception){
                return false;
            }

            foreach ($meta['wc_product_data'] as $data){
                if(!$this->validateWcProductData($data)){
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * @param $box
     * @return bool
     */
    private function validateMetaBox($box)
    {
        if(!isset($box['meta_box']) and !isset($box['meta_fields'])){
            return false;
        }

        try {
            Assert::string($box['meta_box']);
            Assert::isArray($box['meta_fields']);
        } catch (\Exception $exception){
            return false;
        }

        foreach ($box['meta_fields'] as $field){
            if(
                !isset($field['name']) and
                !isset($field['type']) and
                !isset($field['options']) and
                !isset($field['value']) and
                !isset($field['default']) and
                !isset($field['required'])
            ){
                return false;
            }

            try {
                Assert::string($field['name']);
                Assert::inArray($field['type'], [
                    MetaBoxFieldModel::DATE_TYPE,
                    MetaBoxFieldModel::EMAIL_TYPE,
                    MetaBoxFieldModel::NUMBER_TYPE,
                    MetaBoxFieldModel::POST_TYPE,
                    MetaBoxFieldModel::SELECT_TYPE,
                    MetaBoxFieldModel::TEXT_TYPE
                ]);
                Assert::isArray($field['options']);
                Assert::boolean($field['required']);

                if(!empty($field['value'])){
                    Assert::string($field['value']);
                }

                if(!empty($field['default'])){
                    Assert::string($field['default']);
                }

            } catch (\Exception $exception){
                return false;
            }

            foreach ($box['options'] as $option){
                if(
                    !isset($option['label']) and
                    !isset($option['value'])
                ){
                    return false;
                }

                try {
                    Assert::string($option['label']);
                    Assert::string($option['value']);
                } catch (\Exception $exception){
                    return false;
                }
            }
        }

        return true;
    }

    private function validateWcProductData($data)
    {
        if(
            !isset($data['name']) and
            !isset($data['icon']) and
            !isset($data['visibility']) and
            !isset($data['fields'])
        ){
            return false;
        }

        try {
            Assert::string($data['name']);
            Assert::isArray($data['icon']);
            Assert::isArray($data['visibility']);
            Assert::isArray($data['fields']);
        } catch (\Exception $exception){
            return false;
        }



        return true;
    }
}