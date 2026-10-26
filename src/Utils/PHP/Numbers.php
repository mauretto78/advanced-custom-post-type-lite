<?php

namespace ACPT_Lite\Utils\PHP;

class Numbers
{
    /**
     * @param int $min
     * @param int $max
     * @return int
     */
    public static function random($min, $max)
    {
        return rand($min, $max);
    }

    /**
     * @param mixed $value
     * @return bool
     */
    public static function isFloat($value)
    {
        return is_float($value);
    }

    /**
     * @param mixed $value
     * @return bool
     */
    public static function isInt($value)
    {
        return is_int($value);
    }

    /**
     * @param mixed $value
     * @return bool
     */
    public static function isNumeric($value)
    {
        return is_numeric($value);
    }
}
