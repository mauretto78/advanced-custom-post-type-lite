<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Utils\PHP\KeyEcrypt;

class ACPT_Lite_Key_Value_Storage
{
    /**
     * @param string $key
     * @return bool
     */
    public static function delete(string $key): bool
    {
        $key = KeyEcrypt::ecrypt($key);

        $deleteOption = delete_option($key);
        $deleteCache = (wp_cache_get($key)) ? wp_cache_delete($key) : true;

        if ($deleteOption && $deleteCache) {
            return true;
        }

        return false;
    }

    /**
     * @param string $key
     * @return mixed
     */
    public static function get(string $key)
    {
        $key = KeyEcrypt::ecrypt($key);

        if (wp_cache_get($key)) {
            return wp_cache_get($key);
        }

        return get_option($key);
    }

    /**
     * @param string $key
     * @param mixed  $value
     * @return bool
     */
    public static function set(string $key, $value): bool
    {
        $key = KeyEcrypt::ecrypt($key);

        if (get_option($key)) {
            $saveOption = update_option($key, $value, true);
        } else {
            $saveOption = add_option($key, $value, '', true);
        }

        if ($saveOption && wp_cache_set($key, $value)) {
            return true;
        }

        return false;
    }
}
