<?php

namespace ACPT_Lite\Utils\PHP;

class Request
{
    /**
     * @var array<mixed>
     */
    private array $get;

    /**
     * @var array<mixed>
     */
    private array $post;

    /**
     * @var array<mixed>
     */
    private array $server;

    /**
     * @var array<mixed>
     */
    private array $files;

    /**
     * @var array<mixed>
     */
    private array $request;

    /**
     * @var bool|null
     */
    private ?bool $restRequest;

    /**
     * @var bool|null
     */
    private ?bool $ajax;

    /**
     * @param array<mixed> $get
     * @param array<mixed> $post
     * @param array<mixed> $server
     * @param array<mixed> $files
     * @param array<mixed> $request
     * @param bool|null $restRequest
     * @param bool|null $ajax
     */
    public function __construct(
        array $get = [],
        array $post = [],
        array $server = [],
        array $files = [],
        array $request = [],
        ?bool $restRequest = null,
        ?bool $ajax = null
    ) {
        $this->get = $get;
        $this->post = $post;
        $this->files = $files;
        $this->server = $server;
        $this->request = $request;
        $this->restRequest = $restRequest;
        $this->ajax = $ajax;
    }

    /**
     * Build a Request from PHP superglobals (production default).
     *
     * @return self
     */
    public static function fromGlobals(): self
    {
        return new self($_GET, $_POST, $_SERVER, $_FILES, $_REQUEST);
    }

    /**
     * @param string $key
     * @param mixed $default
     *
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return $this->get[$key] ?? $default;
    }

    /**
     * Retrieves all parameters.
     *
     * @return array<mixed> The array of parameters.
     */
    public function getParams(): array
    {
        return $this->get;
    }

    /**
     * @param string $key
     * @param mixed $default
     *
     * @return mixed
     */
    public function post(string $key, $default = null)
    {
        return $this->post[$key] ?? $default;
    }

    /**
     * Removes a specific key and its value from the post array if it exists.
     *
     * @param string $key The key to be removed from the post array.
     * @return void
     */
    public function unsetPost(string $key)
    {
        if (isset($this->post[$key])) {
            unset($this->post[$key]);
        }
    }

    /**
     * Retrieves all POST parameters.
     *
     * @return array<mixed> The array of POST parameters.
     */
    public function postParams()
    {
        return $this->post;
    }

    /**
     * Checks if a key exists in the GET array.
     *
     * @param string $key
     * @return bool
     */
    public function hasGet(string $key): bool
    {
        return isset($this->get[$key]);
    }

    /**
     * Checks if a key exists in the POST array.
     *
     * @param string $key
     * @return bool
     */
    public function hasPost(string $key): bool
    {
        return isset($this->post[$key]);
    }

    /**
     * Checks if a specific key exists in the request data.
     *
     * This method determines whether the provided key is present
     * in the request array and has been set.
     *
     * @param string $key The key to check for existence in the request data.
     * @return bool Returns true if the key exists in the request data, otherwise false.
     */
    public function hasRequest(string $key): bool
    {
        return isset($this->request[$key]);
    }

    /**
     * Retrieves all request data (alias of requestAll()).
     *
     * @return array<mixed>
     */
    public function all(): array
    {
        return $this->requestAll();
    }

    /**
     * Retrieves a file from the files array by its key.
     *
     * @param string $key The key to retrieve the file for.
     * @param mixed $default The default value to return if the file does not exist.
     * @return mixed The file associated with the key, or the default value if the key is not found.
     */
    public function file(string $key, $default = null)
    {
        return $this->files[$key] ?? $default;
    }

    /**
     * Retrieves the array of uploaded files.
     *
     * @return array<mixed> The array containing the uploaded files.
     */
    public function files(): array
    {
        return $this->files;
    }

    /**
     * Retrieves a value from the request array by its key.
     *
     * @param string $key The key to retrieve the value for.
     * @param mixed $default The default value to return if the key does not exist.
     * @return mixed The value associated with the key, or the default value if the key is not found.
     */
    public function request(string $key, $default = null)
    {
        return $this->request[$key] ?? $default;
    }

    /**
     * Retrieves all values from the request array.
     *
     * @return array<mixed> An associative array containing all key-value pairs from the request.
     */
    public function requestAll(): array
    {
        return $this->request;
    }

    /**
     * @param string $key
     * @param mixed $default
     *
     * @return mixed
     */
    public function server(string $key, $default = null)
    {
        return $this->server[$key] ?? $default;
    }

    /**
     * Retrieves the value of the Request URI from the server variables.
     *
     * This method accesses the 'REQUEST_URI' key in the server superglobal
     * to obtain the URI of the current HTTP request.
     *
     * @return mixed Returns the value associated with the 'REQUEST_URI' key, or null if not set.
     */
    public function requestUri()
    {
        return $this->server('REQUEST_URI');
    }

    /**
     * Retrieves the HTTP referrer URL from the server variables.
     *
     * @return string The HTTP referrer URL if available, otherwise a default site URL.
     */
    public function httpReferer()
    {
        return $this->server('HTTP_REFERER', site_url());
    }

    /**
     * Retrieves the value of the HTTP Authorization header from the server variables.
     *
     * This method accesses the 'HTTP_AUTHORIZATION' key in the server superglobal
     * to obtain the authorization credentials sent with the HTTP request.
     *
     * @return mixed Returns the value associated with the 'HTTP_AUTHORIZATION' key, or null if not set.
     */
    public function httpAuthorization()
    {
        return $this->server('HTTP_AUTHORIZATION');
    }

    /**
     * @return array<mixed>
     */
    public function serverAll(): array
    {
        return $this->server;
    }

    /**
     * @return bool
     */
    public function isRestRequest(): bool
    {
        if ($this->restRequest !== null) {
            return $this->restRequest;
        }

        if (function_exists('wp_is_serving_rest_request') && wp_is_serving_rest_request()) {
            return true;
        }

        // wp_is_serving_rest_request() relies on the REST_REQUEST constant, which WordPress
        // only defines on 'parse_request' - after 'init' has already fired. Code that needs
        // to detect a REST request during 'init' (e.g. conditional block registration) would
        // always see false, so fall back to inspecting the raw request URI/query string.
        if ($this->get('rest_route') !== null) {
            return true;
        }

        if (function_exists('rest_get_url_prefix')) {
            $prefix = '/' . rest_get_url_prefix() . '/';

            if (strpos((string) $this->requestUri(), $prefix) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return bool
     */
    public function isAjax(): bool
    {
        if ($this->ajax !== null) {
            return $this->ajax;
        }

        return function_exists('wp_doing_ajax') && wp_doing_ajax();
    }
}
