<?php

namespace ACPT_Lite\Utils\Wordpress;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class WPLinks
{
    /**
     * getNextLink
     *
     * @param $postId
     *
     * @return array|null
     * @since    1.0.0
     */
    public static function getNextLink( $postId )
    {
        // Get a global post reference since get_adjacent_post() references it
        global $post;

        // Store the existing post object for later so we don't lose it
        $oldGlobal = $post;

        // Get the post object for the specified post and place it in the global variable
        $post = get_post( $postId );

        // Get the post object for the previous post
        $nextPost = get_next_post();

        // Reset our global object
        $post = $oldGlobal;

        if ( '' == $nextPost ) {
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
     * @param $postId
     *
     * @return array|null
     * @since    1.0.0
     */
    public static function getPrevLink( $postId )
    {
        // Get a global post reference since get_adjacent_post() references it
        global $post;

        // Store the existing post object for later so we don't lose it
        $oldGlobal = $post;

        // Get the post object for the specified post and place it in the global variable
        $post = get_post( $postId );

        // Get the post object for the previous post
        $previousPost = get_previous_post();

        // Reset our global object
        $post = $oldGlobal;

        if ( '' == $previousPost ) {
            return null;
        }

        return [
            'title' => get_the_title($previousPost->ID),
            'link' => get_permalink($previousPost->ID),
        ];
    }

    /**
     * @param $postId
     * @param $postType
     *
     * @return array
     */
    public static function getTaxonomiesLinks($postId, $postType)
    {
        $taxonomies = [];
        $registeredTaxonomies =  get_object_taxonomies($postType);
        $queriedTaxonomies = wp_get_object_terms($postId, $registeredTaxonomies);

        if(!empty($queriedTaxonomies)) {
            foreach($queriedTaxonomies as $queriedTaxonomy) {
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