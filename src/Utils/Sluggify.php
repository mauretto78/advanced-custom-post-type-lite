<?php

namespace ACPT_Lite\Utils;

class Sluggify
{
    /**
     * Sanitize a string
     *
     * @param string $string
     * @param int    $maxLength
     *
     * @return string
     */
    public static function slug($string, $maxLength = 20)
    {
        $sanitized = '';

        if ( is_scalar( $string ) ) {
            $sanitized = strtolower( $string );
            $sanitized = ltrim($sanitized);
            $sanitized = rtrim($sanitized);
            $sanitized = str_replace(' ','-', $sanitized);
            $sanitized = preg_replace( '/[^a-z0-9_\-]/', '', $sanitized );
        }

        return substr($sanitized, 0, $maxLength);
    }
}