<?php

namespace ACPT_Lite\Integrations\WooCommerce;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\WooCommerce\Ajax\WooCommerceLiteAjax;
use ACPT_Lite\Integrations\WooCommerce\Filters\WooCommerceFilters;
use ACPT_Lite\Integrations\WooCommerce\Generators\WooCommerceProductData;
use ACPT_Lite\Integrations\WooCommerce\Generators\WooCommerceProductVariationMetaGroups;
use ACPT_Lite\Utils\Settings\Settings;

class ACPT_Lite_WooCommerce extends AbstractIntegration
{
    /**
     * @inheritDoc
     */
    protected function isActive()
    {
        $enabledMeta = Settings::get(SettingsModel::ENABLE_META, 1) == 1;

        return $enabledMeta and is_plugin_active( 'woocommerce/woocommerce.php');
    }

    /**
     * Public facade for ACPT_WooCommerce::isActive() method
     *
     * @return bool
     */
    public static function active()
    {
        return (new ACPT_Lite_WooCommerce)->isActive();
    }

    /**
     * @inheritDoc
     */
    protected function runIntegration()
    {
        (new WooCommerceProductData())->generate();
        (new WooCommerceProductVariationMetaGroups())->generate();
        (new WooCommerceFilters())->run();
        (new WooCommerceLiteAjax())->routes();
    }
}
