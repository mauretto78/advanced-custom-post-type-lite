<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Utils\PHP\Request;

abstract class ACPT_Lite_Api
{
    protected Request $request;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param string $message
     * @param int    $code
     *
     * @return \WP_Error
     */
    protected function restError(string $message, int $code = 500): \WP_Error
    {
        return new \WP_Error("rest_error", $message, ['status' => $code ]);
    }
}
