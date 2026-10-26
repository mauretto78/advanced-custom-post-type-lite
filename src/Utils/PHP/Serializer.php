<?php

namespace ACPT_Lite\Utils\PHP;

class Serializer
{
    /**
     * Serializes a given PHP value into a string.
     *
     * @param mixed $object The PHP value to be serialized.
     * @return string The resulting serialized string.
     */
    public static function serialize($object): string
    {
        return serialize($object);
    }

    /**
     * Unserializes a given string into a PHP value.
     * Fixes PHP Object injection vulnerability
     *
     * @param string $string The serialized string to be converted back into a PHP value.
     * @return mixed The resulting value from unserializing the input string.
     */
    public static function unserialize(string $string)
    {
        if (!is_serialized($string)) {
            return null;
        }

        return @unserialize($string, ['allowed_classes' => false]);
    }
}