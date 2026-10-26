<?php

namespace ACPT_Lite\Utils\PHP;

class Cookie
{
    /**
     * @param string $key
     * @param mixed $value
     * @param int $time
     * @return void
     */
    public static function set(string $key, $value, int $time = 0): void
    {
        $encoded = json_encode($value);

        if ($encoded !== false) {
            setcookie($key, $encoded, $time);
        }
    }

    /**
     * @param string $key
     * @return void
     */
    public static function delete(string $key): void
    {
        setcookie($key, "", time()-3600);
    }

    /**
     * @param string $key
     *
     * @return mixed|null
     */
    public static function get(string $key)
    {
        if (isset($_COOKIE[$key])) {
            $decoded = json_decode($_COOKIE[$key], true);
            return $decoded !== null ? $decoded : $_COOKIE[$key];
        }

        return null;
    }
}
