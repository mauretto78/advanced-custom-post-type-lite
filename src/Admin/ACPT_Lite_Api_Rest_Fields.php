<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Query\QueryResultModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Utils\Assert;
use ACPT_Lite\Utils\Sanitizer;

class ACPT_Lite_Api_Rest_Fields extends ACPT_Lite_Api
{
    /**
     * Register `acpt` field for every registered Custom Post Type API Rest resource
     */
    public function registerRestFields()
    {
        // loop acpt cpt and register only cpt with rest api enabled
        $posts = CustomPostTypeRepository::get([], true);

	    foreach ($posts as $post){
		    if($post->isNative() or ( isset($post->getSettings()['show_in_rest']) and $post->getSettings()['show_in_rest'] === true  )  ){
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
	    $post = get_post((int)$object['id']);
	    $queryResultModel = new QueryResultModel($post);

	    return $queryResultModel->getMeta();
    }

    /**
     * @param $meta
     * @param $object
     *
     * @return \WP_Error
     * @throws \Exception
     */
    public function updateCallback($meta, $object)
    {
	    $postType = $object->post_type;

	    // meta
	    foreach ($meta['meta'] as $item){

		    // data
		    $box = $item['box'];
		    $field = $item['field'];
		    $value = $item['value'];

		    // check
		    if(null === $singleMeta = MetaRepository::getMetaFieldByName([
				    'boxName' => $box,
				    'fieldName' => $field,
			    ])){
			    return $this->restError("Meta field does not exists");
		    }

		    $key = Strings::toDBFormat($box) . '_' . Strings::toDBFormat($field);

		    update_post_meta($object->ID, $key.'_type' , $singleMeta->getType() );
		    update_post_meta($object->ID, $key , $value );
	    }

	    // wc_product_data
	    if( $postType === 'product' and class_exists( 'woocommerce' )  ){

		    $product = wc_get_product( $object->ID );

		    foreach ($meta['wc_product_data'] as $item){

			    // data
			    $productData = $item['product_data'];
			    $field = $item['field'];
			    $value = $item['value'];

			    // check if exists
			    if(WooCommerceProductDataRepository::getSingleField($productData, $field)){
				    return $this->restError("Product data does not exists");
			    }

			    $sluggedName = strtolower(str_replace(" ", "_", $productData));
			    $fieldSluggedName = $sluggedName . '_' . strtolower(str_replace(" ", "_", $field));

			    $product->update_meta_data('_'.$fieldSluggedName, $value );
		    }
	    }
    }

    /**
     * @param $meta
     *
     * @return mixed
     */
    public function sanitizeCallback($meta)
    {
        return Sanitizer::recursiveSanitizeRawData($meta);
    }

    /**
     * @param $meta
     *
     * @return bool|\WP_Error
     */
    public function validateCallback($meta)
    {
        if(!is_array($meta)){
            return $this->restError('`meta` key is not an array');
        }

        // meta
        if(!isset($meta['meta'])){
            return $this->restError('Missing `meta` key');
        }

        foreach ($meta['meta'] as $item){
            if(null !== $error = $this->validateMetaItem($item)){
                return $this->restError($error);
            }
        }

        // wc_product_data
        $requestUri = explode("/", $_SERVER['REQUEST_URI']);
        $identifier = $requestUri[4];

        if( $identifier === 'product' and class_exists( 'woocommerce' )  ){
            if(!isset($meta['wc_product_data'])){
                return $this->restError('Missing `wc_product_data` key');
            }

            try {
                Assert::isArray($meta['wc_product_data']);
            } catch (\Exception $exception){
                return $this->restError('`wc_product_data` key is not an array');
            }

            foreach ($meta['wc_product_data'] as $data){
                if(null !== $error = $this->validateWcProductData($data)){
                    return $this->restError($error);
                }
            }
        }

        return true;
    }

    /**
     * @param $item
     *
     * @return string|null
     */
    private function validateMetaItem($item)
    {
        if(
            !isset($item['box']) and
            !isset($item['field']) and
            !isset($item['value'])
        ){
            return 'Missing key(s): [`box`,`field`,`value`]';
        }

        try {
            Assert::string($item['box']);
            Assert::string($item['field']);
            Assert::string($item['value']);
        } catch (\Exception $exception){
            return 'Invalid data: [`box`|STRING,`field`|STRING,`value`|STRING]';
        }

        return null;
    }

    /**
     * @param $item
     *
     * @return bool
     */
    private function validateWcProductData($item)
    {
        if(
                !isset($item['product_data']) and
                !isset($item['field']) and
                !isset($item['value'])
        ){
            return 'Missing key(s): [`product_data`,`field`,`value`]';
        }

        try {
            Assert::string($item['product_data']);
            Assert::string($item['field']);
            Assert::string($item['value']);
        } catch (\Exception $exception){
            return 'Invalid data: [`product_data`|STRING,`field`|STRING,`value`|STRING]';
        }

        return null;
    }
}