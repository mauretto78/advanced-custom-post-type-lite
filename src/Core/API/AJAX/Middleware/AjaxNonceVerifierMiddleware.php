<?php

namespace ACPT_Lite\Core\API\AJAX\Middleware;

use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\Wordpress\Nonce;

class AjaxNonceVerifierMiddleware extends AbstractMiddleware
{
    public function handle(Request $request): void
    {
        if (! Nonce::verify($request->post('_ajax_nonce'))) {
            wp_send_json([
                'success' => false,
                'error'   => 'Invalid nonce'
            ], 403);
        }
    }
}
