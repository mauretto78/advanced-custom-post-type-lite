<?php

namespace ACPT_Lite\Integrations\WooCommerce\Ajax;

use ACPT_Lite\Admin\ACPT_Lite_Ajax;
use ACPT_Lite\Core\API\AJAX\Middleware\AdminPermissionsMiddleware;
use ACPT_Lite\Core\API\AJAX\Middleware\EditorPermissionsMiddleware;

class WooCommerceAjax extends ACPT_Lite_Ajax
{
    /**
     * @return array<int, mixed>
     */
    public function routes(): array
    {
        $auth = [new AdminPermissionsMiddleware()];
        $editor = [new EditorPermissionsMiddleware()];

        return [
            $this->route('deleteWooCommerceProductDataAction', WooCommerceController::class, $auth),
            $this->route('deleteWooCommerceProductDataFieldsAction', WooCommerceController::class, $auth),
            $this->route('fetchWooCommerceProductDataAction', WooCommerceController::class, $editor),
            $this->route('fetchWooCommerceProductDataFieldsAction', WooCommerceController::class, $editor),
            $this->route('resetWooCommerceProductDataAction', WooCommerceController::class, $auth),
            $this->route('saveWooCommerceProductDataAction', WooCommerceController::class, $auth),
            $this->route('saveWooCommerceProductDataFieldsAction', WooCommerceController::class, $auth),
        ];
    }
}
