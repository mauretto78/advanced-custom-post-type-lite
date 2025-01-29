<?php

namespace ACPT_Lite\Integrations\WooCommerce\Filters;

use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController;

class WooCommerceFilters
{
    /**
     * Run all filters
     */
    public function run()
    {
        $this->modifyPostTypeName();
        $this->addWooCommerceProductDataToACPTList();
        $this->addWooCommerceCPTsToACPTList();
    }

    /**
     * Modify post type name
     */
    private function modifyPostTypeName()
    {
        add_filter( 'modify_post_type_name', function($postTypeName){
            if(
                $postTypeName === "shop_order" and
                class_exists( '\Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController' ) and
                wc_get_container()->get( CustomOrdersTableController::class )->custom_orders_table_usage_is_enabled()
            ){
                return wc_get_page_screen_id( 'shop-order' );
            }

            return $postTypeName;
        }, 10, 1 );
    }

    /**
     * Add WooCommerce product data to ACPT list
     */
    private function addWooCommerceProductDataToACPTList()
    {
        add_filter( 'add_woo_product_data_to_acpt_list', function($data){
            $productData = WooCommerceProductDataRepository::get([
                'sortedBy' => 'product_data_name',
            ]);

            foreach ($productData as $productDatum){
                $data[]  = [
                    'value' => $productDatum->getId(),
                    'label' => $productDatum->getName(),
                ];
            }

            return $data;
        }, 10, 1 );
    }

    /**
     * Add WooCommerce CPTs to ACPT list
     */
    private function addWooCommerceCPTsToACPTList()
    {
        add_filter( 'add_cpt_to_acpt_list', function($customPostTypes){
            $customPostTypes[] = get_post_type_object("shop_order");
            $customPostTypes[] = get_post_type_object("product_variation");

            return $customPostTypes;
        }, 10, 1 );
    }
}
