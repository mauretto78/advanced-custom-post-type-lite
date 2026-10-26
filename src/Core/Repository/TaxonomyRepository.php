<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Arrays;

class TaxonomyRepository extends AbstractRepository
{
    /**
     * Associate a post with a taxonomy
     *
     * @param string $postId
     * @param string $taxonomyId
     * @return void
     * @throws \Exception
     */
    public static function assocToPostType(string $postId, string $taxonomyId): void
    {
        $sql = "
            INSERT INTO
                `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."`
                (
                    `custom_post_type_id`, 
                    `taxonomy_id` 
                ) VALUES (
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `custom_post_type_id` = %s,
                    `taxonomy_id` = %s
            ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $postId,
                $taxonomyId,
                $postId,
                $taxonomyId
        ]);

        ACPT_Lite_DB::flushCache();
    }

    /**
     * @return int
     */
    /**
     * @param array<string, mixed> $args
     * @return int
     */
    public static function count(array $args = []): int
    {
        $baseQuery = "SELECT count(id) as count FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` WHERE 1 = 1";
        $queryArgs = [];

        if (isset($args['search'])) {
            $baseQuery .= " AND (singular LIKE %s OR plural LIKE %s OR slug LIKE %s)";
            $queryArgs[] = "%" . $args['search'] . "%";
            $queryArgs[] = "%" . $args['search'] . "%";
            $queryArgs[] = "%" . $args['search'] . "%";
        }

        $results = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

        if (empty($results)) {
            return 0;
        }

        return (int)$results[0]->count;
    }

    /**
     * Delete taxonomy
     *
     * @param string $taxonomy
     * @return void
     * @throws \Exception
     */
    public static function delete($taxonomy)
    {
        $taxonomyId = self::getId($taxonomy);

        if ($taxonomyId) {
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` WHERE id = %s;", [$taxonomyId]);
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` WHERE taxonomy_id = %s;", [$taxonomyId]);
            MetaRepository::deleteBelongs(MetaTypes::TAXONOMY, $taxonomy);
        }

        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete all post's associations with taxonomies
     *
     * @param string $postId
     * @return void
     * @throws \Exception
     */
    public static function deleteAssociations($postId)
    {
        $sql = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."`
                WHERE custom_post_type_id = %s
            ";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [$postId]);
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Check if a taxonomy exists
     *
     * @since    1.0.4
     * @param string $slug
     *
     * @return bool
     */
    public static function exists($slug)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."`
            WHERE slug = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$slug]);

        return Arrays::count($posts) === 1;
    }

    /**
     * Get the registered taxonomies
     *
     * @param array<string, mixed> $meta
     *
     * @param bool $lazy
     * @return TaxonomyModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = [], bool $lazy = false): array
    {
        $results = [];
        $join = '';
        $args = [];

        $cachedId = "taxonomy_get";

        if (isset($meta['customPostType'])) {
            $join .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` tp ON tp.taxonomy_id = t.id";
            $join .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` cp ON cp.id = tp.custom_post_type_id ";
        }

        $baseQuery = "
            SELECT 
                t.id, 
                t.slug,
                t.singular,
                t.plural,
                t.labels,
                t.native,
                t.settings
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` t
            ".$join."
            WHERE 1=1
            ";

        if (isset($meta['id'])) {
            $baseQuery .= " AND t.id = %s";
            $args[] = $meta['id'];
            $cachedId .= "_".$meta['id'];
        }

        if (isset($meta['customPostType'])) {
            $baseQuery .= " AND cp.post_name = %s";
            $args[] = $meta['customPostType'];
            $cachedId .= "_".$meta['customPostType'];
        }

        $slugFilter = $meta['taxonomy'] ?? $meta['slug'] ?? null;
        if ($slugFilter !== null) {
            $baseQuery .= " AND t.slug = %s";
            $args[] = $slugFilter;
            $cachedId .= "_".$slugFilter;
        }

        if (isset($meta['search'])) {
            $baseQuery .= " AND (t.singular LIKE %s OR t.plural LIKE %s OR t.slug LIKE %s)";
            $args[] = "%".$meta['search']."%";
            $args[] = "%".$meta['search']."%";
            $args[] = "%".$meta['search']."%";
            $cachedId .= "_".$meta['search'];
        }

        if (isset($meta['exclude'])) {
            $baseQuery .= " AND t.slug != %s";
            $args[] = $meta['exclude'];
            $cachedId .= "_".$meta['exclude'];
        }

        $baseQuery .= " GROUP BY t.id";

        if (isset($meta['order']) && isset($meta['sort'])) {
            $baseQuery .= " ORDER BY ".$meta['sort']." ".$meta['order'];
            $cachedId .= "_".$meta['sort']."_".$meta['order'];
        } else {
            $baseQuery .= " ORDER BY t.slug ASC";
        }

        if (isset($meta['page']) && isset($meta['perPage'])) {
            $baseQuery .= " LIMIT ".(int)$meta['perPage']." OFFSET " . ((int)$meta['perPage'] * ((int)$meta['page'] - 1));
        }

        $baseQuery .= '';
        $taxonomies = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($taxonomies as $taxonomy) {
            try {
                $taxonomyModel = TaxonomyModel::hydrateFromArray([
                    'id' => $taxonomy->id,
                    'slug' => $taxonomy->slug,
                    'singular' => $taxonomy->singular,
                    'plural' => $taxonomy->plural,
                    'native' => $taxonomy->native == '1' ? true : false,
                    'labels' => json_decode($taxonomy->labels, true),
                    // WP core defaults rest_base/rest_controller_class to boolean false when
                    // unset (e.g. link_category, post_format) rather than '' or null — collapse
                    // that to null so it matches the declared string|null output schema instead
                    // of failing ability_invalid_output on every list/get call that includes one.
                    'settings' => Arrays::falseToNull(json_decode($taxonomy->settings, true) ?: [], ['rest_base', 'rest_controller_class']),
                ]);

                $sql = "
                SELECT 
                    SUM(count) as count
                FROM `".ACPT_Lite_DB::prefix()."term_taxonomy` 
                WHERE `taxonomy` = %s 
            ";

                $res = ACPT_Lite_DB::getResults($sql, [
                    $taxonomy->slug
                ]);

                $count = (Arrays::count($res) > 0 && isset($res[0]->count)) ? $res[0]->count : 0;
                $taxonomyModel->setPostCount($count);

                $customPostTypes = ACPT_Lite_DB::getResults("
	                SELECT
	                    c.id,
	                    c.post_name,
	                    c.singular,
	                    c.plural,
	                    c.icon,
	                    c.native,
	                    c.supports,
	                    c.labels,
	                    c.settings
	                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` c
	                JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` p ON p.custom_post_type_id = c.id
	                WHERE p.taxonomy_id = %s
	            ;", [$taxonomyModel->getId()]);

                foreach ($customPostTypes as $post) {
                    $postModel = CustomPostTypeModel::hydrateFromArray([
                        'id' => $post->id,
                        'name' => $post->post_name,
                        'singular' => $post->singular,
                        'plural' => $post->plural,
                        'icon' => $post->icon,
                        'native' => $post->native == '0' ? false : true,
                        'supports' => json_decode($post->supports),
                        'labels' => json_decode($post->labels, true),
                        'settings' => Arrays::falseToNull(json_decode($post->settings, true) ?: [], ['rest_base']),
                    ]);

                    $taxonomyModel->addCustomPostType($postModel);
                }

                $results[] = $taxonomyModel;
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        self::saveInCache($cachedId, $results);

        return $results;
    }

    /**
     * Get the id of a post type by registed name
     *
     * @since    1.0.0
     * @param string $taxonomy
     *
     * @return string|null
     */
    public static function getId($taxonomy)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."`
            WHERE slug = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$taxonomy]);

        if (Arrays::count($posts) === 1) {
            return $posts[0]->id;
        }

        return null;
    }

    /**
     * @return string[]
     */
    public static function getSlugs()
    {
        $names = [];
        $query = "
	        SELECT 
                t.id, 
                t.slug as slug
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` t
	    ";

        $taxonomies = ACPT_Lite_DB::getResults($query, []);

        foreach ($taxonomies as $taxonomy) {
            $names[] = $taxonomy->slug;
        }

        return $names;
    }

    /**
     * @param TaxonomyModel $taxonomyModel
     * @return void
     * @throws \Exception
     */
    public static function save(TaxonomyModel $taxonomyModel)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` 
            (`id`,
            `slug`,
            `singular`,
            `plural`,
            `native`,
            `labels`,
            `settings`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `slug` = %s,
                `singular` = %s,
                `plural` = %s,
                `native` = %s,
                `labels` = %s,
                `settings` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $taxonomyModel->getId(),
                $taxonomyModel->getSlug(),
                $taxonomyModel->getSingular(),
                $taxonomyModel->getPlural(),
                $taxonomyModel->isNative(),
                json_encode($taxonomyModel->getLabels()),
                json_encode($taxonomyModel->getSettings()),
                $taxonomyModel->getSlug(),
                $taxonomyModel->getSingular(),
                $taxonomyModel->getPlural(),
                $taxonomyModel->isNative(),
                json_encode($taxonomyModel->getLabels()),
                json_encode($taxonomyModel->getSettings())
        ]);
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Remove an association with a taxonomy
     *
     * @param string $postId
     * @param string $taxonomyId
     * @return void
     * @throws \Exception
     */
    public static function removeAssocPost($postId, $taxonomyId)
    {
        $sql = "
            DELETE FROM
                `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."`
                WHERE
                   `custom_post_type_id` = %s AND `taxonomy_id` = %s
            ";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $postId,
                $taxonomyId
        ]);

        ACPT_Lite_DB::flushCache();
    }

    /**
     * @param string $taxonomy
     * @return void
     */
    public static function createCustomTaxonomy($taxonomy)
    {
        try {
            $idTax = Uuid::v4();
            $taxonomyObject = get_taxonomy($taxonomy);

            if ($taxonomyObject === false) {
                return;
            }

            $taxModel =  TaxonomyModel::hydrateFromArray([
                'id' => $idTax,
                'slug' => $taxonomyObject->name,
                'singular' => $taxonomyObject->labels->singular_name,
                'plural' => $taxonomyObject->label,
                'native' => false,
                'labels' => (array)$taxonomyObject->labels,
                'settings' => [
                    'description' => $taxonomyObject->description,
                    'public' => $taxonomyObject->public,
                    'publicly_queryable' => $taxonomyObject->publicly_queryable,
                    'hierarchical' => $taxonomyObject->hierarchical,
                    'show_ui' => $taxonomyObject->show_ui,
                    'show_in_menu' => $taxonomyObject->show_in_menu,
                    'show_in_nav_menus' => $taxonomyObject->show_in_nav_menus,
                    'show_tagcloud' => $taxonomyObject->show_tagcloud,
                    'show_in_quick_edit' => $taxonomyObject->show_in_quick_edit,
                    'show_admin_column' => $taxonomyObject->show_admin_column,
                    'meta_box_cb' => $taxonomyObject->meta_box_cb,
                    'cap' => (array)$taxonomyObject->cap,
                    'rewrite' => $taxonomyObject->rewrite,
                    'query_var' => $taxonomyObject->query_var,
                    'update_count_callback' => $taxonomyObject->update_count_callback,
                    'show_in_rest' => $taxonomyObject->show_in_rest,
                    'rest_base' => $taxonomyObject->rest_base,
                    'rest_namespace' => $taxonomyObject->rest_namespace,
                    'rest_controller_class' => $taxonomyObject->rest_controller_class,
                    'rest_controller' => $taxonomyObject->rest_controller,
                    'default_term' => $taxonomyObject->default_term,
                    'sort' => $taxonomyObject->sort,
                ],
            ]);

            TaxonomyRepository::save($taxModel);

            foreach ($taxonomyObject->object_type as $postType) {
                $postTypeModels = CustomPostTypeRepository::get([
                    'postType' => $postType
                ]);

                if (!empty($postTypeModels)) {
                    $postTypeModel = $postTypeModels[0];
                    TaxonomyRepository::assocToPostType($postTypeModel->getId(), $idTax);
                }
            }

            ACPT_Lite_DB::flushCache();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        }
    }
}
