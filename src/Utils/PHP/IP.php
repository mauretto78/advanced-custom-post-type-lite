<?php

namespace ACPT_Lite\Utils\PHP;

class IP
{
    /**
     * @param Request|null $request
     * @return string|null
     */
    public static function getClientIP(?Request $request = null): ?string
    {
        if ($request === null && php_sapi_name() === 'cli') {
            return null;
        }

        $keys = [
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR',
        ];

        foreach ($keys as $key) {
            $ip = self::serverValue($key, $request);
            if (!empty($ip)) {
                $ip = self::extractFirstIP($ip);
                if (!empty($ip)) {
                    return $ip;
                }
            }
        }

        return '127.0.0.1';
    }

    /**
     * Extracts the first IP address from a potentially comma-separated string.
     *
     * @param string|null $value The IP value, which may contain multiple comma-separated IPs.
     * @return string|null The first IP address, or null if the value is empty.
     */
    private static function extractFirstIP(?string $value): ?string
    {
        if (!$value) {
            return $value;
        }

        if (strpos($value, ',') !== false) {
            $ips = explode(',', $value);
            return trim($ips[0]) ?: null;
        }

        return $value;
    }

    /**
     * Retrieves the value of a server key from the provided request or the global server array.
     *
     * @param string $key The server key to retrieve.
     * @param Request|null $request An optional Request instance to retrieve the key from.
     * @return string|null The value of the server key, or null if not found.
     */
    private static function serverValue($key, ?Request $request = null): ?string
    {
        if ($request !== null) {
            return $request->server($key);
        }

        if (isset($_SERVER[$key])) {
            return $_SERVER[$key];
        }

        return null;
    }
}
