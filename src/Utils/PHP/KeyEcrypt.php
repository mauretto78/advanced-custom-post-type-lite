<?php

namespace ACPT_Lite\Utils\PHP;

class KeyEcrypt
{
    /**
     * @see https://www.php.net/manual/en/function.hash.php
     */
    private const ALGO = 'ripemd128';

    /**
     * @param $key
     *
     * @return string
     */
    public static function ecrypt($key)
    {
        return hash(self::ALGO, $key);
    }
}