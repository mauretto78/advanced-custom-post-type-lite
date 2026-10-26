<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

/**
 * Class JsonSanitizer
 *
 * Helper class to handle JSON sanitization and decoding.
 *
 * @package ACPT_Lite\Utils\Data
 */
class JsonSanitizer
{
    /**
     * Sanitizes a JSON string or array recursively and returns an array.
     *
     * @param mixed $data
     * @param array<string, string> $fieldTypes Optional map of key names to MetaFieldModel type constants.
     * @return array<mixed>
     */
    public static function sanitize($data, array $fieldTypes = []): array
    {
        if (empty($data)) {
            return [];
        }

        $decoded = $data;

        if (is_string($data)) {
            $decoded = self::decode($data);
        }

        if (!is_array($decoded)) {
            return [];
        }

        return self::recursiveDecodeAndSanitize($decoded, $fieldTypes);
    }

    /**
     * Attempts to decode a JSON string, handling wp_unslash issues.
     *
     * @param string $json
     * @return array<mixed>|null
     */
    public static function decode(string $json): ?array
    {
        // 1. Try to decode directly
        $decoded = json_decode($json, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // 2. Try with wp_unslash if available
        if (function_exists('wp_unslash')) {
            $unslashed = wp_unslash($json);
            $decoded = json_decode($unslashed, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        // 3. Fallback: try stripping slashes if wp_unslash is not available or didn't help
        $unslashed = stripslashes($json);
        $decoded = json_decode($unslashed, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        return null;
    }

    /**
     * Recursively decodes nested JSON strings and sanitizes all values.
     *
     * @param array<mixed> $array
     * @param array<string, string> $fieldTypes
     * @return array<mixed>
     */
    private static function recursiveDecodeAndSanitize(array $array, array $fieldTypes = []): array
    {
        foreach ($array as $key => $value) {
            $type = $fieldTypes[$key] ?? MetaFieldModel::TEXT_TYPE;

            if (is_array($value)) {
                $array[$key] = self::recursiveDecodeAndSanitize($value, $fieldTypes);
            } elseif (is_string($value) && !empty($value)) {
                // Check if it is a JSON string
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $array[$key] = self::recursiveDecodeAndSanitize($decoded, $fieldTypes);
                } else {
                    $array[$key] = Sanitizer::sanitizeRawData($type, $value);
                }
            } else {
                $array[$key] = Sanitizer::sanitizeRawData($type, $value);
            }
        }

        return $array;
    }
}
