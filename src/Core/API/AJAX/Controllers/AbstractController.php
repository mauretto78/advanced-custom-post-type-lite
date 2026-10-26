<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\API\AJAX\Middleware\AbstractMiddleware;
use ACPT_Lite\Utils\Data\JsonSanitizer;
use ACPT_Lite\Utils\PHP\Request;

class AbstractController
{
    protected ?string $action = null;

    protected ?string $method = null;

    /** @var AbstractMiddleware[] */
    protected array $middlewares = [];

    protected Request $request;

    /**
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param string $action
     */
    public function setAction(string $action): void
    {
        $this->action = $action;
    }

    /**
     * @param string $method
     */
    public function setMethod(string $method): void
    {
        $this->method = $method;
    }

    /**
     * @param AbstractMiddleware $middleware
     */
    public function addMiddleware(AbstractMiddleware $middleware): void
    {
        // check if middleware of the same class already exists to avoid duplicates
        if (in_array($middleware, $this->middlewares, true)) {
            return;
        }

        $this->middlewares[] = $middleware;
    }

    /**
     * Handles the incoming request by executing the method specified in the `method` property,
     * if it exists. Iterates through any middlewares defined in the `middlewares` property and
     * invokes their `handle` method prior to calling the main method.
     *
     * If the specified method does not exist, the magic `__call` method is used as a fallback.
     *
     * Performs no operation if either the `action` or `method` property is empty.
     */
    public function handleRequest(): void
    {
        if (empty($this->action) || empty($this->method)) {
            wp_send_json(['success' => false, 'error' => 'No `action` or `method` provided'], 400);
        }

        if ($this->request->post('action') !== $this->method) {
            wp_send_json(['success' => false, 'error' => 'Wrong method called'], 404);
        }

        $m = $this->method;

        if (method_exists($this, $m)) {
            foreach ($this->middlewares as $middleware) {
                $middleware->handle($this->request);
            }

            $this->$m();
            return;
        }

        $this->$m();
    }

    /**
     * @param string               $name
     * @param array<int, mixed>    $arguments
     * @return void
     * @throws \Exception
     */
    public function __call(string $name, array $arguments)
    {
        wp_send_json(['success' => false, 'error' => 'Method not found'], 404);
    }

    /**
     * @param mixed $data
     * @param array<string, mixed> $fieldTypes Optional map of JSON key names to MetaFieldModel type constants.
     *                                         Keys listed here use the specified sanitization policy; all others
     *                                         default to TEXT_TYPE (strips all HTML). Applied at every nesting level.
     *                                         Example: ['description' => MetaFieldModel::EDITOR_TYPE]
     *
     * @return array<array-key, mixed>
     */
    protected function sanitizeJsonData($data, array $fieldTypes = []): array
    {
        return JsonSanitizer::sanitize($data, $fieldTypes);
    }

    /**
     * @param string $string
     *
     * @return string
     */
    protected function cleanHeadersAndFootersName(string $string): string
    {
        $directory = get_template_directory();

        return str_replace([$directory, '/', '.php'], '', $string);
    }

}
