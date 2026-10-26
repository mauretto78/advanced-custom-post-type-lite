<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Arrays;

class CustomPostTypeRepository extends AbstractRepository
{
    /**
     * @return int
     */
    /**
     * @param array<string, mixed> $args
     * @return int
     */
    public static function count(array $args = []): int
    {
        $baseQuery = "SELECT count(id) as count FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` WHERE 1 = 1";
        $queryArgs = [];

        if (isset($args['search'])) {
            $baseQuery .= " AND (singular LIKE %s OR plural LIKE %s OR post_name LIKE %s)";
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
     * Delete a custom post type
     *
     * @param string $postType
     * @param bool $deletePosts
     *
     * @return bool
     * @throws \Exception
     * @since    1.0.0
     */
    public static function delete(string $postType, bool $deletePosts = false): bool
    {
        if ($postType === 'post' || $postType === 'page') {
            throw new \Exception('You cannot delete page or post CPT.');
        }

        if (self::exists($postType)) {
            $postModel = self::get([
                    'postType' => $postType
            ])[0];

            ACPT_Lite_DB::startTransaction();

            try {
                $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
                        WHERE id = %s
                    ";

                MetaRepository::deleteBelongs(MetaTypes::CUSTOM_POST_TYPE, $postType);

                TaxonomyRepository::deleteAssociations($postModel->getId());

                if ($postModel->isWooCommerce()) {
                    WooCommerceProductDataRepository::clear();
                }
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$postModel->getId()]);
                ACPT_Lite_DB::commitTransaction();
                ACPT_Lite_DB::invalidateCacheTag(self::class);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);

                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            if ($deletePosts) {
                self::deletePostType($postType);
            }

            return true;
        }

        return false;
    }

    /**
     * Check if a post type exists
     *
     * @since    1.0.0
     * @param string $postType
     *
     * @return bool
     */
    public static function exists(string $postType): bool
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$postType]);

        return Arrays::count($posts) === 1;
    }

    /**
     * Get the registered custom post types
     *
     * @param array<string, mixed> $meta
     *
     * @return CustomPostTypeModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = []): array
    {
        $results = [];
        $args = [];

        $cachedId = "post_type_get";

        $baseQuery = "
            SELECT 
                cp.id, 
                cp.post_name as name,
                cp.singular,
                cp.plural,
                cp.icon,
                cp.native,
                cp.supports,
                cp.labels,
                cp.settings,
                COUNT(p.id) as post_count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` cp
            LEFT JOIN `".ACPT_Lite_DB::prefix()."posts` p ON p.post_type = cp.post_name AND p.`post_status` = %s
            WHERE 1=1
            ";

        $args[] = 'publish';

        if (isset($meta['id'])) {
            $baseQuery .= " AND cp.id = %s";
            $args[] = $meta['id'];
            $cachedId .= "_".$meta['id'];
        }

        $postTypeFilter = $meta['postType'] ?? $meta['name'] ?? null;
        if ($postTypeFilter !== null) {
            $baseQuery .= " AND cp.post_name = %s ";
            $args[] = $postTypeFilter;
            $cachedId .= "_".$postTypeFilter;
        }

        if (isset($meta['exclude'])) {
            $baseQuery .= " AND cp.post_name != %s ";
            $args[] = $meta['exclude'];
            $cachedId .= "_".$meta['exclude'];
        }

        if (isset($meta['search'])) {
            $baseQuery .= " AND (cp.singular LIKE %s OR cp.plural LIKE %s OR cp.post_name LIKE %s)";
            $args[] = "%".$meta['search']."%";
            $args[] = "%".$meta['search']."%";
            $args[] = "%".$meta['search']."%";
            $cachedId .= "_".$meta['search'];
        }

        $baseQuery .= " GROUP BY cp.id";

        if (isset($meta['sort']) && isset($meta['order'])) {
            $baseQuery .= " ORDER BY ".$meta['sort']." ".$meta['order'];
            $cachedId .= "_".$meta['sort']."_".$meta['order'];
        } else {
            $baseQuery .= " ORDER BY cp.native DESC, cp.post_name ASC";
        }

        if (isset($meta['page']) && isset($meta['perPage'])) {
            $baseQuery .= " LIMIT ".(int)$meta['perPage']." OFFSET " . ((int)$meta['perPage'] * ((int)$meta['page'] - 1));
            $cachedId .= "_".$meta['perPage'];
            $cachedId .= "_".$meta['page'];
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

        $baseQuery .= ';';
        $posts = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($posts as $post) {
            try {
                $postModel = CustomPostTypeModel::hydrateFromArray([
                    'id' => $post->id,
                    'name' => $post->name,
                    'singular' => $post->singular,
                    'plural' => $post->plural,
                    'icon' => $post->icon,
                    'native' => $post->native == '0' ? false : true,
                    'supports' => json_decode($post->supports),
                    'labels' => json_decode($post->labels, true),
                    // WP core defaults rest_base to boolean false when unset rather than '' or
                    // null — collapse that to null so it matches the declared string|null output
                    // schema instead of failing ability_invalid_output for such a post type.
                    'settings' => Arrays::falseToNull(json_decode($post->settings, true) ?: [], ['rest_base']),
                ]);

                // Add more data
                $postModel = self::addTaxonomiesToPostTypeModel($postModel);
                $postModel = self::addWooCommerceDataToPostTypeModel($postModel);
                $postModel->setPostCount($post->post_count);

                $results[] = $postModel;
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        self::saveInCache($cachedId, $results);

        return $results;
    }

    /**
     * @param CustomPostTypeModel $postModel
     *
     * @return CustomPostTypeModel
     * @throws \Exception
     */
    private static function addTaxonomiesToPostTypeModel(CustomPostTypeModel $postModel): CustomPostTypeModel
    {
        $taxonomies = ACPT_Lite_DB::getResults("
                    SELECT
                        t.id,
                        t.slug ,
                        t.singular,
                        t.plural,
                        t.labels,
                         t.native,
                        t.settings
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` t
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` p ON p.taxonomy_id = t.id
                    WHERE p.custom_post_type_id = %s
                ;", [$postModel->getId()]);

        foreach ($taxonomies as $taxonomy) {
            try {
                $taxonomyModel = TaxonomyModel::hydrateFromArray([
                    'id' => $taxonomy->id,
                    'slug' => $taxonomy->slug,
                    'singular' => $taxonomy->singular,
                    'plural' => $taxonomy->plural,
                    'native' => (isset($taxonomy->native) && $taxonomy->native == '1') ? true : false,
                    'labels' => json_decode($taxonomy->labels, true),
                    'settings' => Arrays::falseToNull(json_decode($taxonomy->settings, true) ?: [], ['rest_base', 'rest_controller_class']),
                ]);

                $postModel->addTaxonomy($taxonomyModel);
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        return $postModel;
    }

    /**
     * @param CustomPostTypeModel $postModel
     *
     * @return CustomPostTypeModel
     * @throws \Exception
     */
    private static function addWooCommerceDataToPostTypeModel(CustomPostTypeModel $postModel): CustomPostTypeModel
    {
        if ($postModel->isWooCommerce()) {
            $productData = ACPT_Lite_DB::getResults("
                        SELECT 
                            id,
                            product_data_name,
                            icon,
                            visibility,
                            show_in_ui
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."`
                    ;", []);

            foreach ($productData as $productDatum) {
                $wooCommerceProductDataModel = WooCommerceProductDataModel::hydrateFromArray([
                        'id' => $productDatum->id,
                        'name' => $productDatum->product_data_name,
                        'icon' => json_decode($productDatum->icon, true),
                        'visibility' => json_decode($productDatum->visibility),
                        'showInUI' => $productDatum->show_in_ui == '0' ? false : true,
                ]);

                $productDataFields = ACPT_Lite_DB::getResults("
                            SELECT 
                                id,
                                product_data_id,
                                field_name,
                                field_type,
                                required,
                                sort
                            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."`
                            WHERE product_data_id = %s ORDER BY sort DESC
                        ;", [$productDatum->id]);

                foreach ($productDataFields as $productDataField) {
                    $wooCommerceProductDataFieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                            'id' => $productDataField->id,
                            'productDataModel' => $wooCommerceProductDataModel,
                            'name' => $productDataField->field_name,
                            'type' => $productDataField->field_type,
                            'required' => $productDataField->required == '1',
                            'sort' => $productDataField->sort,
                            'defaultValue' => null,
                            'description' => null,
                    ]);

                    $wooCommerceProductDataModel->addField($wooCommerceProductDataFieldModel);
                }

                $postModel->addWoocommerceProductData($wooCommerceProductDataModel);
            }

            return $postModel;
        }

        return $postModel;
    }

    /**
     * @return string[]
     */
    public static function getNames(): array
    {
        $names = [];
        $query = "
	        SELECT 
                p.id, 
                p.post_name as name 
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` p
	    ";

        $postTypes = ACPT_Lite_DB::getResults($query, []);

        foreach ($postTypes as $postType) {
            $names[] = $postType->name;
        }

        return $names;
    }

    /**
     * Get the id of a post type by registered name
     *
     * @since    1.0.0
     * @param string $postType
     *
     * @return string|null
     */
    public static function getId(string $postType): ?string
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [
                $postType
        ]);

        if (Arrays::count($posts) === 1) {
            return $posts[0]->id;
        }

        return null;
    }

    /**
     * Save custom post type data
     *
     * @param CustomPostTypeModel $model
     * @return void
     * @throws \Exception
     */
    public static function save(CustomPostTypeModel $model): void
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` 
            (`id`,
            `post_name` ,
            `singular` ,
            `plural`,
            `icon`,
            `native`,
            `supports`,
            `labels`,
            `settings`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `post_name` = %s,
                `singular` = %s,
                `plural` = %s,
                `icon` = %s,
                `native` = %s,
                `supports` = %s,
                `labels` = %s,
                `settings` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $model->getId(),
                $model->getName(),
                $model->getSingular(),
                $model->getPlural(),
                $model->getIcon(),
                $model->isNative(),
                json_encode($model->getSupports()),
                json_encode($model->getLabels()),
                json_encode($model->getSettings()),
                $model->getName(),
                $model->getSingular(),
                $model->getPlural(),
                $model->getIcon(),
                $model->isNative(),
                json_encode($model->getSupports()),
                json_encode($model->getLabels()),
                json_encode($model->getSettings())
        ]);
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete all posts by post type
     *
     * @param string $postType
     * @return void
     * @throws \Exception
     */
    private static function deletePostType(string $postType): void
    {
        global $wpdb;

        $query = "DELETE a,b,c
            FROM `{$wpdb->prefix}posts` a
            LEFT JOIN `{$wpdb->prefix}term_relationships` b
                ON (a.ID = b.object_id)
            LEFT JOIN `{$wpdb->prefix}postmeta` c
                ON (a.ID = c.post_id)
            WHERE a.post_type = %s";

        ACPT_Lite_DB::executeQueryOrThrowException($query, [$postType]);
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * @param string $postType
     * @return void
     * @throws \Exception
     */
    public static function createCustomPostType(string $postType): void
    {
        if (self::isAValidCustomPostType($postType)) {
            $postTypeObject = get_post_type_object($postType);
            $postTypeSupports = get_all_post_type_supports($postType);

            if (
                $postTypeObject->show_ui === true &&
                $postTypeObject->show_in_nav_menus === true
            ) {
                $settings = [
                    'public' => $postTypeObject->public,
                    'publicly_queryable' => $postTypeObject->publicly_queryable,
                    'show_ui' => $postTypeObject->show_ui,
                    'show_in_menu' => $postTypeObject->show_in_menu,
                    'show_in_nav_menus' => $postTypeObject->show_in_nav_menus,
                    'show_in_admin_bar' => $postTypeObject->show_in_admin_bar,
                    'show_in_rest' => $postTypeObject->show_in_rest,
                    'rest_base' => $postTypeObject->rest_base,
                    'menu_position' => isset($postTypeObject->menu_position) ? (int)$postTypeObject->menu_position : null,
                    'capability_type' => $postTypeObject->capability_type,
                    'has_archive' => $postTypeObject->has_archive,
                    'rewrite' => $postTypeObject->rewrite,
                    'custom_rewrite' => $postTypeObject->rewrite['slug'] ?? $postTypeObject->custom_rewrite ?? null,
                    'with_front' => $postTypeObject->rewrite['with_front'] ?? $postTypeObject->with_front ?? null,
                    'feeds' => $postTypeObject->rewrite['feeds'] ?? null,
                    'hierarchical' => $postTypeObject->hierarchical ?? false,
                    'rewrite_hierarchical' => $postTypeObject->rewrite_hierarchical ?? $postTypeObject->hierarchical ?? null,
                    'query_var' => isset($postTypeObject->query_var) ? !empty($postTypeObject->query_var) : null,
                    'custom_query_var' => $postTypeObject->custom_query_var ?? $postTypeObject->query_var ?? null ,
                ];

                $postModel = CustomPostTypeModel::hydrateFromArray([
                    'id' => Uuid::v4(),
                    'name' => $postTypeObject->name,
                    'singular' => $postTypeObject->labels->singular_name ?? $postTypeObject->label,
                    'plural' => $postTypeObject->label,
                    'icon' => (isset($postTypeObject->menu_icon) ? $postTypeObject->menu_icon : 'dashicons-admin-post'),
                    'native' => false,
                    'supports' => array_keys($postTypeSupports),
                    'labels' => json_decode(json_encode($postTypeObject->labels) ?: 'null', true),
                    'settings' => $settings,
                ]);

                self::save($postModel);
                self::registerRelatedTaxonomies($postType);

                ACPT_Lite_DB::invalidateCacheTag(self::class);
            }
        }
    }

    /**
     * @param string $postType
     * @return void
     */
    private static function registerRelatedTaxonomies($postType)
    {
        $args = [
            'public' => true,
            '_builtin' => false,
        ];
        $output = 'objects';
        $operator = 'and';
        $taxonomies = get_taxonomies($args, $output, $operator);

        if (!empty($taxonomies)) {
            foreach ($taxonomies as $taxonomy) {
                if (
                    !empty($taxonomy->object_type)
                    && $taxonomy->object_type[0] === $postType
                ) {
                    TaxonomyRepository::createCustomTaxonomy($taxonomy->name);
                }
            }
        }
    }

    /**
     * @param string $postType
     *
     * @return bool
     */
    private static function isAValidCustomPostType($postType)
    {
        $notAllowed = [
            "post",
            "page",
            "attachment",
            "revision",
            "nav_menu_item",
            "custom_css",
            "customize_changeset",
            "oembed_cache",
            "user_request",
            "wp_block",
            "wp_template",
        ];

        // exclude WooCommerce CPT
        if (class_exists('woocommerce')) {
            $notAllowed[] = 'shop_order';
            $notAllowed[] = 'scheduled-action';
            $notAllowed[] = 'shop_coupon';
            $notAllowed[] = 'product_variation';
            $notAllowed[] = 'shop_order_refund';
        }

        if (in_array($postType, $notAllowed)) {
            return false;
        }

        return true;
    }
}
