<?php

/**
 * PHP 7.4 polyfills for functions introduced in PHP 8.0 / 8.1.
 *
 * WordPress 5.9+ ships the same str_* polyfills, but we declare our own so
 * the plugin is safe regardless of load order or WordPress version.
 */

if (!function_exists('str_contains')) {

    /**
     * Checks if a given substring exists within a string.
     *
     * @param string $haystack The string to search in.
     * @param string $needle The substring to search for.
     * @return bool Returns true if the substring exists in the string, otherwise false.
     */
    function str_contains(string $haystack, string $needle): bool
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

if (!function_exists('str_starts_with')) {

    /**
     * Checks if a given string starts with the specified prefix.
     *
     * @param string $haystack The string to search in.
     * @param string $needle The prefix to check for.
     * @return bool Returns true if the $haystack starts with the $needle, otherwise false.
     */
    function str_starts_with(string $haystack, string $needle): bool
    {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

if (!function_exists('str_ends_with')) {

    /**
     * Checks if a string ends with a given substring.
     *
     * @param string $haystack The string to be checked.
     * @param string $needle The substring to search for at the end of the string.
     * @return bool Returns true if the $haystack ends with the $needle, false otherwise.
     */
    function str_ends_with(string $haystack, string $needle): bool
    {
        return $needle === '' || substr($haystack, -strlen($needle)) === $needle;
    }
}

if (!function_exists('array_is_list')) {

    /**
     * Determines if an array is a list.
     *
     * An array is considered a list if its keys are sequential integers starting from 0.
     *
     * @param array<mixed> $array The array to be checked.
     * @return bool Returns true if the array is a list, false otherwise.
     */
    function array_is_list(array $array): bool
    {
        if ($array === []) {
            return true;
        }
        $nextKey = 0;
        foreach ($array as $k => $v) {
            if ($k !== $nextKey++) {
                return false;
            }
        }
        return true;
    }
}
