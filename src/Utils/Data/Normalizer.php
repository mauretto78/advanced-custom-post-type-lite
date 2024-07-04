<?php

namespace ACPT_Lite\Utils\Data;

/**
 * Class Normalizer
 * @package ACPT\Utils
 */
class Normalizer
{
    /**
     * @param $array
     *
     * @return \stdClass
     */
    public static function arrayToObject($array)
    {
        $json = json_encode($array);

        return json_decode($json);
    }

    /**
     * @param $object
     *
     * @return array
     */
    public static function objectToArray($object)
    {
        if(is_object($object) || is_array($object)) {
            $ret = (array) $object;
            foreach($ret as &$item) {
                $item = self::objectToArray($item);
            }

            return $ret;
        }

        return $object;
    }
}