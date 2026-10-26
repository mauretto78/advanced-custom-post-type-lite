<?php

namespace ACPT_Lite\Core\API\AJAX\Middleware;

use ACPT_Lite\Utils\PHP\Request;

class AdminPermissionsMiddleware extends AbstractMiddleware
{
    public function handle(Request $request): void
    {
        if (!current_user_can('manage_options')) {
            wp_send_json(['success' => false, 'error' => 'Unauthorized'], 403);
        }
    }
}
