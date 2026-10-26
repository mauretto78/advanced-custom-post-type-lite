<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Constants\TaxonomyField;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class Terms
{
    /**
     * @param string|int $postId
     * @return array<int, \stdClass>
     */
    public static function getForPostId($postId): array
    {
        global $wpdb;

        $sql = "
            SELECT r.object_id, r.term_taxonomy_id, t.taxonomy FROM  `{$wpdb->prefix}term_relationships` r
            LEFT JOIN `{$wpdb->prefix}term_taxonomy` t ON t.term_taxonomy_id = r.term_taxonomy_id
            WHERE r.object_id = %s 
        ";

        $preparedQuery = $wpdb->prepare($sql, [$postId]);

        return $wpdb->get_results($preparedQuery);
    }

    /**
     * @param string $postType
     * @param string|null $filteredTaxonomy
     * @return array<string, array<string, string>>
     */
    public static function getForPostType(string $postType, ?string $filteredTaxonomy = null): array
    {
        $terms = [];
        $taxonomies = get_object_taxonomies($postType);

        foreach ($taxonomies as $taxonomy) {
            $taxonomy_details = get_taxonomy($taxonomy);

            if ($taxonomy_details === false) {
                continue;
            }

            $queriedTerms = get_terms([
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
                'fields'     => 'id=>name',
            ]);

            if (is_wp_error($queriedTerms)) {
                continue;
            }

            $values = [];
            foreach ($queriedTerms as $id => $term) {
                $values[$taxonomy.TaxonomyField::SEPARATOR.$id] = $term;
            }

            $terms[$taxonomy_details->name] = $values;
        }

        if (!empty($filteredTaxonomy) && isset($terms[$filteredTaxonomy])) {
            return [
                $filteredTaxonomy => $terms[$filteredTaxonomy],
            ];
        }

        return $terms;
    }

    /**
     * Term names of a hierarchical taxonomy, each child listed right after its
     * parent and prefixed by one dash per level (#1400):
     * [1 => 'Safety', 5 => '— ABS', 6 => '— ESP', 2 => 'Comfort', ...]
     *
     * @param string $taxonomy
     *
     * @return array<int, string>
     */
    private static function indentedTermNames(string $taxonomy): array
    {
        $queriedTerms = get_terms([
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        ]);

        if (!is_array($queriedTerms)) {
            return [];
        }

        $termIds = [];
        $childrenOf = [];

        foreach ($queriedTerms as $term) {
            $termIds[$term->term_id] = true;
            $childrenOf[$term->parent][] = $term;
        }

        // a term whose parent is not in the list is shown as a root
        $roots = [];
        foreach ($childrenOf as $parentId => $children) {
            if ($parentId === 0 || !isset($termIds[$parentId])) {
                $roots = array_merge($roots, $children);
            }
        }

        $names = [];
        $walk = function (array $terms, int $depth) use (&$walk, &$names, $childrenOf) {
            foreach ($terms as $term) {
                $names[$term->term_id] = str_repeat('— ', $depth).$term->name;

                if (isset($childrenOf[$term->term_id])) {
                    $walk($childrenOf[$term->term_id], $depth + 1);
                }
            }
        };
        $walk($roots, 0);

        return $names;
    }

    /**
     * @param array<string, mixed> $args
     * @return array<int, array{taxonomy: string, terms: mixed}>
     */
    public static function getList(array $args = []): array
    {
        try {
            $terms = [];
            $taxonomyParam = isset($args['taxonomy']) ? $args['taxonomy'] : null;
            $taxonomies = get_taxonomies(['show_ui' => true], 'objects');

            if ($taxonomyParam !== null) {
                $taxonomies = array_filter($taxonomies, function (\WP_Taxonomy $taxonomy) use ($taxonomyParam) {
                    return $taxonomyParam === $taxonomy->name;
                });
            }

            usort($taxonomies, function (\WP_Taxonomy $a, \WP_Taxonomy $b) {
                return strtolower($a->label) <=> strtolower($b->label);
            });


            $indentByDepth = !empty($args['hierarchical']);

            foreach ($taxonomies as $taxonomy) {
                if ($indentByDepth && $taxonomy->hierarchical) {
                    $terms[] = [
                        'taxonomy' => self::formatTaxonomyLabel($taxonomy),
                        'terms'    => self::indentedTermNames($taxonomy->name),
                    ];

                    continue;
                }

                $queriedTerms = get_terms([
                    'taxonomy'   => $taxonomy->name,
                    'hide_empty' => false,
                    'fields'     => 'id=>name',
                ]);

                if (is_array($queriedTerms)) {
                    $terms[] = [
                        'taxonomy' => self::formatTaxonomyLabel($taxonomy),
                        'terms'    => $queriedTerms,
                    ];
                }
            }

            return $terms;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return [];
        }
    }

    /**
     * @param \WP_Taxonomy $taxonomy
     *
     * @return string
     */
    public static function formatTaxonomyLabel(\WP_Taxonomy $taxonomy): string
    {
        return $taxonomy->label . " (".$taxonomy->name.")";
    }

    /**
     * Retrieves a term object based on its name.
     *
     * @param string $termName The name of the term to retrieve.
     * @return \WP_Term|null The term object if found, or null if no matching term exists.
     */
    public static function getTermFromName(string $termName): ?\WP_Term
    {
        global $wpdb;

        $sql = "SELECT term_id FROM {$wpdb->terms} WHERE name = %s LIMIT 1";
        $result = ACPT_Lite_DB::getResults($sql, [$termName]);

        if (empty($result)) {
            return null;
        }

        $term = get_term($result[0]->term_id);

        if ($term instanceof \WP_Term) {
            return $term;
        }

        return null;
    }
}
