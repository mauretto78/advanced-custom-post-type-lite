<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Vendor\Webmozart\Assert\Assert as WebmozartAssert;
use ACPT_Lite\Vendor\Webmozart\Assert\InvalidArgumentException;

/**
 * ACPT's own assertions on top of webmozart/assert.
 *
 * Never redeclare a Webmozart method here: an override whose signature differs from the bundled
 * version's is a fatal error at class load. Before the vendor prefix, the parent could even be
 * another plugin's webmozart/assert 2.x (Ticket #1435).
 *
 * Class Assert
 * @package ACPT_Lite\Utils
 */
class Assert extends WebmozartAssert
{
    /**
     * @psalm-assert array<mixed> $value
     * @phpstan-assert array<mixed> $value
     *
     * @param mixed  $value
     * @param string|null $message
     * @return void
     *
     * @throws InvalidArgumentException
     */
    public static function isStringOrArray($value, ?string $message = ''): void
    {
        if (!\is_string($value) && !\is_array($value)) {
            static::reportInvalidArgument(\sprintf(
                $message ? $message : 'Expected a string or array. Got: %s',
                static::typeToString($value)
            ));
        }
    }

    /**
     * @param mixed  $value
     * @param string|null $message
     * @return void
     *
     * @throws InvalidArgumentException
     *
     * @return void
     */
    public static function color($value, ?string $message = ''): void
    {
        preg_match_all(
            '/#[a-zA-Z0-9]{6}|rgb\((?:\s*\d+\s*,){2}\s*[\d]+\)|rgba\((\s*\d+\s*,){3}[\d\.]+\)|hsl\(\s*\d+\s*(\s*\,\s*\d+\%){2}\)|hsla\(\s*\d+(\s*,\s*\d+\s*\%){2}\s*\,\s*[\d\.]+\)/',
            $value,
            $matches
        );

        if (empty($matches[0])) {
            static::reportInvalidArgument(\sprintf(
                $message ? $message : 'Expected a value to be a valid color. Got: %s',
                static::valueToString($value)
            ));
        }
    }

    /**
     * Accepts any non-blank string. The save path normalizes the dates it can parse (canonical,
     * display formats, ISO 8601) and stores the others as submitted (#1389): rejecting those here
     * would block the whole post save for a format PHP cannot read (e.g. localized month names).
     *
     * @param mixed  $value
     * @param string|null $message
     * @return void
     *
     * @throws InvalidArgumentException
     */
    public static function date($value, ?string $message = ''): void
    {
        if (!\is_string($value) || trim($value) === '') {
            static::reportInvalidArgument(\sprintf(
                $message ? $message : 'Expected a value to be a valid date. Got: %s',
                static::valueToString($value)
            ));
        }
    }

    /**
     * @note starting by version 1.0.153 this function allows also not latin characters
     * @example https://acpt.site4web.eu/wp-content/uploads/Шар-2-1.png
     *
     * @param mixed  $value
     * @param string|null $message
     * @return void
     *
     * @throws InvalidArgumentException
     *
     * @return void
     */
    public static function url($value, ?string $message = ''): void
    {
        if (!is_string($value)) {
            static::reportInvalidArgument(\sprintf(
                'Expected a string, got: %s',
                gettype($value)
            ));
        }

        $path = parse_url($value, PHP_URL_PATH);

        if (!is_string($path)) {
            static::reportInvalidArgument('Cannot parse url from the procided string');
        }

        $encoded_path = array_map('urlencode', explode('/', $path));
        $url = str_replace($path, implode('/', $encoded_path), $value);

        if (false === \filter_var($url, FILTER_VALIDATE_URL)) {
            static::reportInvalidArgument(\sprintf(
                $message ? $message : 'Expected a value to be a valid url. Got: %s',
                static::valueToString($value)
            ));
        }
    }
}
