<?php

namespace ACPT_Lite\Utils\PHP;

class JSON
{
    /**
     * @param mixed $string
     * @return bool
     */
    public static function isValid($string): bool
    {
        // 1. Basic type check
        if (!is_string($string) || is_numeric($string)) {
            return false;
        }

        // 2. Trim and check for Object {} or Array []
        $trimmed = trim($string);

        // Check if empty after trim
        if ($trimmed === '') {
            return false;
        }

        $firstChar = $trimmed[0];
        $lastChar = $trimmed[strlen($trimmed) - 1];

        // Must start and end with correct braces
        $isObj = ($firstChar === '{' && $lastChar === '}');
        $isArr = ($firstChar === '[' && $lastChar === ']');

        if (!$isObj && !$isArr) {
            return false;
        }

        // 3. Validation
        if (function_exists('json_validate')) {
            return json_validate($string);
        }

        json_decode($string);

        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * @param array<mixed> $object
     *
     * @return string
     */
    public static function arrayToEscapedJson($object = []): string
    {
        $json = json_encode($object);

        if (empty($json)) {
            return '';
        }

        $json = str_replace('"', '&quot;', $json);

        return $json;
    }

    /**
     * @param string $json
     *
     * @return array<mixed>
     */
    public static function escapedJsonToArray($json): array
    {
        $array = str_replace('&quot;', '"', $json);
        $array = json_decode($array, true);

        return $array;
    }
}
