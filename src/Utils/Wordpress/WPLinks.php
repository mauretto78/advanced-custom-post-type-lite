<?php

namespace ACPT_Lite\Utils\Wordpress;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WPLinks
{
    /**
     * getNextLink
     *
     * @param string|int $postId
     * @return array{title: string, link: string|false}|null
     * @since    1.0.0
     */
    public static function getNextLink($postId)
    {
        // Get a global post reference since get_adjacent_post() references it
        global $post;

        // Store the existing post object for later so we don't lose it
        $oldGlobal = $post;

        // Get the post object for the specified post and place it in the global variable
        $post = get_post((int)$postId);

        // Get the post object for the previous post
        $nextPost = get_next_post();

        // Reset our global object
        $post = $oldGlobal;

        if (!$nextPost instanceof \WP_Post) {
            return null;
        }

        return [
                'title' => get_the_title($nextPost->ID),
                'link' => get_permalink($nextPost->ID),
        ];
    }

    /**
     * getPrevLink
     *
     * @param string|int $postId
     * @return array{title: string, link: string|false}|null
     * @since    1.0.0
     */
    public static function getPrevLink($postId)
    {
        // Get a global post reference since get_adjacent_post() references it
        global $post;

        // Store the existing post object for later so we don't lose it
        $oldGlobal = $post;

        // Get the post object for the specified post and place it in the global variable
        $post = get_post((int)$postId);

        // Get the post object for the previous post
        $previousPost = get_previous_post();

        // Reset our global object
        $post = $oldGlobal;

        if (!$previousPost instanceof \WP_Post) {
            return null;
        }

        return [
            'title' => get_the_title($previousPost->ID),
            'link' => get_permalink($previousPost->ID),
        ];
    }

    /**
     * @param string|int $postId
     * @param string $postType
     * @return array<int, array{name: string, slug: string, taxonomy: string, link: mixed}>
     */
    public static function getTaxonomiesLinks($postId, string $postType): array
    {
        $taxonomies = [];
        $registeredTaxonomies =  get_object_taxonomies($postType);
        $queriedTaxonomies = wp_get_object_terms((int)$postId, $registeredTaxonomies);

        if (!empty($queriedTaxonomies) && !is_wp_error($queriedTaxonomies)) {
            foreach ($queriedTaxonomies as $queriedTaxonomy) {
                $taxonomies[] = [
                        'name' => $queriedTaxonomy->name,
                        'slug' => $queriedTaxonomy->slug,
                        'taxonomy' => $queriedTaxonomy->taxonomy,
                        'link' => get_term_link($queriedTaxonomy),
                ];
            }
        }

        return $taxonomies;
    }
}
