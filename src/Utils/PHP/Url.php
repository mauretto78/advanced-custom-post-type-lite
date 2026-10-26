<?php

namespace ACPT_Lite\Utils\PHP;

class Url
{
    /**
     * Normalize the domain of a given URL by removing the 'www.' prefix
     * and converting it to lowercase.
     *
     * @param string $url The URL from which the domain will be extracted and normalized.
     * @return string The normalized domain name.
     */
    public static function normalizeDomain(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST);

        if (empty($host)) {
            return '';
        }

        // strip www. prefix to avoid false mismatches
        return strtolower(preg_replace('/^www\./', '', $host));
    }

    /**
     * This functions is used instead of global $pagenow
     * bacause in some Multisite installations $pagenow does not work as expected
     * (it returns NULL)
     *
     * @param Request|null $request
     *
     * @return string
     */
    public static function pagenow(?Request $request = null)
    {
        if (self::isCli($request) && empty($_SERVER['PHP_SELF'])) {
            return 'index.php';
        }

        $uri = $request ? $request->server('PHP_SELF', '') : $_SERVER['PHP_SELF'];
        $lastLetter = substr($uri, -1);

        if ($lastLetter === "/") {
            $uri = rtrim($uri, "/");
        }

        $uri = explode('/', $uri);

        return end($uri);
    }

    /**
     * @return string
     */
    public static function host(): string
    {
        if (isset($_SERVER['HTTPS'])) {
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        } else {
            $protocol = 'http';
        }

        return $protocol . "://" . $_SERVER['HTTP_HOST'];
    }

    /**
     * @param array<mixed>|null $queryString
     * @param Request|null $request
     *
     * @return string
     */
    public static function baseUri(?array $queryString = [], ?Request $request = null): string
    {
        if (self::isCli($request)) {
            return '';
        }

        $qs = $request ? $request->server('QUERY_STRING') : ($_SERVER['QUERY_STRING'] ?? '');
        $requestUri = $request ? $request->server('REQUEST_URI') : ($_SERVER['REQUEST_URI'] ?? '');
        $baseUri = str_replace('?'.$qs, '', $requestUri);

        $uri = self::host() . $baseUri;

        if (!empty($queryString)) {
            $uri = $uri . '?' . http_build_query($queryString);
        }

        return $uri;
    }

    /**
     * @param string $url
     *
     * @return string
     */
    public static function secureUrl(string $url): string
    {
        return (string)str_ireplace('http://', 'https://', $url);
    }

    /**
     * @param string $url
     *
     * @return string
     */
    public static function getLastPartOfUrl(string $url): string
    {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return '';
        }

        $parsedUrl = parse_url($url, PHP_URL_PATH);

        return basename((string)$parsedUrl);
    }

    /**
     * @param Request|null $request
     *
     * @return string
     */
    public static function fullUrl(?Request $request = null): string
    {
        if (self::isCli($request)) {
            return '';
        }

        $pageURL = 'http';

        $https = $request ? $request->server('HTTPS') : ($_SERVER["HTTPS"] ?? null);
        if (isset($https) && $https == "on") {
            $pageURL .= "s";
        }

        $pageURL .= "://";

        $serverPort = $request ? $request->server('SERVER_PORT', '80') : ($_SERVER["SERVER_PORT"] ?? '80');
        $serverName = $request ? $request->server('SERVER_NAME', '') : ($_SERVER["SERVER_NAME"] ?? '');
        $requestUri = $request ? $request->server('REQUEST_URI', '') : ($_SERVER["REQUEST_URI"] ?? '');

        if ($serverPort != "80") {
            $pageURL .= $serverName . ":" . $serverPort . $requestUri;
        } else {
            $pageURL .= $serverName . $requestUri;
        }

        return $pageURL;
    }

    /**
     * @param string|null $url
     *
     * @return string|null
     */
    public static function sanitize(?string $url = null): ?string
    {
        if ($url === null) {
            return null;
        }

        return esc_url(strip_tags($url));
    }

    /**
     * @param string $url
     * @return bool
     */
    public static function isValid(string $url): bool
    {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return true;
        }

        return false;
    }

    /**
     * Determines if the current environment is a command-line interface (CLI).
     *
     * @param Request|null $request An optional Request object to check context. Defaults to null.
     * @return bool True if the environment is CLI, otherwise false.
     */
    private static function isCli(?Request $request = null): bool
    {
        if ($request === null && php_sapi_name() === 'cli') {
            return true;
        }

        return false;
    }
}
