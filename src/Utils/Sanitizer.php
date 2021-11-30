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

    /**
     * @param $field
     *
     * @return mixed
     */
    public static function escapeField($field)
    {
        $allowedTags = [
                'a' => [
                        'href' => [],
                        'title' => []
                ],
                'br' => [],
                'img' => [
                        'src' => [],
                        'alt' => [],
                        'title' => [],
                ],
                'strong' => [],
                'div' => [
                        'data-target' => [],
                        'style' => [],
                        'class' => [],
                        'id' => []
                ],
                'label' => [
                        'for' => [],
                        'style' => [],
                        'type' => [],
                        'name' => [],
                        'class' => [],
                        'id' => []
                ],
                'input' => [
                        'value' => [],
                        'readonly' => [],
                        'style' => [],
                        'type' => [],
                        'name' => [],
                        'class' => [],
                        'id' => []
                ],
                'select' => [
                        'readonly' => [],
                        'style' => [],
                        'multiple' => [],
                        'type' => [],
                        'name' => [],
                        'class' => [],
                        'id' => []
                ],
                'option' => [
                        'selected' => [],
                        'value' => [],
                        'data-symbol' => [],
                        'data-placeholder' => [],
                ],
                'button' => [
                        'value' => [],
                        'data-target-id' => [],
                        'readonly' => [],
                        'style' => [],
                        'multiple' => [],
                        'type' => [],
                        'name' => [],
                        'class' => [],
                        'id' => []
                ],
        ];

        return wp_kses($field, $allowedTags);
    }
}