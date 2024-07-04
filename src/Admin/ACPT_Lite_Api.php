<?php

namespace ACPT_Lite\Admin;

abstract class ACPT_Lite_Api
{
    /**
     * @param     $message
     * @param int $code
     *
     * @return \WP_Error
     */
    protected function restError($message, $code = 500)
    {
        return new \WP_Error( "rest_error", $message, ['status' => $code ] );
    }
}
