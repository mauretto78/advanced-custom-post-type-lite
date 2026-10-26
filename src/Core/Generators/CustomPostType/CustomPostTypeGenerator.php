<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Taxonomy\TaxonomyGenerator;
use ACPT_Lite\Core\Helper\Features;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

/**
 * *************************************************
 * CustomPostTypeGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class CustomPostTypeGenerator extends AbstractGenerator
{
    /**
     * @var CustomPostTypeModel
     */
    private CustomPostTypeModel $postTypeModel;

    /**
     * The name of the post type.
     * @var string
     */
    private string $postTypeName;

    /**
     * @var bool
     */
    private bool $isNative;

    /**
     * A list of user-specific options for the post type.
     * @var array<string, mixed>
     */
    private array $postTypeArgs = [];

    /**
     * @var bool
     */
    private bool $isWooCommerce = false;

    /**
     * Sets default values, registers the passed post type, and
     * listens for when the post is saved.
     *
     * @param CustomPostTypeModel $postTypeModel
     */
    public function __construct(CustomPostTypeModel $postTypeModel)
    {
        $this->postTypeModel = $postTypeModel;
        $this->isWooCommerce = $postTypeModel->isWooCommerce();
        $this->postTypeName = strtolower($postTypeModel->getName());
        $this->isNative = $postTypeModel->isNative();

        $this->init([&$this, "registerPostType"]);
        $this->postTypeLink([&$this, "rewritePostTypePermalinks"]);

        add_action('admin_notices', [$this, 'legacyAdminNotices' ]);
    }

    /**
     * Unregisters a post type in the WP db.
     */
    public function unregisterPostType(): void
    {
        unregister_post_type(ucwords($this->postTypeName));
    }

    /**
     * Registers a new post type in the WP db.
     */
    public function registerPostType(): void
    {
        try {
            $taxonomyNames = [];

            $this->postTypeArgs = array_merge(
                [
                    'supports' => $this->postTypeModel->getSupports(),
                    'label' => $this->postTypeModel->getPlural(),
                    'labels' => $this->postTypeModel->getLabels(),
                    "menu_icon" => $this->postTypeModel->renderIcon(),
                ],
                $this->postTypeModel->getSettings()
            );

            // register taxonomies first
            if (Features::hasTax()) {
                $taxonomies = TaxonomyRepository::get([
                    'customPostType' => $this->postTypeName
                ]);

                foreach ($taxonomies as $taxonomyModel) {
                    if (!$taxonomyModel->isNative()) {
                        if (!in_array($taxonomyModel->getSlug(), ReservedTerms::list())) {
                            $taxonomyGenerator = new TaxonomyGenerator($taxonomyModel);
                            $taxonomyGenerator->registerTaxonomy();
                        }
                    } else {
                        register_taxonomy_for_object_type($taxonomyModel->getSlug(), $this->postTypeName);
                    }

                    $taxonomyNames[] = $taxonomyModel->getSlug();
                }
            }

            // register custom post type if not native and is not WooCommerce
            // (WooCommerce product cpt does not need to be registered twice)
            if (Features::hasCPT()) {
                if (!$this->isNative && !$this->isWooCommerce) {
                    $n = ucwords($this->postTypeName);
                    $n = str_replace("_", " ", $n);

                    // Fallback label text, used only when $this->postTypeArgs['labels'] is still
                    // empty below - prefer the user-facing singular (properly cased, whatever
                    // the caller typed) over $n (derived from the post type slug).
                    $fallbackSingular = Translator::translateString($this->postTypeModel->getSingular()) ?: $n;

                    $args = [
                        "label" => $n,
                        'singular_name' => $n,
                        'labels' => [
                            'add_new_item' => 'Add ' . $fallbackSingular,
                            'add_new' => 'Add ' . $fallbackSingular,
                            'view_item' => 'View ' . $fallbackSingular,
                            'search_items' => 'Search ' . $fallbackSingular,
                            'edit_item' => 'Modify ' . $fallbackSingular,
                            'not_found' => 'No ' . $fallbackSingular . ' was found'
                        ],
                        "public" => true,
                        "publicly_queryable" => true,
                        "query_var" => true,
                        "menu_icon" => "dashicons-admin-site-alt3",
                        "rewrite" => true,
                        "capability_type" => 'post',
                        "hierarchical" => false,
                        "menu_position" => null,
                        "supports" => ["title", "editor", "thumbnail"],
                        'has_archive' => false,
                        "show_in_rest" => true,
                        'taxonomies' => $taxonomyNames
                    ];

                    // custom_rewrite takes priority; fall back to front_url_prefix when set to a
                    // non-default value, so the registered rewrite slug matches what the admin
                    // Slug panel/permalink preview already promises via rewritePostTypePermalinks().
                    $rewriteSlug = null;

                    if (!empty($this->postTypeArgs['custom_rewrite']) && $this->postTypeArgs['custom_rewrite'] !== $this->postTypeName) {
                        $rewriteSlug = $this->postTypeArgs['custom_rewrite'];
                    } elseif (!empty($this->postTypeArgs['front_url_prefix']) && $this->postTypeArgs['front_url_prefix'] !== $this->postTypeName && $this->postTypeArgs['front_url_prefix'] !== $this->postTypeArgs['custom_rewrite']) {
                        $rewriteSlug = $this->postTypeArgs['front_url_prefix'];
                    }

                    if (isset($this->postTypeArgs['rewrite']) && !empty($this->postTypeArgs['rewrite']) && !empty($rewriteSlug)) {
                        $this->postTypeArgs['rewrite'] = [
                            'slug' => $rewriteSlug,
                        ];
                    }

                    // with_front
                    if (isset($this->postTypeArgs['with_front'])) {
                        if (!isset($this->postTypeArgs['rewrite']) || !is_array($this->postTypeArgs['rewrite'])) {
                            $this->postTypeArgs['rewrite'] = [];
                        }

                        $this->postTypeArgs['rewrite']['with_front'] = $this->postTypeArgs['with_front'];
                    }

                    // feeds: register_post_type() defaults rewrite.feeds to has_archive, so
                    // every post type with an archive gets /{slug}/feed/ (#1427)
                    if ($this->feedsDisabled() && !empty($this->postTypeArgs['rewrite'])) {
                        if (!is_array($this->postTypeArgs['rewrite'])) {
                            $this->postTypeArgs['rewrite'] = [];
                        }

                        $this->postTypeArgs['rewrite']['feeds'] = false;
                    }

                    // Use the translated strings
                    $this->postTypeArgs['label'] = Translator::translateString($this->postTypeModel->getPlural());
                    $this->postTypeArgs['singular_name'] = Translator::translateString($this->postTypeModel->getSingular());

                    $labelsArray = [
                        'menu_name',
                        'all_items',
                        'add_new',
                        'add_new_item',
                        'edit_item',
                        'new_item',
                        'view_item',
                        'view_items',
                        'search_item',
                        'not_found',
                        'not_found_in_trash',
                        'filter_items_list',
                        'items_list_navigation',
                        'items_list',
                        'item_published',
                        'item_published_privately',
                        'item_reverted_to_draft',
                        'item_scheduled',
                        'item_updated',
                    ];

                    foreach ($labelsArray as $label) {
                        if (isset($this->postTypeModel->getLabels()[$label])) {
                            $this->postTypeArgs['labels'][$label] = Translator::translateString($this->postTypeModel->getLabels()[$label]);
                        }

                        // copy `menu_name` into `name`
                        if (isset($this->postTypeArgs['labels']['menu_name'])) {
                            $this->postTypeArgs['labels']['name'] = $this->postTypeArgs['labels']['menu_name'];
                        }
                    }

                    // Take user provided options, and override the defaults. array_merge()
                    // replaces 'labels' wholesale rather than merging it, so a caller who
                    // supplies no labels (or only some of them) would otherwise lose the
                    // fallback labels above entirely and fall through to WP core's fully
                    // generic "Add Post"/"Edit Post" text - re-merge labels specifically so
                    // user-supplied keys still win, but everything else keeps the fallback.
                    $fallbackLabels = $args['labels'];
                    $args = array_merge($args, $this->postTypeArgs);
                    $args['labels'] = array_merge($fallbackLabels, $this->postTypeArgs['labels'] ?? []);

                    // SVG icons
                    if (Strings::isUrl($args['menu_icon'])) {
                        $attachment = WPAttachment::fromUrl($args['menu_icon']); //40080
                        if ($attachment->isSVG()) {
                            $content = file_get_contents($attachment->getPath());

                            if ($content === false) {
                                $content = '';
                            }

                            $args['menu_icon'] = 'data:image/svg+xml;base64,' . base64_encode($content);
                        }
                    }

                    // register post type only if does not exists
                    if (!post_type_exists($this->postTypeName)) {

                        // Empty supports
                        if (empty($args['supports'])) {
                            $args['supports'] = [""];
                        }

                        // Empty hierarchical
                        if (empty($args['hierarchical'])) {
                            $args['hierarchical'] = false;
                        }

                        // Fix for preventing this warning:
                        // avoid strip_tags(): Passing null to parameter #1 ($string) of type string is deprecated
                        if ($args['query_var'] === null) {
                            $args['query_var'] = '';
                        }

                        if (empty($this->postTypeName)) {
                            throw new \Exception("Post type name cannot be empty");
                        }

                        register_post_type(strtolower($this->postTypeName), $args);

                        // Manually add settings
                        if (isset($args['settings'])) {
                            foreach ($args['settings'] as $setting) {
                                if (!post_type_supports($this->postTypeName, $setting)) {
                                    add_post_type_support($this->postTypeName, $setting);
                                }
                            }
                        }

                        // Without the feed permalinks WordPress still links and serves the
                        // archive feed as ?feed=rss2: hide the link and redirect that URL too
                        if ($this->feedsDisabled()) {
                            add_filter('feed_links_extra_show_post_type_archive_feed', [$this, 'showArchiveFeedLink']);
                            add_action('template_redirect', [$this, 'redirectArchiveFeed']);
                        }

                        // Modify default messages
                        add_filter('post_updated_messages', [$this, "updatedMessages"], 10, 1);
                        add_filter('bulk_post_updated_messages', [$this, "updatedBulkMessages"], 10, 2);
                    }
                }
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * Register the post type again with its current settings, after a save.
     *
     * registerPostType() skips a post type that already exists, and a saved post type
     * was already registered at init with its previous settings: the flush after the
     * save then wrote the previous rewrite rules (e.g. the feed rules of #1427, an old
     * slug). Native and WooCommerce post types are never unregistered.
     *
     * @return void
     */
    public function reRegisterPostType(): void
    {
        $postType = strtolower($this->postTypeName);
        $registered = get_post_type_object($postType);

        if (
            !$this->isNative &&
            !$this->isWooCommerce &&
            $registered instanceof \WP_Post_Type &&
            !$registered->_builtin
        ) {
            unregister_post_type($postType);
        }

        $this->registerPostType();
    }

    /**
     * Whether the "Feeds" setting is switched off. Not set (post types saved before
     * the setting existed) keeps WordPress' default.
     *
     * @return bool
     */
    private function feedsDisabled(): bool
    {
        if (!array_key_exists('feeds', $this->postTypeArgs) || $this->postTypeArgs['feeds'] === null) {
            return false;
        }

        return filter_var($this->postTypeArgs['feeds'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) === false;
    }

    /**
     * Hide the archive feed <link> in the head of this post type's archive.
     *
     * @param bool $show
     *
     * @return bool
     */
    public function showArchiveFeedLink($show): bool
    {
        return is_post_type_archive($this->postTypeName) ? false : (bool)$show;
    }

    /**
     * Send a request for this post type's archive feed to the archive itself.
     *
     * @return void
     */
    public function redirectArchiveFeed(): void
    {
        $url = $this->archiveFeedRedirectUrl();

        if ($url !== null) {
            wp_safe_redirect($url, 301);
            exit;
        }
    }

    /**
     * The URL to redirect the current request to, or null when it isn't this
     * post type's archive feed.
     *
     * @return string|null
     */
    public function archiveFeedRedirectUrl(): ?string
    {
        if (!is_feed() || !is_post_type_archive($this->postTypeName)) {
            return null;
        }

        $link = get_post_type_archive_link($this->postTypeName);

        return is_string($link) ? $link : null;
    }

    /**
     * @param array<string, mixed> $messages
     * @return array<string, mixed>
     */
    public function updatedMessages(array $messages): array
    {
        $n = Translator::translateString($this->postTypeModel->getSingular());

        global $post;

        if ($post instanceof \WP_Post) {
            $permalink = get_the_permalink($post->ID);

            if ($permalink === false) {
                $permalink = "#";
            }

            $viewPostLinkHtml = sprintf(
                ' <a href="%1$s">%2$s</a>',
                esc_url($permalink),
                $this->translateMessage('view')
            );

            $messages[$this->postTypeName] = [
                0  => '', // Unused. Messages start at index 1.
                1  => $this->translateMessage('updated') . $viewPostLinkHtml,
                2  => __('Custom field updated.'),
                3  => __('Custom field deleted.'),
                4  => $this->translateMessage('updated'),
                /* translators: %s: date and time of the revision */
                5  => isset($_GET['revision']) ? sprintf(__($n . ' restored to revision from %s', ACPT_LITE_PLUGIN_NAME), wp_post_revision_title((int) $_GET['revision'], false)) : false,
                6  => $this->translateMessage('published') . $viewPostLinkHtml,
                7  => $this->translateMessage('saved'),
                8  => $this->translateMessage('published') . $viewPostLinkHtml,
                9  => sprintf(
                    __($n . ' scheduled for: <strong>%1$s</strong>.'),
                    // translators: Publish box date format, see http://php.net/date
                    date_i18n(__('M j, Y @ G:i'), strtotime($post->post_date))
                ),
                10 => $this->translateMessage('draft') . $viewPostLinkHtml,
            ];
        }

        return $messages;
    }

    /**
     * @param array<string, mixed> $bulkMessages
     * @param array<string, int> $bulkCounts
     * @return mixed
     */
    public function updatedBulkMessages($bulkMessages, $bulkCounts)
    {
        $plural = Translator::translateString($this->postTypeModel->getPlural());
        $singular = Translator::translateString($this->postTypeModel->getSingular());

        $bulkMessages[$this->postTypeName] = [
            'updated'   => _n('%s '.$singular.' updated.', '%s '.$plural.' updated.', $bulkCounts['updated'], ACPT_LITE_PLUGIN_NAME),
            'locked'    => _n('%s '.$singular.' not updated, somebody is editing it.', '%s '.$plural.' not updated, somebody is editing them.', $bulkCounts['locked'], ACPT_LITE_PLUGIN_NAME),
            'deleted'   => _n('%s '.$singular.' permanently deleted.', '%s '.$plural.' permanently deleted.', $bulkCounts['deleted'], ACPT_LITE_PLUGIN_NAME),
            'trashed'   => _n('%s '.$singular.' moved to the Trash.', '%s '.$plural.' moved to the Trash.', $bulkCounts['trashed'], ACPT_LITE_PLUGIN_NAME),
            'untrashed' => _n('%s '.$singular.' restored from the Trash.', '%s '.$plural.' restored from the Trash.', $bulkCounts['untrashed'], ACPT_LITE_PLUGIN_NAME),
        ];

        return $bulkMessages;
    }

    /**
     * @param string $key
     * @return string|null
     */
    private function translateMessage(string $key)
    {
        $n = ucwords($this->postTypeName);
        $n = str_replace("_", " ", $n);

        $translations = [
            'view' => "View %s",
            'updated' => "%s updated.",
            'published' => "Page %s.",
            'saved' => "Page %s.",
            'submitted' => "%s submitted.",
            'draft' => "%s draft updated.",
        ];

        if (!isset($translations[$key])) {
            return null;
        }

        return __(str_replace("%s", $n, $translations[$key]), ACPT_LITE_PLUGIN_NAME);
    }

    /**
     * This function rewrites post type permalinks
     *
     * @param string $postLink
     * @param \WP_Post $post
     * @return string
     */
    public function rewritePostTypePermalinks(string $postLink, \WP_Post $post)
    {
        $currentPostTypeName = strtolower($this->postTypeModel->getName());

        if ($post->post_type === $currentPostTypeName && $post->post_status === 'publish') {
            $settings = $this->postTypeModel->getSettings();

            $customRewrite   = $settings['custom_rewrite'] ?? '';
            $frontUrlPrefix  = $settings['front_url_prefix'] ?? '';

            // Prefer custom_rewrite, but don't apply both if they're the same value
            if (!empty($customRewrite) && $customRewrite !== $currentPostTypeName) {
                return $this->rewriteRule($post->post_type, $customRewrite, $postLink);
            }

            if (!empty($frontUrlPrefix) && $frontUrlPrefix !== $currentPostTypeName && $frontUrlPrefix !== $customRewrite) {
                return $this->rewriteRule($post->post_type, $frontUrlPrefix, $postLink);
            }
        }

        return $postLink;
    }

    /**
     * @param string $postType
     * @param string $url
     * @param string $postLink
     * @return string
     */
    private function rewriteRule(string $postType, string $url, string $postLink)
    {
        $frontUrlPrefix = "/";
        $frontUrlPrefix .= $url;

        if ($url !== "") {
            $frontUrlPrefix .= "/";
        }

        foreach (explode("/", $frontUrlPrefix) as $value) {
            if (!empty($value)) {
                add_rewrite_tag($value, '([^/]+)');
            }
        }

        return str_replace("/".$postType."/", $frontUrlPrefix, $postLink);
    }

    /**
     * Display legacy notices
     */
    public function legacyAdminNotices(): void
    {
        if (! isset($_GET['errors'])) {
            return;
        }

        global $post;

        if ($post->post_type === $this->postTypeName) {
            if (false !== ($errors = get_transient("acpt_plugin_error_msg_{$post->ID}")) && $errors) {
                delete_transient("acpt_plugin_error_msg_{$post->ID}");
                foreach ($errors as $error) {
                    ?>
                    <div class="notice notice-error is-dismissible">
                        <p><?php esc_html($error); ?></p>
                    </div>
                <?php
                }
            }
        }
    }
}
