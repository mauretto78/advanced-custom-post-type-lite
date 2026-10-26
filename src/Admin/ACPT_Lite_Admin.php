<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Constants\Cookies;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\API\AJAX\Controllers\AbstractController;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Generators\Comment\CommentAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\Comment\CommentMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaBoxGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyMetaGroupsGenerator;
use ACPT_Lite\Core\Generators\User\UserAdminColumnsGenerator;
use ACPT_Lite\Core\Generators\User\UserMetaGroupsGenerator;
use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Core\Shortcodes\ACPT\AttachmentMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\CommentMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\PostMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\TaxonomyMetaShortcode;
use ACPT_Lite\Core\Shortcodes\ACPT\UserMetaShortcode;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Loader;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Integrations\Gutenberg\ACPT_Lite_Gutenberg;
use ACPT_Lite\Integrations\WooCommerce\ACPT_Lite_WooCommerce;
use ACPT_Lite\Utils\PHP\Cookie;
use ACPT_Lite\Utils\PHP\Profiler;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\PHP\Server;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\PHP\Url;
use ACPT_Lite\Utils\Vite\Assets;
use ACPT_Lite\Utils\Wordpress\Comments;
use ACPT_Lite\Utils\Wordpress\Nonce;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/admin
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Admin
{
    /**
     * @var ACPT_Lite_Loader
     */
    private ACPT_Lite_Loader $loader;

    /**
     * @var ACPT_Lite_Ajax
     */
    private ACPT_Lite_Ajax $ajax;

    /**
     * @var array<int, array<string, mixed>>
     */
    private array $pages = [];

    /**
     * @var array<string, string>
     */
    private array $staticCssAssets = [];

    /**
     * @var array<string, mixed>
     */
    private array $staticJsAssets = [];

    /**
     * @var string
     */
    private string $pagenow;

    /**
     * @var array<string, mixed>
     */
    private array $postTypeAndTaxonomyNamesArray = [];

    /**
     * @var Request
     */
    private Request $request;

    /**
     * @param ACPT_Lite_Loader $loader
     * @param Request $request
     * @throws \Exception
     */
    public function __construct(ACPT_Lite_Loader $loader, Request $request)
    {
        $this->request = $request;
        $this->ajax = new ACPT_Lite_Ajax($request);
        $this->loader = $loader;
        $this->pagenow = Url::pagenow();
        $this->postTypeAndTaxonomyNamesArray = MetaRepository::getAllAssociatedPostTypesAndTaxonomies();

        add_action('init', function () {
            $this->setPages();
        });
    }

    /**
     * @throws \Exception
     */
    private function setPages(): void
    {
        $pages = [
            [
                'pageTitle' => 'ACPT Lite',
                'menuTitle' => 'ACPT Lite',
                'capability' => 'manage_options',
                'menuSlug' => ACPT_LITE_PLUGIN_NAME,
                'template' => 'app',
                'iconUrl' => plugins_url('acpt-lite/assets/static/img/acpt-lite-icon.svg'),
                'position' => 50,
            ]
        ];

        if (Features::hasCpt()) {
            $pages[] = [
                'parentSlug' => ACPT_LITE_PLUGIN_NAME,
                'pageTitle' => translate('Custom Post Types', ACPT_LITE_PLUGIN_NAME),
                'menuTitle' => translate('Custom Post Types', ACPT_LITE_PLUGIN_NAME),
                'capability' => 'manage_options',
                'menuSlug' => ACPT_LITE_PLUGIN_NAME,
                'template' => 'app',
                'position' => 51,
            ];
        }

        if (Features::hasTax()) {
            $pages[] = [
                'parentSlug' => ACPT_LITE_PLUGIN_NAME,
                'pageTitle' => translate('Taxonomies', ACPT_LITE_PLUGIN_NAME),
                'menuTitle' => translate('Taxonomies', ACPT_LITE_PLUGIN_NAME),
                'capability' => 'manage_options',
                'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/taxonomies',
                'template' => 'app',
                'position' => 52,
            ];
        }

        if (Features::hasMeta()) {
            $pages[] = [
                'parentSlug' => ACPT_LITE_PLUGIN_NAME,
                'pageTitle' => translate('Field groups', ACPT_LITE_PLUGIN_NAME),
                'menuTitle' => translate('Field groups', ACPT_LITE_PLUGIN_NAME),
                'capability' => 'manage_options',
                'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/meta',
                'template' => 'app',
                'position' => 54,
            ];
        }

        $pages[] = [
            'parentSlug' => ACPT_LITE_PLUGIN_NAME,
            'pageTitle' => translate('Tools', ACPT_LITE_PLUGIN_NAME),
            'menuTitle' => translate('Tools', ACPT_LITE_PLUGIN_NAME),
            'capability' => 'manage_options',
            'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/tools',
            'template' => 'app',
            'position' => 61,
        ];

        $pages[] = [
            'parentSlug' => ACPT_LITE_PLUGIN_NAME,
            'pageTitle' => translate('Settings', ACPT_LITE_PLUGIN_NAME),
            'menuTitle' => translate('Settings', ACPT_LITE_PLUGIN_NAME),
            'capability' => 'manage_options',
            'menuSlug' => ACPT_LITE_PLUGIN_NAME . '#/settings',
            'template' => 'app',
            'position' => 62,
        ];

        $this->pages = $pages;
    }

    public function addPages(): void
    {
        foreach ($this->pages as $page) {
            $this->addPage(
                $page['pageTitle'],
                $page['menuTitle'],
                $page['capability'],
                $page['menuSlug'],
                $page['template'],
                (isset($page['iconUrl'])) ? $page['iconUrl'] : null,
                (isset($page['position'])) ? $page['position'] : null,
                (isset($page['parentSlug'])) ? $page['parentSlug'] : null
            );
        }
    }

    /**
     * @param string      $pageTitle
     * @param string      $menuTitle
     * @param string      $capability
     * @param string      $menuSlug
     * @param string      $template
     * @param string|null $iconUrl
     * @param int|null    $position
     * @param string|null $parentSlug
     */
    private function addPage(string $pageTitle, string $menuTitle, string $capability, string $menuSlug, string $template, ?string $iconUrl = '', ?int $position = null, ?string $parentSlug = null): void
    {
        if ($parentSlug !== null) {
            add_submenu_page(
                $parentSlug,
                $pageTitle,
                $menuTitle,
                $capability,
                $menuSlug,
                function () use ($template) {
                    require_once plugin_dir_path(dirname(__FILE__)) . '../admin/templates/'.$template.'.php';
                },
                $position
            );
        } else {
            add_menu_page(
                $pageTitle,
                $menuTitle,
                $capability,
                $menuSlug,
                function () use ($template) {
                    require_once plugin_dir_path(dirname(__FILE__)) . '../admin/templates/'.$template.'.php';
                },
                $iconUrl,
                $position
            );
        }
    }

    public function enqueueAssets(): void
    {
        // Register assets
        $this->setApplicationAssets();
        $this->setGutenbergBlockAssets();
        $this->setAdminAssets();

        // Nothing above registered any ACPT asset for this screen, so there's
        // nothing here that needs the media picker either. Skips wp_enqueue_media()
        // (and the DB query it triggers) on unrelated wp-admin screens.
        if ( empty( $this->staticCssAssets ) && empty( $this->staticJsAssets ) && ! $this->isACPTAppPage() ) {
            return;
        }

        // Register media
        if (! function_exists('wp_enqueue_media')) {
            require ABSPATH . 'wp-admin/includes/media.php';
        }

        wp_enqueue_media();

        // Enqueue registered CSS assets
        foreach ($this->staticCssAssets as $key => $asset) {
            wp_enqueue_style(ACPT_LITE_PLUGIN_NAME.'__'.$key, $asset, [], ACPT_LITE_PLUGIN_VERSION, 'all');
        }

        // Enqueue registered JS assets
        foreach ($this->staticJsAssets as $key => $asset) {
            if ($asset['module'] === true) {
                // modules
                if (isset($asset['modules']) && is_array($asset['modules'])) {
                    // The modulepreload URL must match the URL the entry module imports:
                    // the minified files import "./foo.min.js?ver=<plugin version>"
                    // (fix-assets-loading.php), the dev sources a plain "./foo.js" (#1413)
                    // @phpstan-ignore-next-line ternary.alwaysFalse
                    $moduleVersion = ACPT_LITE_DEV_MODE ? null : ACPT_LITE_PLUGIN_VERSION;

                    foreach ($asset['modules'] as $module) {
                        wp_register_script_module($module['id'], $module['path'], [], $moduleVersion);
                    }
                }

                wp_enqueue_script_module(ACPT_LITE_PLUGIN_NAME.'__'.$key, $asset['path'], isset($asset['dep']) ? $asset['dep'] : [], ACPT_LITE_PLUGIN_VERSION);
            } else {
                wp_enqueue_script(ACPT_LITE_PLUGIN_NAME.'__'.$key, $asset['path'], isset($asset['dep']) ? $asset['dep'] : [], ACPT_LITE_PLUGIN_VERSION, true);
            }
        }

        // Validator
        if ($this->pagenow === 'post-new.php' || $this->pagenow === 'post.php') {
            $customPostTypeMetaBoxGenerator = new CustomPostTypeMetaBoxGenerator();
            $customPostTypeMetaBoxGenerator->enqueueScripts('save-cpt');
        }
    }

    /**
     * WP core's wp_enqueue_media() runs an uncached "SELECT DISTINCT YEAR/MONTH ...
     * WHERE post_type = 'attachment'" query on every single call to populate the
     * media library's date-filter dropdown (see the `media_library_months_with_files`
     * filter doc in wp-includes/media.php, and https://core.trac.wordpress.org/ticket/31071).
     * Core provides this filter specifically so plugins can bypass that query; we
     * serve a transient instead and only recompute it when the media library changes.
     *
     * @param array<array<string, int>>|null $months
     * @return array<array<string, int>>
     */
    public function getCachedMediaLibraryMonths(?array $months): array
    {
        if (is_array($months)) {
            return $months;
        }

        $cached = get_transient('acpt_lite_media_library_months');

        if ($cached !== false) {
            return $cached;
        }

        global $wpdb;

        $months = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT DISTINCT YEAR( post_date ) AS year, MONTH( post_date ) AS month
                FROM $wpdb->posts
                WHERE post_type = %s
                ORDER BY post_date DESC",
                'attachment'
            )
        );

        set_transient('acpt_lite_media_library_months', $months, DAY_IN_SECONDS);

        return $months;
    }

    /**
     * Invalidate the media library months cache whenever an attachment is added, edited or deleted
     */
    public function invalidateMediaLibraryMonthsCache(): void
    {
        delete_transient('acpt_lite_media_library_months');
    }

    private function setApplicationAssets(): void
    {
        if ($this->isACPTAppPage()) {
            $viteAssets = Assets::load('assets/src/App/index.jsx', 'acpt_app');

            foreach ($viteAssets['css'] as $viteCssAssetKey => $viteCssAsset) {
                $this->staticCssAssets[$viteCssAssetKey] = $viteCssAsset;
            }

            foreach ($viteAssets['js'] as $viteJsAssetKey => $viteJsAsset) {
                wp_localize_script(ACPT_LITE_PLUGIN_NAME.'__'.$viteJsAssetKey, 'acpt_lite', ['pluginsUrl' => plugins_url()]);
                $this->staticJsAssets[$viteJsAssetKey] = [
                        'path' => $viteJsAsset,
                        'module' => true,
                        'dep'  => [],
                ];
            }
        }
    }

    private function setGutenbergBlockAssets(): void
    {
        $screen = get_current_screen();

        if ($screen !== null && $screen->is_block_editor === true) {
            $viteAssets = Assets::load('assets/src/Gutenberg/index.jsx', 'block_js');

            foreach ($viteAssets['css'] as $viteCssAssetKey => $viteCssAsset) {
                $this->staticCssAssets[$viteCssAssetKey] = $viteCssAsset;
            }

            foreach ($viteAssets['js'] as $viteJsAssetKey => $viteJsAsset) {
                $this->staticJsAssets[$viteJsAssetKey] = [
                        'path' => $viteJsAsset,
                        'module' => true,
                        'dep'  => [],
                ];
            }
        }
    }

    private function setAdminAssets(): void
    {
        // no option pages or table record pages in Lite
        if ($this->pagenow === 'admin.php' && isset($_GET['page'])) {
            return;
        }

        // allowed pages
        $allowedPages = [
            'site-editor.php',
            'post-new.php',
            'edit.php',
            'post.php',
            'profile.php',
            'user-edit.php',
            'edit-tags.php',
            'term.php',
            'upload.php',
            'admin.php',
            'comment.php',
            'edit-comments.php',
        ];

        if (
            (in_array($this->pagenow, $allowedPages)) &&
            !$this->isACPTAppPage()
        ) {
            // CSS
            $this->staticCssAssets = [
                'admin_selectize_css' => plugins_url('acpt-lite/assets/vendor/selectize/selectize.default.min.css'),
                'admin_css' => $this->assetPath("admin.css"),
            ];

            // JS
            $this->staticJsAssets['admin_selectize_js'] = [
                'path' => plugins_url('acpt-lite/assets/vendor/selectize/selectize.min.js'),
                'module' => false,
                'dep'  => [],
            ];

            $this->staticJsAssets['admin_js'] = [
                'path' => $this->assetPath("admin.js"),
                'module' => true,
                'modules' => [
                    [
                        'id' => 'admin_commons_js',
                        'path' => $this->assetPath("_admin_commons.js"),
                    ],
                    [
                        'id' => 'admin_datepicker_js',
                        'path' => $this->assetPath("_admin_datepicker.js"),
                    ],
                    [
                        'id' => 'admin_helpers_js',
                        'path' => $this->assetPath("_admin_helpers.js"),
                    ],
                    [
                        'id' => 'admin_misc_js',
                        'path' => $this->assetPath("_admin_misc.js"),
                    ],
                    [
                        'id' => 'admin_woocommerce_js',
                        'path' => $this->assetPath("_admin_woocommerce.js"),
                    ],
                ],
                'dep'  => [
                    'admin_commons_js',
                    'admin_datepicker_js',
                    'admin_helpers_js',
                    'admin_misc_js',
                    'admin_woocommerce_js',
                ],
            ];

            if ($this->pagenow === "edit-comments.php") {
                $this->staticJsAssets['comment_quick_edit_js'] = [
                    'path' => $this->assetPath("comment-quick-edit.js"),
                    'module' => false,
                    'dep'  => [],
                ];
            }

            if ($this->pagenow === 'edit.php') {
                $this->staticJsAssets['quick_edit_js'] = [
                    'path' => $this->assetPath('quick_edit.js'),
                    'module' => false,
                    'dep'  => [],
                ];
            }

            //
            // =================================
            // WP DEFAULT UTILITIES
            // =================================
            //

            // color picker
            wp_enqueue_style('wp-color-picker');
            wp_enqueue_script('wp-color-picker');

            // codemirror
            $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('type' => 'text/html'));
            wp_localize_script('jquery', 'cm_settings', $cm_settings);
            wp_enqueue_script('wp-theme-plugin-editor');
            wp_enqueue_style('wp-codemirror');

            //
            // =================================
            // ICONIFY
            // =================================
            //
            wp_register_script('iconify', plugins_url('acpt-lite/assets/vendor/iconify/iconify.min.js'));
            wp_enqueue_script('iconify');
        }
    }

    /**
     * @param string $asset
     * @return string
     */
    private function assetPath(string $asset): string
    {
        $pathinfo = pathinfo($asset);
        $extension = isset($pathinfo['extension']) ? $pathinfo['extension'] : '' ;
        $filename = $pathinfo['filename'];
        $baseDir = 'acpt-lite/assets/static/';

        // @phpstan-ignore-next-line ternary.alwaysFalse
        return plugins_url(ACPT_LITE_DEV_MODE ? $baseDir.$extension.'/'.$filename.'.'.$extension : $baseDir.$extension.'/'.$filename.'.min.'.$extension);
    }

    /**
     * @param string   $new_status
     * @param string   $old_status
     * @param \WP_Post $post
     */
    public function invalidPostIdsCache(string $new_status, string $old_status, \WP_Post $post): void
    {
        $allowedStatus = [
            'draft',
            'publish',
            'private',
            'auto-draft',
            'inherit'
        ];

        if (
            in_array($new_status, $allowedStatus) &&
            in_array($old_status, $allowedStatus)
        ) {
            ACPT_Lite_DB::invalidateCacheTag(CustomPostTypeMetaGroupsGenerator::class);
        }
    }

    /**
     * @return void
     */
    public function addFilters(): void
    {
        add_filter('plugin_action_links', [ $this, 'addPluginLinks' ], PHP_INT_MAX, 2);
        add_filter('script_loader_tag', [$this, 'addAsyncDeferAttribute'], 10, 2);
        add_filter('block_categories_all', [$this, 'addGutenbergBlocks'], 10, 2);
        add_filter('safe_style_css', [$this, 'allowCSSAttributes'], 10, 1);
        add_filter('kses_allowed_protocols', [$this, 'addDataProtocol'], 10, 1);
    }

    /**
     * @see https://wordpress.stackexchange.com/questions/173526/why-is-wp-kses-not-keeping-style-attributes-as-expected/195433#195433
     *
     * @param array<int, string> $styles
     * @return array<int, string>
     */
    public function allowCSSAttributes(array $styles): array
    {
        $styles[] = 'fill';
        $styles[] = 'transform';

        return $styles;
    }

    /**
     * @param array<int, string> $protocols
     * @return array<int, string>
     */
    public function addDataProtocol(array $protocols): array
    {
        $protocols[] = 'data';

        return $protocols;
    }

    /**
     * @param array<string, string> $actions
     * @param string                $plugin_file
     * @return array<string, string>
     */
    public function addPluginLinks(array $actions, string $plugin_file): array
    {
        $actionLinks = [];

        if ('acpt-lite/acpt-lite.php' === $plugin_file) {
            $actionLinks['settings'] = '<a href="'.admin_url('admin.php?page='.ACPT_LITE_PLUGIN_NAME.'#/settings').'">'.Translator::translate('Settings').'</a>';
            $actionLinks['documentation'] = '<a target="_blank" href="https://docs.acpt.io/">'.Translator::translate('Documentation').'</a>';
            $actionLinks['go_pro'] = '<a target="_blank" style="color:#02c39a;font-weight:700;" href="https://acpt.io/checkout/?utm_source=acpt-lite&utm_medium=plugin&utm_campaign=plugins-list">'.Translator::translate('Go PRO').'</a>';
        }

        return array_merge($actionLinks, $actions);
    }

    /**
     * @param array<int, mixed>             $block_categories
     * @param \WP_Block_Editor_Context|null $block_editor_context
     * @return array<int, mixed>
     */
    public function addGutenbergBlocks(array $block_categories, ?\WP_Block_Editor_Context $block_editor_context = null): array
    {
        if (empty($block_editor_context)) {
            return $block_categories;
        }

        $category_slugs = wp_list_pluck($block_categories, 'slug');

        return in_array('acpt-lite-blocks', $category_slugs, true) ? $block_categories : array_merge(
            $block_categories,
            [
                [
                    'slug'  => 'acpt-lite-blocks',
                    'title' => __('ACPT Blocks', 'acpt-lite-blocks'),
                    'icon'  => null,
                ]
            ]
        );
    }

    /**
     * @param string $tag
     * @param string $handle
     * @return string
     */
    public function addAsyncDeferAttribute(string $tag, string $handle): string
    {
        if ('google-maps' !== $handle) {
            return $tag;
        }

        return str_replace(' src', ' async defer src', $tag);
    }

    /**
     * Add shortcodes
     *
     * @return void
     */
    private function addShortcodes(): void
    {
        add_shortcode('acpt', [new PostMetaShortcode(), 'render']);
        add_shortcode('acpt_user', [new UserMetaShortcode(), 'render']);
        add_shortcode('acpt_tax', [new TaxonomyMetaShortcode(), 'render']);
        add_shortcode('acpt_media', [new AttachmentMetaShortcode(), 'render']);
        add_shortcode('acpt_comm', [new CommentMetaShortcode(), 'render']);

    }

    /**
     * @param bool $isACPTAppPage
     * @return void
     */
    private function addACTPClassToBody(bool $isACPTAppPage = false): void
    {
        if ($isACPTAppPage) {
            add_filter('admin_body_class', function ($classes) {
                $classes .= " acpt";

                if (Features::skin() === 'dark') {
                    $classes .= "-dark";
                }

                return $classes;
            });
        }
    }

    /**
     * @param bool $lazy
     * @throws \Exception
     */
    private function registerCustomPostTypesAndTaxonomies(bool $lazy = false): void
    {
        // run this code after all plugins are loaded
        try {
            $postTypeMetaGroups = [];

            // prevents any orphan meta box/field
            MetaRepository::removeOrphanBoxesAndFields();

            // generate meta groups
            if ($lazy === false) {
                // enable savePost function only on post and quick edit pages
                $allowedPages = [
                    'admin.php',
                    'admin-ajax.php',
                    'edit.php',
                    'post.php',
                    'post-new.php',
                    'upload.php',
                ];

                // enable rendering of meta fields only on post (or new post) page
                $metaRendering = in_array($this->pagenow, [
                    'post.php',
                    'post-new.php',
                    'upload.php',
                ]);

                $postTypeAssociatedWithGroup = $this->postTypeAndTaxonomyNamesArray['postTypeNames'] ?? [];
                $registeredACPTPostTypeNames = CustomPostTypeRepository::getNames();
                $postTypeNames = array_unique(array_merge($postTypeAssociatedWithGroup, $registeredACPTPostTypeNames));

                foreach ($postTypeNames as $postTypeName) {
                    if (is_string($postTypeName)) {
                        $metaGroupModels = (new FetchMetaGroupsQuery([
                            'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                            'find' => $postTypeName,
                            'clonedFields' => true,
                            'cct' => true
                        ]))->execute();

                        if (!empty($metaGroupModels) && Features::hasMeta()) {
                            $postTypeMetaGroupsGenerator = new CustomPostTypeMetaGroupsGenerator($postTypeName, $metaGroupModels);
                            $postTypeMetaGroups[$postTypeName] = $postTypeMetaGroupsGenerator->generate($metaRendering);
                        }

                        // register the "save_post" hook for all custom post types
                        if (in_array($this->pagenow, $allowedPages)) {
                            // Handle save post functions
                            $metaGroups = $postTypeMetaGroups[$postTypeName] ?? [];

                            // can't use a filter here, because integration are not yet running
                            if (ACPT_Lite_WooCommerce::active() && $postTypeName === 'shop_order') {
                                $hookName = 'woocommerce_process_shop_order_meta';
                            } else {
                                $hookName = 'save_post_'.$postTypeName;
                            }

                            add_action($hookName, function ($postId) use ($metaGroups, $postTypeName) {
                                WPUtils::handleSavePost((int)$postId, $postTypeName, $metaGroups);
                            });
                        }
                    }
                }

                // Single transition_post_status listener replaces the 7 × N nested
                // admin_init → {status}_{posttype} loop that previously registered
                // one hook per (post type, status) pair.
                if (in_array($this->pagenow, $allowedPages) && !empty($postTypeNames)) {
                    $managedPostTypes = array_fill_keys(array_filter($postTypeNames, 'is_string'), true);
                    $statusesToFlush = ['trash', 'publish', 'pending', 'draft', 'delete', 'future', 'private'];

                    add_action('transition_post_status', function ($new_status, $old_status, $post) use ($managedPostTypes, $statusesToFlush) {
                        if (!$post || !isset($managedPostTypes[$post->post_type])) {
                            return;
                        }
                        if (in_array($new_status, $statusesToFlush, true) || in_array($old_status, $statusesToFlush, true)) {
                            Posts::invalidPostsByTypeQueryCache($post->post_type);
                            Posts::invalidCache();
                        }
                    }, 10, 3);
                }
            }

            // register here ACTP CPTs and Taxonomies
            foreach (CustomPostTypeRepository::get() as $postTypeModel) {
                $postTypeName = $postTypeModel->getName();
                $customPostType = new CustomPostTypeGenerator($postTypeModel);
            }

            // invalid attachments cache
            add_action("attachment_updated", function ($postId, $post_after, $post_before) {
                $attachment = WPAttachment::fromId($postId);

                WPAttachment::invalidCache($attachment->getId());
                WPAttachment::invalidCache($attachment->getSrc());
            }, 10, 3);

            // invalid comments cache on create, update, delete
            add_action('comment_post', function () {
                Comments::invalidCache();
            }, 10, 0);
            add_action('edit_comment', function () {
                Comments::invalidCache();
            }, 10, 0);
            add_action('deleted_comment', function () {
                Comments::invalidCache();
            }, 10, 0);
            add_action('wp_set_comment_status', function () {
                Comments::invalidCache();
            }, 10, 0);
        } catch (\Exception $exception) {
            // do nothing
            do_action("acpt/error", $exception);
        }
    }

    private function registerCommentMeta(): void
    {
        (new CommentMetaGroupsGenerator())->generate();
    }

    private function addCommentColumnsToAdminPanel(): void
    {
        CommentAdminColumnsGenerator::addColumns();
    }

    /**
     * @throws \Exception
     */
    private function registerTaxonomyMeta(): void
    {
        (new TaxonomyMetaGroupsGenerator())->generate();
    }

    /**
     * @throws \Exception
     */
    private function addCustomPostTypeColumnsToAdminPanel(): void
    {
        $acptPostTypes = CustomPostTypeRepository::get();
        $postTypesAssociatedWithGroup = $this->postTypeAndTaxonomyNamesArray['postTypeNames'] ?? [];
        $notACPTPostTypes = $postTypesAssociatedWithGroup;

        foreach ($acptPostTypes as $postTypeModel) {
            CustomPostTypeAdminColumnsGenerator::addColumns($postTypeModel);

            if (($key = array_search($postTypeModel->getName(), $notACPTPostTypes)) !== false) {
                unset($notACPTPostTypes[$key]);
            }
        }

        foreach ($notACPTPostTypes as $notACPTPostType) {
            if (is_string($notACPTPostType)) {
                CustomPostTypeAdminColumnsGenerator::addColumns($notACPTPostType);
            }
        }
    }

    /**
     * @throws \Exception
     */
    private function addTaxonomyColumnsToAdminPanel(): void
    {
        $acptTaxonomies = TaxonomyRepository::get();
        $taxonomiesAssociatedWithGroup = $this->postTypeAndTaxonomyNamesArray['taxonomyNames'] ?? [];
        $notACPTTaxonomies = $taxonomiesAssociatedWithGroup;

        foreach ($acptTaxonomies as $taxonomyModel) {
            TaxonomyAdminColumnsGenerator::addColumns($taxonomyModel);

            if (($key = array_search($taxonomyModel->getSlug(), $notACPTTaxonomies)) !== false) {
                unset($notACPTTaxonomies[$key]);
            }
        }

        foreach ($notACPTTaxonomies as $notACPTTaxonomy) {
            if (is_string($notACPTTaxonomy)) {
                TaxonomyAdminColumnsGenerator::addColumns($notACPTTaxonomy);
            }
        }
    }

    /**
     * @throws \Exception
     */
    private function registerUserMeta(): void
    {
        (new UserMetaGroupsGenerator())->generate();
    }

    private function addUserMetaColumnsToShow(): void
    {
        UserAdminColumnsGenerator::addColumns();
    }

    /**
     * @return void
     */
    private function registerRestFields(): void
    {
        $this->loader->addAction('rest_api_init', new ACPT_Lite_Api_Rest_Fields($this->request), 'registerRestFields');
    }

    /**
     * @return void
     */
    private function includeFunctions(): void
    {
        require_once ACPT_LITE_PLUGIN_DIR_PATH.'/functions/acpt_functions.php';
    }

    /**
     * @return void
     */
    private function runIntegrations(): void
    {
        $integrations = [
            ACPT_Lite_Gutenberg::class,
            ACPT_Lite_WooCommerce::class,
        ];

        foreach ($integrations as $integration) {
            $instance = new $integration();

            $instance->run(ACPT_Lite_Plugin::getRequest());

            Profiler::lap('runIntegrations');
        }
    }

    /**
     * @param resource $curlhandle
     */
    public function curlBeforeRequest($curlhandle): void
    {
        Session::close();
    }

    /**
     * @param int $timeout
     * @return int
     */
    public function extendHttpRequestTimeout(int $timeout): int
    {
        return 30;
    }

    public function fetchAdminMenu(): void
    {
        $home = get_option('home');
        $pluginsUrl = plugins_url();

        if (Server::isSecure()) {
            $home = Url::secureUrl($home);
            $pluginsUrl = Url::secureUrl($pluginsUrl);
        }

        wp_register_script('globals-menu-run', '', [], '', true);
        wp_enqueue_script('globals-menu-run');

        $menuJson = json_encode($GLOBALS['menu']);
        $menuJsonString = is_string($menuJson) ? $menuJson : '[]';

        wp_add_inline_script('globals-menu-run', '
            document.globals = {
                site_url: "'.$home.'", 
                plugins_url: "'.$pluginsUrl.'", 
                menu: '. $menuJsonString .', 
                nonce: "'.Nonce::create().'"
            };
		');
    }

    /**
     * @return bool
     */
    private function isACPTAppPage(): bool
    {
        return (
            $this->pagenow === 'admin.php' &&
            isset($_GET['page']) &&
            $_GET['page'] === ACPT_LITE_PLUGIN_NAME
        );
    }

    public function displayNotice(): void
    {
        // Only a page load prints admin notices: an AJAX, REST or form POST request
        // (e.g. the block editor saving its meta boxes, or the heartbeat) used to
        // consume the cookie, and the errors were never shown (#1416)
        $isPageLoad = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' &&
            !wp_doing_ajax() &&
            !wp_is_json_request() &&
            strpos((string)($_SERVER['REQUEST_URI'] ?? ''), '/'.rest_get_url_prefix().'/') === false &&
            !isset($_GET['rest_route']);

        if (!$isPageLoad) {
            return;
        }

        $messages = Cookie::get(Cookies::ACPT_ERRORS);

        if (!empty($messages)) {
            foreach ((is_array($messages) ? $messages : []) as $message) {
                if (!is_array($message)) {
                    continue;
                }

                add_action('admin_notices', function () use ($message) {
                    ?>
                    <div id="acpt-message-<?php echo Strings::generateRandomId(); ?>" class="notice notice-<?php echo esc_attr((string)($message['level'] ?? 'warning')); ?> is-dismissible">
                        <p><?php echo wp_kses_post((string)($message['message'] ?? '')); ?></p>
                    </div>
                    <script>
                        // the block editor hides the admin notices: show it in its own notices
                        (function (status, text) {
                            window.addEventListener('load', function () {
                                try {
                                    if (window.wp && wp.data && wp.data.select('core/editor')) {
                                        wp.data.dispatch('core/notices').createNotice(status, text, {isDismissible: true});
                                    }
                                } catch (e) {}
                            });
                        })(<?php echo wp_json_encode(($message['level'] ?? '') === 'error' ? 'error' : 'warning'); ?>, <?php echo wp_json_encode(html_entity_decode(wp_strip_all_tags((string)($message['message'] ?? '')), ENT_QUOTES)); ?>);
                    </script>
                    <?php
                });
            }

            Cookie::delete(Cookies::ACPT_ERRORS);
        }
    }

    /**
     * @throws \Exception
     */
    public function run(): void
    {
        $isACPTAppPage  = $this->isACPTAppPage();

        $this->displayNotice();

        // filters
        Profiler::start('addFilters');
        $this->addFilters();
        Profiler::stop('addFilters');

        // pages and assets
        Profiler::start('addPages');
        $this->loader->addAction('admin_menu', $this, 'addPages');
        Profiler::stop('addPages');

        Profiler::start('enqueueAssets');
        $this->loader->addAction('admin_enqueue_scripts', $this, 'enqueueAssets');
        Profiler::stop('enqueueAssets');

        // cache the media library "date filter" dropdown data that wp_enqueue_media()
        // otherwise recomputes with an uncached DB query on every call
        Profiler::start('cacheMediaLibraryMonths');
        add_filter('media_library_months_with_files', [$this, 'getCachedMediaLibraryMonths']);
        $this->loader->addAction('add_attachment', $this, 'invalidateMediaLibraryMonthsCache');
        $this->loader->addAction('edit_attachment', $this, 'invalidateMediaLibraryMonthsCache');
        $this->loader->addAction('delete_attachment', $this, 'invalidateMediaLibraryMonthsCache');
        Profiler::stop('cacheMediaLibraryMonths');

        // admin menu
        if (Features::hasAdminMenu()) {
            Profiler::start('generateAdminBarMenu');
            $this->loader->addAction('admin_bar_menu', new ACPT_Lite_Admin_Bar_Menu(), 'generate', 100);
            Profiler::stop('generateAdminBarMenu');
        }

        // admin_bar_menu
        Profiler::start('fetchAdminMenu');
        $this->loader->addAction('admin_menu', $this, 'fetchAdminMenu');
        Profiler::start('fetchAdminMenu');

        // run the application
        Profiler::start('transitionPostStatus');
        $this->loader->addAction('transition_post_status', $this, 'invalidPostIdsCache', 10, 3);
        Profiler::stop('transitionPostStatus');

        Profiler::start('siteHealth');
        $this->loader->addAction('requests-curl.before_request', $this, 'curlBeforeRequest', 9999);
        $this->loader->addAction('http_request_timeout', $this, 'extendHttpRequestTimeout');
        Profiler::stop('siteHealth');

        // ajax calls
        Profiler::start('ajaxCalls');

        foreach ($this->ajax->routes() as [$action, $controllerClass, $method, $middlewares]) {
            /** @var AbstractController $controller */
            $controller = new $controllerClass($this->request);

            if (is_callable([$controller, $method])) {
                $controller->setAction($action);
                $controller->setMethod($method);

                foreach ($middlewares as $middleware) {
                    $controller->addMiddleware($middleware);
                }

                $this->loader->addAction($action, $controller, 'handleRequest');
                Profiler::lap('ajaxCalls');
            }
        }

        Profiler::stop('ajaxCalls');

        // register custom post types and taxonomies. Lazy load custom post type metas
        Profiler::start('registerCustomPostTypesAndTaxonomies');
        $this->registerCustomPostTypesAndTaxonomies($isACPTAppPage);
        Profiler::stop('registerCustomPostTypesAndTaxonomies');

        // API REST
        Profiler::start('RestFieldsAndEndpoints');
        $this->registerRestFields();
        Profiler::stop('RestFieldsAndEndpoints');

        // add ACPT class body
        if (is_admin()) {
            Profiler::start('addACTPClassToBody');
            $this->addACTPClassToBody($isACPTAppPage);
            Profiler::stop('addACTPClassToBody');
        }

        // lazy load, these functions are not needed in App page
        if (!$isACPTAppPage) {
            // shortcodes
            Profiler::start('addShortcodes');
            $this->addShortcodes();
            Profiler::stop('addShortcodes');

            if (Features::hasMeta()) {
                // register comments meta
                Profiler::start('registerCommentMeta');
                $this->registerCommentMeta();
                Profiler::stop('registerCommentMeta');

                // add columns to show in the list panel
                if (is_admin()) {
                    Profiler::start('addCommentColumnsToAdminPanel');
                    $this->addCommentColumnsToAdminPanel();
                    Profiler::stop('addCommentColumnsToAdminPanel');
                }

                // register taxonomy meta
                Profiler::start('registerTaxonomyMeta');
                $this->registerTaxonomyMeta();
                Profiler::stop('registerTaxonomyMeta');

                // add columns to show in the CPT list panel
                if (is_admin()) {
                    Profiler::start('addCustomPostTypeColumnsToAdminPanel');
                    $this->addCustomPostTypeColumnsToAdminPanel();
                    Profiler::stop('addCustomPostTypeColumnsToAdminPanel');

                    // add columns to show in the taxonomy list panel
                    Profiler::start('addTaxonomyColumnsToAdminPanel');
                    $this->addTaxonomyColumnsToAdminPanel();
                    Profiler::stop('addTaxonomyColumnsToAdminPanel');
                }

                // register user meta
                Profiler::start('registerUserMeta');
                $this->registerUserMeta();
                Profiler::stop('registerUserMeta');

                // add user meta columns to show in the admin panel
                if (is_admin()) {
                    Profiler::start('addUserMetaColumnsToShow');
                    $this->addUserMetaColumnsToShow();
                    Profiler::stop('addUserMetaColumnsToShow');
                }
            }

            // functions and hooks
            Profiler::start('includeFunctions');
            $this->includeFunctions();
            Profiler::stop('includeFunctions');

            // run integrations
            Profiler::start('runIntegrations');
            $this->runIntegrations();
            Profiler::stop('runIntegrations');
        }
    }
}
