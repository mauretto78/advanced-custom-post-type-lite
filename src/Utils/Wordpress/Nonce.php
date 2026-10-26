<?php

namespace ACPT_Lite\Utils\Wordpress;

class Nonce
{
    public const ACPT_NONCE = 'acpt_nonce';

    /**
     * @param string|null $nonce
     * @return string
     */
    public static function field(?string $nonce = null): string
    {
        if ($nonce === null) {
            $nonce = self::ACPT_NONCE;
        }

        return wp_nonce_field(self::generate(), $nonce, true, false);
    }

    /**
     * @param string $nonce
     * @return bool|int
     */
    public static function verify(string $nonce)
    {
        return wp_verify_nonce($nonce, self::generate());
    }

    /**
     * @return string
     */
    public static function generate()
    {
        return plugin_basename(__FILE__) . '/src/Utils/Wordpress/Nonce.php';
    }

    /**
     * @return string
     */
    public static function create()
    {
        return wp_create_nonce(self::generate());
    }
}
