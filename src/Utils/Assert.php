<?php

namespace ACPT_Lite\Utils;

use Webmozart\Assert\Assert as WebmozartAssert;
use Webmozart\Assert\InvalidArgumentException;

class Assert extends WebmozartAssert
{
    /**
     * @param mixed  $value
     * @param string $message
     *
     * @throws InvalidArgumentException
     */
    public static function color($value, $message = '')
    {
        preg_match_all('/#[a-zA-Z0-9]{6}|rgb\((?:\s*\d+\s*,){2}\s*[\d]+\)|rgba\((\s*\d+\s*,){3}[\d\.]+\)|hsl\(\s*\d+\s*(\s*\,\s*\d+\%){2}\)|hsla\(\s*\d+(\s*,\s*\d+\s*\%){2}\s*\,\s*[\d\.]+\)/',
                $value, $matches);

        if(empty($matches[0])){
            static::reportInvalidArgument(\sprintf(
                    $message ?: 'Expected a value to be a valid color. Got: %s',
                    static::valueToString($value)
            ));
        }
    }

    /**
     * @param mixed  $value
     * @param string $message
     *
     * @throws InvalidArgumentException
     */
    public static function date($value, $message = '')
    {
        if (\DateTime::createFromFormat('Y-m-d H:i:s', $value) !== false) {
            static::reportInvalidArgument(\sprintf(
                    $message ?: 'Expected a value to be a valid date. Got: %s',
                    static::valueToString($value)
            ));
        }
    }

    /**
     * @param mixed  $value
     * @param string $message
     *
     * @throws InvalidArgumentException
     */
    public static function url($value, $message = '')
    {
        if (false === \filter_var($value, FILTER_VALIDATE_URL)) {
            static::reportInvalidArgument(\sprintf(
                    $message ?: 'Expected a value to be a valid url. Got: %s',
                    static::valueToString($value)
            ));
        }
    }
}