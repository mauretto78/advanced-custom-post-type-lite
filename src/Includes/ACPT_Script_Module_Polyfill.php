<?php

if (! function_exists('wp_register_script_module')) {
    $GLOBALS['acpt_polyfill_modules'] = [];

    add_filter('script_loader_tag', static function (string $tag, string $handle): string {
        if (! empty($GLOBALS['acpt_polyfill_modules'][ $handle ])) {
            $tag = str_replace('<script ', '<script type="module" ', $tag);
        }
        return $tag;
    }, 10, 2);

    /**
     * Registers a JavaScript module with WordPress.
     *
     * This function maps dependencies to their respective handles and registers
     * the script with WordPress. It also adds the registered module to a global
     * list of polyfill modules.
     *
     * @param string $id The unique identifier for the script.
     * @param string $src The URL to the script source.
     * @param array<string, mixed> $deps An array of dependencies for the script. Each dependency
     *                         can either be a string (handle) or an array containing
     *                         a key `id` for the dependency handle.
     * @param mixed $version The script version. Accepts string, false, or null.
     * @param array<string|int, mixed> $args Additional arguments related to the script.
     *
     * @return void
     */
    function wp_register_script_module(string $id, string $src, array $deps = [], $version = false, array $args = []): void
    {
        $dep_handles = array_map(
            static fn ($dep) => is_array($dep) ? ($dep['id'] ?? '') : $dep,
            $deps
        );
        wp_register_script($id, $src, array_filter($dep_handles), $version, false);
        $GLOBALS['acpt_polyfill_modules'][ $id ] = true;
    }
}

if (! function_exists('wp_enqueue_script_module')) {

    /**
     * Enqueues a JavaScript module script in WordPress.
     *
     * Registers the script as a JavaScript module using the given parameters if the source is provided,
     * and then enqueues it for inclusion on the page.
     *
     * @param string $id The handle name for the script.
     * @param string $src The source URL of the script. If empty, the script will not be registered.
     * @param array<string, mixed> $deps Optional. An array of script handles that the script depends on. Default is an empty array.
     * @param mixed $version Optional. The version of the script. Set to `false` to disable versioning. Default is false.
     * @param array<string|int, mixed> $args Optional. Additional arguments for the script registration, such as 'in_footer'. Default is an empty array.
     *
     * @return void
     */
    function wp_enqueue_script_module(string $id, string $src = '', array $deps = [], $version = false, array $args = []): void
    {
        if ($src !== '') {
            wp_register_script_module($id, $src, $deps, $version, $args);
        }
        wp_enqueue_script($id);
    }
}
