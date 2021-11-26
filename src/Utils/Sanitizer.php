<?php

namespace ACPT_Lite\Utils;

class Sanitizer
{
    /**
     * @param $array
     *
     * @return mixed
     */
    public static function recursiveSanitizeTextField($array) {
        foreach ( $array as $key => &$value ) {
            if ( is_array( $value ) ) {
                $value = self::recursiveSanitizeTextField($value);
            } else {
                $value = sanitize_text_field( $value );
            }
        }

        return $array;
    }
}