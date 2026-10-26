<?php

namespace ACPT_Lite\Utils\Data;

/**
 * Class Normalizer
 * @package ACPT_Lite\Utils
 */
class Normalizer
{
    /**
     * @param array<mixed> $array
     * @return \stdClass
     */
    public static function arrayToObject(array $array): \stdClass
    {
        $json = json_encode($array);

        if ($json === false) {
            return new \stdClass();
        }

        return json_decode($json);
    }

    /**
     * @param mixed $object
     * @return mixed
     */
    public static function objectToArray($object)
    {
        if (is_object($object) || is_array($object)) {
            $ret = (array) $object;
            foreach ($ret as &$item) {
                $item = self::objectToArray($item);
            }

            return $ret;
        }

        return $object;
    }
}
