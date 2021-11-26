<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Strings
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Strings
{
    /**
     * @param string $string
     *
     * @return string
     */
    public static function toDBFormat($string)
    {
        return strtolower(str_replace(' ', '_', $string));
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toHumanReadableFormat($string)
    {
        $string = strtolower($string);
        $string = str_replace('_', ' ', $string);
        $string = ucwords($string);

        return $string;
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function getUniqueName($string){

        $a = explode("_", $string);
        $end = (int)end($a);

        if(  ($end > 0) and count($a)>1 ){
            array_pop($a);
        }

        $name = implode('_', $a);

        $return = $name;
        $return .= '_'.($end+1);

        return $return;
    }

    /**
     * @param $needle
     * @param $haystack
     *
     * @return bool
     */
    public static function contains($needle, $haystack)
    {
        return strpos($haystack, $needle) !== false;
    }
}

