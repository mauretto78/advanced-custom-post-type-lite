<?php

namespace ACPT_Lite\Utils\Wordpress;

class Transient
{
    /**
     * @param string $key
     * @return bool
     */
    public static function delete(string $key): bool
    {
        return delete_transient($key);
    }

    /**
     * @param string $key
     * @return bool
     */
    public static function has(string $key): bool
    {
        return get_transient($key) !== false;
    }

    /**
     * @param string $key
     * @return mixed
     */
    public static function get(string $key)
    {
        return get_transient($key);
    }

    /**
     * @param string $key
     * @param mixed $value
     * @param int $ttl
     */
    public static function set(string $key, $value, int $ttl): void
    {
        set_transient($key, $value, $ttl);
    }
}
