<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class Arrays
{
    /**
     * @param mixed $array
     * @return int
     */
    public static function count($array): int
    {
        if (empty($array)) {
            return 0;
        }

        return is_countable($array) ? count($array) : 0;
    }

    /**
     * @param array<mixed> $array
     * @param mixed $indexString
     *
     * @return mixed|null
     */
    public static function valueFromIndex(array $array, $indexString)
    {
        $indexArray = str_replace(["]","["], ".", $indexString);
        $indexArray = explode(".", $indexArray);

        $next = null;
        $prev = $array;

        foreach ($indexArray as $key) {
            self::valueFromIndexPipeline($key, $prev, $next);
        }

        return $next;
    }

    /**
     * @param mixed $key
     * @param mixed $prev
     * @param mixed $next
     * @return void
     */
    private static function valueFromIndexPipeline($key, &$prev, &$next): void
    {
        if (is_numeric($key)) {
            $key = (int)$key;
        }

        if (!isset($prev[$key])) {
            $prev = null;
            $next = null;
        } else {
            $next = $prev[$key];
            $prev = $prev[$key];
        }
    }

    /**
     * @see https://gist.github.com/ArneGockeln/d2b210456770d306407ff3b6fe9a8cbc
     * @param string|int $needle
     * @param string $key
     * @param array<mixed> $haystack
     *
     * @return bool|string|null
     */
    public static function path($needle, string $key, array $haystack)
    {
        foreach ($haystack as $k => $value) {
            if ($value == $needle && $key == $k) {
                return null;
            } elseif (is_array($value)) {
                // multi search
                $key_result = self::path($needle, $key, $value);
                if ($key_result !== false) {
                    $return = '';
                    $return .= '['.$k.']';
                    $return .= $key_result;

                    return $return;
                }
            }
        }

        return false;
    }

    /**
     * Reindex an indexed array
     *
     * @param array<mixed> $array
     * @return array<mixed>
     */
    public static function reindex(array $array): array
    {
        $index = 0;
        $return = [];

        foreach ($array as $key => $value) {
            if (is_string($key)) {
                $newKey = $key;
            } else {
                $newKey = $index;
                ++$index;
            }

            $return[$newKey] = is_array($value) ? self::reindex($value) : $value;
        }

        // Sort alphabetically, numeric first then alpha
        ksort($return, SORT_NATURAL);

        return $return;
    }

    /**
     * @param array<mixed> $array
     * @param mixed $columnName
     * @param mixed $value
     *
     * @return false|int|string
     */
    public static function findIndex(array $array, $columnName, $value)
    {
        return array_search($value, array_column($array, $columnName));
    }

    /**
     * @param array<mixed> $array
     * @param string $prefix
     *
     * @return string
     */
    public static function toPlainText(array $array, string $prefix = ''): string
    {
        $arrayFlat = self::arrayFlat($array, $prefix);
        $arrayToPlainText = '';

        foreach ($arrayFlat as $key => $value) {
            $arrayToPlainText .= "'".$key."': '".$value."'";

            if ($key !== array_key_last($arrayFlat)) {
                $arrayToPlainText .= ', ';
            }
        }

        return $arrayToPlainText;
    }

    /**
     * @param array<mixed> $array
     * @param string $prefix
     *
     * @return array<mixed>
     */
    public static function arrayFlat(array $array, $prefix = ''): array
    {
        $result = array();

        foreach ($array as $key => $value) {
            $new_key = $prefix . (empty($prefix) ? '' : '.') . $key;

            if (is_array($value)) {
                $result = array_merge($result, self::arrayFlat($value, $new_key));
            } else {
                $result[$new_key] = $value;
            }
        }

        return $result;
    }

    /**
     * This function removes duplicated entities in an array
     *
     * @param AbstractModel[] $models
     *
     * @return array<mixed>
     */
    public static function arrayUniqueOfEntities(array $models = []): array
    {
        $unique = [];

        foreach ($models as $index => $model) {
            if (!in_array($model->getId(), $unique)) {
                $unique[] = $model->getId();
            } else {
                unset($models[$index]);
            }
        }

        return $models;
    }

    /**
     * @param array<mixed> $array
     * @param mixed $uniqueKey
     *
     * @return array<mixed>
     */
    public static function arrayUniqueByKey(array $array, $uniqueKey): array
    {
        $unique = [];

        foreach ($array as $index => $entry) {
            if (!in_array($entry[$uniqueKey], $unique)) {
                $unique[] = $entry[$uniqueKey];
            } else {
                unset($array[$index]);
            }
        }

        return $array;
    }

    /**
     * @param array<mixed> $array
     *
     * @return bool
     */
    public static function arrayIsList(array $array): bool
    {
        if (!function_exists('array_is_list')) {
            if ($array === []) {
                return true;
            }

            return array_keys($array) === range(0, Arrays::count($array) - 1);
        }

        return array_is_list($array);
    }

    /**
     * Determines if a given array is associative.
     *
     * @param array<mixed> $array The array to check.
     * @return bool True if the array is associative, false otherwise.
     */
    public static function arrayIsAssociative(array $array): bool
    {
        $keys = array_keys($array);

        return !is_int($keys[0]);
    }

    /**
     * Converts an array of objects into an array of associative arrays.
     *
     * @param array<mixed> $array The input array containing objects.
     *
     * @return array<mixed> The transformed array with objects converted to associative arrays.
     */
    public static function plain(array $array): array
    {
        $encoded = json_encode($array);

        if ($encoded === false) {
            return [];
        }

        return json_decode($encoded, true);
    }

    /**
     * Converts an associative array into a standard class object.
     *
     * @param array<mixed> $array The array to convert.
     * @return object The resulting object representation of the array.
     */
    public static function toObject(array $array): object
    {
        $encoded = json_encode($array);

        if ($encoded === false) {
            return new \stdClass();
        }

        return json_decode($encoded, false);
    }

    /**
     * Collapse a literal `false` value on the given keys to `null`. Used for WP-core
     * object properties (e.g. WP_Taxonomy/WP_Post_Type::$rest_base) that are typed
     * `string|bool` and default to boolean `false` when unset, so they don't fail an
     * output schema declared as `string|null`.
     *
     * @param array<mixed> $array
     * @param array<string> $keys
     *
     * @return array<mixed>
     */
    public static function falseToNull(array $array, array $keys): array
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $array) && $array[$key] === false) {
                $array[$key] = null;
            }
        }

        return $array;
    }
}
