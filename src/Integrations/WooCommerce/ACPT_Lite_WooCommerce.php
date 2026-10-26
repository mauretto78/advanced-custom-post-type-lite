<?php

namespace ACPT_Lite\Integrations\WooCommerce;

use ACPT_Lite\Core\API\AJAX\Controllers\AbstractController;
use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\WooCommerce\Ajax\WooCommerceAjax;
use ACPT_Lite\Integrations\WooCommerce\Filters\WooCommerceFilters;
use ACPT_Lite\Integrations\WooCommerce\Generators\WooCommerceProductData;
use ACPT_Lite\Integrations\WooCommerce\Generators\WooCommerceProductVariationMetaGroups;
use ACPT_Lite\Utils\PHP\Request;

class ACPT_Lite_WooCommerce extends AbstractIntegration
{
    /**
     * @return string
     */
    protected function name(): string
    {
        return "woocommerce";
    }

    /**
     * @param Request|null $request
     * @return bool
     */
    protected function isActive(?Request $request = null): bool
    {
        // for test purposes, we want to be able to run the integration even if WooCommerce is not active, as long as the tests are running.
        if (function_exists("testsAreRunning") && testsAreRunning()) {
            return true;
        }

        return Features::hasMeta() && is_plugin_active('woocommerce/woocommerce.php');
    }

    /**
     * Public facade for ACPT_Lite_WooCommerce::isActive() method
     *
     * Memoized: boot path calls this once per post type inside a foreach loop.
     *
     * @return bool
     */
    public static function active()
    {
        static $cached = null;

        if ($cached !== null) {
            return $cached;
        }

        if (function_exists("testsAreRunning") && testsAreRunning()) {
            return $cached = true;
        }

        return $cached = (new ACPT_Lite_WooCommerce())->isActive();
    }

    /**
     * @inheritDoc
     */
    protected function runIntegration()
    {
        if (!ACPT_Lite_DB::tableExists("TABLE_WOOCOMMERCE_PRODUCT_DATA")) {
            ACPT_Lite_DB::removeOrCreateFeatureTables("woocommerce");
        }

        (new WooCommerceProductData())->generate();
        (new WooCommerceProductVariationMetaGroups())->generate();
        (new WooCommerceFilters())->run();
        $this->registerAjaxRoutes();
    }

    /**
     * Registers AJAX routes defined in the WooCommerceAjax routes configuration.
     *
     * Processes each route by creating the corresponding controller instance,
     * setting the action and method, attaching any specified middlewares,
     * and binding the route to the appropriate WordPress AJAX action.
     *
     * @return void
     */
    private static function registerAjaxRoutes()
    {
        $request = ACPT_Lite_Plugin::getRequest();
        $ajax = new WooCommerceAjax($request);

        foreach ($ajax->routes() as [$action, $controllerClass, $method, $middlewares]) {
            /** @var AbstractController $controller */
            $controller = new $controllerClass($request);

            if (is_callable([$controller, $method])) {
                $controller->setAction($action);
                $controller->setMethod($method);

                foreach ($middlewares as $middleware) {
                    $controller->addMiddleware($middleware);
                }

                add_action($action, [$controller, 'handleRequest']);
            }
        }
    }

    /**
     * Example: edit.php?post_type=product&page=product_attributes&edit=1
     *
     * @param string $pagenow
     *
     * @return bool
     */
    public static function isWooCommerceProductAttributePage(string $pagenow): bool
    {
        if (!self::active()) {
            return false;
        }

        if ($pagenow !== "edit.php") {
            return false;
        }

        if (!isset($_GET['post_type'])) {
            return false;
        }

        if ($_GET['post_type'] !== "product") {
            return false;
        }

        if (!isset($_GET['page'])) {
            return false;
        }

        if ($_GET['page'] !== "product_attributes") {
            return false;
        }

        $id = isset($_GET['edit']) ? absint($_GET['edit']) : 0;

        if (empty($id)) {
            return false;
        }

        return true;
    }

    /**
     * @param int $id
     *
     * @return string
     */
    public static function getWooCommerceProductAttributeName(int $id): string
    {
        if (function_exists("wc_attribute_taxonomy_name_by_id")) {
            return wc_attribute_taxonomy_name_by_id($id);
        }

        global $wpdb;
        $attributeSlug = $wpdb->get_var("select attribute_name from {$wpdb->prefix}woocommerce_attribute_taxonomies where attribute_id=" . $id);

        if (empty($attributeSlug)) {
            return "";
        }

        return "pa_".$attributeSlug;
    }
}
