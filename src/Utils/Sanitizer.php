<?php

namespace ACPT_Lite\Utils;

class Sanitizer
{
    /**
     * @param $array
     *
     * @return mixed
     */
    public static function recursiveSanitizeRawData( $array) {
        foreach ( $array as $key => &$value ) {
            if ( is_array( $value ) ) {
                $value = self::recursiveSanitizeRawData($value);
            } elseif(\is_string($value)){
                $value = sanitize_text_field( $value );
            } elseif(\is_bool($value)) {
                $value = (bool)( $value );
            } elseif (\is_null($value)){
                $value = null;
            }
        }

        return $array;
    }
}