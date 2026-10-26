<?php

namespace ACPT_Lite\Core\API\AJAX\Middleware;

use ACPT_Lite\Utils\PHP\Request;

abstract class AbstractMiddleware
{
    abstract public function handle(Request $request): void;
}
