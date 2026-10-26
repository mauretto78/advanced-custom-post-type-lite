<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Core\Generators\Meta\WooCommerceProductDataGenerator;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

class WooCommerceProductData
{
    /**
     * Add product data
     */
    public function generate(): void
    {
        try {
            $WooCommerceProductData = WooCommerceProductDataRepository::get([]);

            if (!empty($WooCommerceProductData)) {
                $wooCommerceProductDataGenerator = new WooCommerceProductDataGenerator(ACPT_Lite_Plugin::getRequest(), $WooCommerceProductData);
                $wooCommerceProductDataGenerator->generate();
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }
}
