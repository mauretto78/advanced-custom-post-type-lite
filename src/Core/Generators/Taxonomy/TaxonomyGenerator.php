<?php

namespace ACPT_Lite\Core\Generators\Taxonomy;

use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class TaxonomyGenerator
{
    private TaxonomyModel $taxonomyModel;

    /**
     * @var array<int, string>
     */
    private array $reservedTerms = [
        'attachment',
        'attachment_id',
        'author',
        'author_name',
        'calendar',
        'cat',
        'category',
        'category__and',
        'category__in',
        'category__not_in',
        'category_name',
        'comments_per_page',
        'comments_popup',
        'custom',
        'customize_messenger_channel',
        'customized',
        'cpage',
        'day',
        'debug',
        'embed',
        'error',
        'exact',
        'feed',
        'fields',
        'hour',
        'link_category',
        'm',
        'minute',
        'monthnum',
        'more',
        'name',
        'nav_menu',
        'nonce',
        'nopaging',
        'offset',
        'order',
        'orderby',
        'p',
        'page',
        'page_id',
        'paged',
        'pagename',
        'pb',
        'perm',
        'post',
        'post__in',
        'post__not_in',
        'post_format',
        'post_mime_type',
        'post_status',
        'post_tag',
        'post_type',
        'posts',
        'posts_per_archive_page',
        'posts_per_page',
        'preview',
        'robots',
        's',
        'search',
        'second',
        'sentence',
        'showposts',
        'static',
        'status',
        'subpost',
        'subpost_id',
        'tag',
        'tag__and',
        'tag__in',
        'tag__not_in',
        'tag_id',
        'tag_slug__and',
        'tag_slug__in',
        'taxonomy',
        'tb',
        'term',
        'terms',
        'theme',
        'themes',
        'title',
        'type',
        'types',
        'w',
        'withcomments',
        'withoutcomments',
        'year',
    ];

    /**
     * @param TaxonomyModel $taxonomyModel
     */
    public function __construct(TaxonomyModel $taxonomyModel)
    {
        $this->taxonomyModel = $taxonomyModel;
    }

    /**
     * "show_meta_box" is ACPT's own toggle, not a register_taxonomy() arg:
     * turning it off removes the classic editor meta box via meta_box_cb (#1402).
     *
     * @param array<string, mixed> $settings
     *
     * @return array<string, mixed>
     */
    public static function mapMetaBoxSetting(array $settings): array
    {
        if (!array_key_exists('show_meta_box', $settings)) {
            return $settings;
        }

        $showMetaBox = $settings['show_meta_box'];

        if ($showMetaBox !== null && !filter_var($showMetaBox, FILTER_VALIDATE_BOOLEAN)) {
            $settings['meta_box_cb'] = false;
        }

        unset($settings['show_meta_box']);

        return $settings;
    }

    /**
     * Registers a new taxonomy, associated with the instantiated post type(s).
     *
     * @return void
     */
    public function registerTaxonomy()
    {
        $slug = $this->taxonomyModel->getSlug();
        $taxonomyName = ucwords($slug);

        if (in_array($slug, $this->reservedTerms)) {
            throw new \Exception("Taxonomy slug '$slug' is reserved.");
        }

        $singular = Translator::translateString($this->taxonomyModel->getSingular());
        $plural = Translator::translateString($this->taxonomyModel->getPlural());
        $labels = $this->taxonomyModel->getLabels();

        $labelsArray = [
            'name',
            'singular_name',
            'search_items',
            'popular_items',
            'all_items',
            'parent_item',
            'parent_item_colon',
            'edit_item',
            'view_item',
            'update_item',
            'add_new_item',
            'new_item_name',
            'separate_items_with_commas',
            'add_or_remove_items',
            'choose_from_most_used',
            'not_found',
            'no_terms',
            'filter_by_item',
            'items_list_navigation',
            'items_list',
            'back_to_items',
            'item_link',
            'item_link_description',
            'menu_name',
            'name_admin_bar',
            'archives',
        ];

        foreach ($labelsArray as $label) {
            if (isset($labels[$label])) {
                $labels[$label] = Translator::translateString($labels[$label]);
            }
        }

        $settings = $this->taxonomyModel->getSettings();

        $settings = self::mapMetaBoxSetting($settings);

        // Fix for preventing this warning:
        // avoid strip_tags(): Passing null to parameter #1 ($string) of type string is deprecated
        if (($settings['query_var'] ?? null) === null) {
            $settings['query_var'] = '';
        }

        $options = array_merge(
            [
                'singular_label' => $singular,
                'label' => $plural,
                'labels' => $labels,
            ],
            $settings
        );

        if (empty($plural)) {
            $plural = $taxonomyName . 's';
        }

        $taxonomyName = ucwords($taxonomyName);

        $options = array_merge(
            [
                "hierarchical" => true,
                "label" => $taxonomyName,
                "singular_label" => $plural,
                "show_ui" => true,
                "query_var" => true,
                'show_admin_column' => true,
                "show_in_rest" => true,
                "rewrite" => [
                    "slug" => strtolower($taxonomyName)
                ]
            ],
            $options
        );

        // fix for post_tag
        if ($slug === 'post_tag') {
            $options["hierarchical"] = false;
        }

        $customPostTypesArray = [];

        foreach ($this->taxonomyModel->getCustomPostTypes() as $customPostTypeModel) {
            $customPostTypesArray[] = $customPostTypeModel->getName();
        }

        // custom_rewrite
        if (isset($this->taxonomyModel->getSettings()['custom_rewrite']) && !empty($this->taxonomyModel->getSettings()['rewrite']) && !empty($this->taxonomyModel->getSettings()['custom_rewrite'])) {
            $options['rewrite'] = [
                'slug' => $this->taxonomyModel->getSettings()['custom_rewrite'],
            ];
        }

        // with_front
        if (isset($this->taxonomyModel->getSettings()['with_front']) && !empty($this->taxonomyModel->getSettings()['rewrite'])) {
            if (!is_array($options['rewrite'])) {
                $options['rewrite'] = [];
            }

            $options['rewrite']['with_front'] = $this->taxonomyModel->getSettings()['with_front'];
        }

        // hierarchical
        if (isset($this->taxonomyModel->getSettings()['rewrite_hierarchical']) && !empty($this->taxonomyModel->getSettings()['rewrite'])) {
            if (!is_array($options['rewrite'])) {
                $options['rewrite'] = [];
            }

            $options['rewrite']['hierarchical'] = $this->taxonomyModel->getSettings()['rewrite_hierarchical'];
        }

        if (!taxonomy_exists(strtolower($taxonomyName))) {
            register_taxonomy(
                strtolower($taxonomyName),
                $customPostTypesArray,
                $options
            );

            // Add custom rewrite rule for hierarchical taxonomy URLs
            if (
                isset($this->taxonomyModel->getSettings()['rewrite_hierarchical']) &&
                $this->taxonomyModel->getSettings()['rewrite_hierarchical'] === true
            ) {
                $rewriteSlug = $options['rewrite']['slug'] ?? strtolower($taxonomyName);

                add_rewrite_rule(
                    $rewriteSlug . '/(.+?)/?$',
                    'index.php?' . strtolower($taxonomyName) . '=$matches[1]',
                    'top'
                );
            }
        }
    }
}
