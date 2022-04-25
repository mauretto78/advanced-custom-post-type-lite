<?php

namespace ACPT_Lite\Utils;

use ACPT_Lite\Core\Models\UserMetaFieldModel;

class Sanitizer
{
    /**
     * Sanitize post type data before saving
     *
     * @param $type
     * @param $rawData
     *
     * @return mixed
     */
    public static function sanitizePostTypeRawData($type, $rawData)
    {
        switch ($type){
            case UserMetaFieldModel::EMAIL_TYPE:
                return sanitize_email($rawData);

            default:
                return sanitize_text_field($rawData);
        }
    }

    /**
     * Sanitize user meta data before saving
     *
     * @param $type
     * @param $rawData
     *
     * @return mixed
     */
    public static function sanitizeUserMetaFieldRawData($type, $rawData)
    {
        switch ($type){
            case UserMetaFieldModel::EMAIL_TYPE:
                return sanitize_email($rawData);

            default:
                return sanitize_text_field($rawData);
        }
    }

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
                    'id' => [],
                    'href' => [],
                    'title' => [],
                    'style' => [],
                    'data-target-id' => []
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
                        'required' => [],
                        'value' => [],
                        'readonly' => [],
                        'style' => [],
                        'type' => [],
                        'name' => [],
                        'class' => [],
                        'id' => []
                ],
                'select' => [
                        'required' => [],
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