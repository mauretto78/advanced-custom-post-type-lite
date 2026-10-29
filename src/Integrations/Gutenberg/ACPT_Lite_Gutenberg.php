<?php

namespace ACPT_Lite\Integrations\Gutenberg;

use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Generators\BasicBlockGenerator;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\PHP\Url;

class ACPT_Lite_Gutenberg extends AbstractIntegration
{
    /**
     * @return string
     */
    protected function name(): string
    {
        return "gutenberg";
    }

    /**
     * Determines whether the block editor (Gutenberg) should be considered active
     * based on the current page or request context.
     *
     * @param Request|null $request Optional request override; defaults to the plugin's current request.
     *
     * @return bool Returns true if the block editor is active for the current context, false otherwise.
     */
    protected function isActive(?Request $request = null): bool
    {
        if ($request === null) {
            $request = ACPT_Lite_Plugin::getRequest();
        }

        $pagenow = Url::pagenow($request);

        switch ($pagenow) {
            case 'post-new.php':
                return $this->canUseBlockEditorForType($request->get('post_type') ?: 'post');

            case 'post.php':
                if ($request->get('action') !== 'edit') {
                    return false;
                }

                // The block editor's meta box save request. Core's own answer for it is
                // "not the block editor", but use_block_editor_for_post() first calls the
                // pluggable check_admin_referer() (#1385).
                if (!empty($request->get('meta-box-loader'))) {
                    return false;
                }
                $postId = (int) $request->get('post');
                if ($postId <= 0 || !function_exists('use_block_editor_for_post')) {
                    return false;
                }
                return (bool) use_block_editor_for_post($postId);

            case 'edit.php':
                // List table — not the editor itself.
                return false;

            case 'admin-ajax.php':     // Autosave, legacy metabox, heartbeat — block scripts still expected
            case 'site-editor.php':    // Full-Site Editing
            case 'widgets.php':        // Block-based widgets
            case 'customize.php':      // Block-based customizer parts
                return true;

            default:
                if ($request->isRestRequest()) {
                    return true;
                }

                // Outside wp-admin (front end, cron, CLI) blocks are *rendered*, so
                // their render_callback must be registered - otherwise WP prints the
                // saved static wrapper and every ACPT block comes out empty (#1348).
                return !$this->isAdminPath($request);
        }
    }

    /**
     * Decides on init, priority 20, not while plugins are being included:
     * - isActive() calls use_block_editor_for_post(), whose callbacks (core's and
     *   other plugins') may need pluggable functions and filters that are not
     *   loaded yet at that point (#1385);
     * - post types are registered on init (priority 10), and
     *   use_block_editor_for_post_type() is false for one that does not exist yet:
     *   deciding on plugins_loaded skipped the server-side registration on the
     *   editor of every such post type, GeneratePress Elements and ACPT's own
     *   CPTs included (#1441).
     *
     * @param Request|null $request
     *
     * @return void
     */
    public function run(?Request $request = null): void
    {
        if (did_action('init') && !doing_action('init')) {
            parent::run($request);

            return;
        }

        add_action('init', function () use ($request) {
            parent::run($request);
        }, 20);
    }

    /**
     * @param Request $request
     *
     * @return bool
     */
    private function isAdminPath(Request $request): bool
    {
        $phpSelf = (string) $request->server('PHP_SELF', '');

        return strpos($phpSelf, '/wp-admin/') !== false;
    }

    /**
     * @param string $postType
     *
     * @return bool
     */
    private function canUseBlockEditorForType(string $postType): bool
    {
        if (!function_exists('use_block_editor_for_post_type')) {
            return false;
        }

        return (bool) use_block_editor_for_post_type($postType);
    }

    /**
     * @inheritDoc
     */
    protected function runIntegration(): void
    {
        if (!function_exists('register_block_type')) {
            // Block editor is not available.
            return;
        }

        if (Features::hasMeta()) {
            $this->onInit([new ACPT_Lite_Gutenberg(), 'registerACPTBlocks']);
        }
    }

    /**
     * run() decides during init, after the default priority has fired: a
     * callback hooked on init from there would never run.
     *
     * @param callable $callback
     *
     * @return void
     */
    private function onInit(callable $callback): void
    {
        if (doing_action('init')) {
            $callback();

            return;
        }

        add_action('init', $callback);
    }

    /**
     * Register Gutenberg blocks
     *
     * @return void
     */
    public function registerACPTBlocks(): void
    {
        $generators = [
            BasicBlockGenerator::class,
        ];

        foreach ($generators as $generator) {
            $g = new $generator();
            $g->generate();
        }
    }
}
