<?php

namespace ACPT_Lite\Core\Helper;

class Features
{
    public static function hasCpt(): bool
    {
        return self::enabled('ACPT_LITE_ENABLE_CPT');
    }

    public static function hasTax(): bool
    {
        return self::enabled('ACPT_LITE_ENABLE_TAX');
    }

    public static function hasMeta(): bool
    {
        return self::enabled('ACPT_LITE_ENABLE_META');
    }

    public static function hasMetaCache(): bool
    {
        return self::enabled('ACPT_LITE_ENABLE_META_CACHE');
    }

    public static function deleteUnusedTables(): bool
    {
        return self::enabled('ACPT_LITE_DELETE_UNUSED_TABLES');
    }
    public static function hasAdminMenu(): bool
    {
        return self::enabled('ACPT_LITE_ENABLE_ADMIN_MENU');
    }

    public static function enableBeta(): bool
    {
        return defined("ACPT_LITE_ENABLE_BETA") ? ACPT_LITE_ENABLE_BETA : false;
    }

    public static function skin(): string
    {
        return defined("ACPT_LITE_SKIN") ? ACPT_LITE_SKIN : "light";
    }

    /**
     * Checks if a given constant is defined and evaluates to a truthy value.
     *
     * Example usage:
     *
     * if(Features::enabled('ACPT_LITE_ENABLE_CPT')){ ...
     *
     * @param string $constant The name of the constant to check.
     * @return bool Returns true if the constant is defined and evaluates to a truthy value, otherwise false.
     */
    private static function enabled(string $constant): bool
    {
        // Check if we are specifically running a PHPUnit Test
        if (function_exists('testsAreRunning') && testsAreRunning()) {
            return true;
        }

        return defined($constant) && (bool) constant($constant);
    }
}
