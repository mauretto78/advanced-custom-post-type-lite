<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Core\Generators\Meta\WooCommerceProductDataGenerator;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class WooCommerceProductData
{
    /**
     * Add product data
     */
    public function generate()
    {
        try {
            $WooCommerceProductData = WooCommerceProductDataRepository::get([]);

            if(!empty($WooCommerceProductData)){
                $wooCommerceProductDataGenerator = new WooCommerceProductDataGenerator($WooCommerceProductData);
                $wooCommerceProductDataGenerator->generate();
            }
        } catch (\Exception $exception){}
    }

}
