<?php

namespace ACPT_Lite\Integrations\Gutenberg\Generators\ACPTBlocks\Blocks;

use ACPT_Lite\Constants\MetaTypes;

abstract class AbstractBlockRenderer
{
    /**
     * @param mixed $attributes
     *
     * @return mixed|null
     */
    protected function rawValue($attributes)
    {
        if (!isset($attributes['field'])) {
            return null;
        }

        $field = json_decode($attributes['field'], true);

        if (!isset($field['belongsTo'])) {
            return null;
        }

        if (isset($field['belongsTo']) && $field['belongsTo'] === MetaTypes::TAXONOMY) {
            $find = 'term_id';
            $termId = null;
            // Front-end rendering
            $queriedObject = get_queried_object();
            if ($queriedObject instanceof \WP_Term) {
                $termId = $queriedObject->term_id;
            }
            // try to calculate $termId from HTTP_REFERER (AJAX request)
            if ($termId === null) {
                $referer = $_SERVER['HTTP_REFERER'] ?? '';
                $parsedReferer = parse_url($referer);

                if (is_array($parsedReferer) && isset($parsedReferer['query'])) {
                    parse_str($parsedReferer['query'], $parsedRefererArray);

                    $prefix = wp_get_theme()->get_stylesheet()."//".$field['find']."-";
                    $taxonomySlug = str_replace($prefix, "", $parsedRefererArray['postId'] ?? '');

                    if (!is_string($taxonomySlug)) {
                        return null;
                    }

                    $term = get_term_by('slug', $taxonomySlug, $field['find']);
                    if ($term instanceof \WP_Term) {
                        $termId = $term->term_id;
                    }
                }
            }
            $findValue = ($attributes['postId'] !== null && $attributes['postId'] < 99999999999999999) ? (int)$attributes['postId'] : (int)$termId;
        } else {
            global $post;

            $find = 'post_id';
            $findValue = ($attributes['postId'] !== null && $attributes['postId'] < 99999999999999999) ? (int)$attributes['postId'] : ($post instanceof \WP_Post ? (int)$post->ID : null);
        }

        if (empty($findValue)) {
            return null;
        }

        if (!isset($field['box'])) {
            return null;
        }

        if (!isset($field['field'])) {
            return null;
        }

        return get_acpt_field([
            $find => $findValue,
            'box_name' => $field['box'],
            'field_name' => $field['field'],
            'with_context' => true,
            'format' => 'complete'
        ]);
    }
}
