<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class CustomPostTypeRepository extends AbstractRepository
{
    /**
     * @return int
     */
    public static function count()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "`
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery);

        return (int)$results[0]->count;
    }

    /**
     * Delete a custom post type
     *
     * @param string $postType
     * @param bool $deletePosts
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.0
     */
    public static function delete($postType, $deletePosts = false)
    {
        if($postType === 'post' or $postType === 'page'){
            throw new \Exception('You cannot delete page or post CPT.');
        }

        if(self::exists($postType)) {

            $postModel = self::get([
                    'postType' => $postType
            ])[0];

            ACPT_Lite_DB::startTransaction();

            try {
                $sql = "
                    DELETE
                        FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "`
                        WHERE id = %s
                    ";

	            MetaRepository::deleteBelongs( MetaTypes::CUSTOM_POST_TYPE, $postType);

                TaxonomyRepository::deleteAssociations($postModel->getId());

                if($postModel->isWooCommerce()){
                    WooCommerceProductDataRepository::clear();
                }

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$postModel->getId()]);
                ACPT_Lite_DB::commitTransaction();
	            ACPT_Lite_DB::invalidateCacheTag(self::class);
            } catch (\Exception $exception){
                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            if($deletePosts){
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
     * @param $postType
     *
     * @return bool
     */
    public static function exists($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$postType]);

        return count($posts) === 1;
    }
    
    /**
     * Get the registered custom post types
     *
     * @param array $meta
     *
     * @return CustomPostTypeModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = [])
    {
        $results = [];
        $args = [];

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
            FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "` cp
            LEFT JOIN `" . ACPT_Lite_DB::prefix() . "posts` p ON p.post_type = cp.post_name AND p.`post_status` = %s
            WHERE 1=1
            ";

        $args[] = 'publish';

        if(isset($meta['id'])){
            $baseQuery .= " AND cp.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['postType'])){
            $baseQuery .= " AND cp.post_name = %s ";
            $args[] = $meta['postType'];
        }

	    if(isset($meta['exclude'])){
		    $baseQuery .= " AND cp.post_name != %s ";
		    $args[] = $meta['exclude'];
	    }

        $baseQuery .= " GROUP BY cp.id";
        $baseQuery .= " ORDER BY cp.native DESC, cp.post_name ASC";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $posts = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($posts as $post){
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
		            'settings' => json_decode($post->settings, true),
	            ]);

	            // Add more data
	            $postModel = self::addTaxonomiesToPostTypeModel($postModel);
	            $postModel = self::addWooCommerceDataToPostTypeModel($postModel);
	            $postModel->setPostCount($post->post_count);

	            $results[] = $postModel;
            } catch (\Exception $exception){}
        }

        return $results;
    }

    /**
     * @param CustomPostTypeModel $postModel
     *
     * @return CustomPostTypeModel
     * @throws \Exception
     */
    private static function addTaxonomiesToPostTypeModel(CustomPostTypeModel $postModel)
    {
        $taxonomies = ACPT_Lite_DB::getResults( "
                    SELECT
                        t.id,
                        t.slug ,
                        t.singular,
                        t.plural,
                        t.labels,
                        t.native,
                        t.settings
                    FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY) . "` t
                    JOIN `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT) . "` p ON p.taxonomy_id = t.id
                    WHERE p.custom_post_type_id = %s
                ;", [$postModel->getId()]);

        foreach ($taxonomies as $taxonomy) {
            try {
	            $taxonomyModel = TaxonomyModel::hydrateFromArray([
		            'id' => $taxonomy->id,
		            'slug' => $taxonomy->slug,
		            'singular' => $taxonomy->singular,
		            'plural' => $taxonomy->plural,
		            'native' => (isset($taxonomy->native) and $taxonomy->native == '1') ? true : false,
		            'labels' => json_decode($taxonomy->labels, true),
		            'settings' => json_decode($taxonomy->settings, true),
	            ]);

	            $postModel->addTaxonomy($taxonomyModel);
            } catch (\Exception $exception){}
        }

        return $postModel;
    }

    /**
     * @param CustomPostTypeModel $postModel
     *
     * @return CustomPostTypeModel
     * @throws \Exception
     */
    private static function addWooCommerceDataToPostTypeModel( CustomPostTypeModel $postModel)
    {
        if($postModel->isWooCommerce()){
            $productData = ACPT_Lite_DB::getResults( "
                        SELECT 
                            id,
                            product_data_name,
                            icon,
                            visibility,
                            show_in_ui
                        FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA) . "`
                    ;", []);

            foreach ($productData as $productDatum){
                $wooCommerceProductDataModel = WooCommerceProductDataModel::hydrateFromArray([
                        'id' => $productDatum->id,
                        'name' => $productDatum->product_data_name,
                        'icon' => json_decode($productDatum->icon, true),
                        'visibility' => $productDatum->visibility,
                        'showInUI' => $productDatum->show_in_ui == '0' ? false : true,
                ]);

                $productDataFields = ACPT_Lite_DB::getResults( "
                            SELECT 
                                id,
                                product_data_id,
                                field_name,
                                field_type,
                                required,
                                sort
                            FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD) . "`
                            WHERE product_data_id = %s ORDER BY sort DESC
                        ;", [$productDatum->id]);

                foreach ($productDataFields as $productDataField){
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
     * Get the id of a post type by registered name
     *
     * @since    1.0.0
     * @param $postType
     *
     * @return string|null
     */
    public static function getId($postType)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [
                $postType
        ]);

        if(count($posts) === 1){
            return $posts[0]->id;
        }

        return null;
    }
    
    /**
     * Save custom post type data
     *
     * @param CustomPostTypeModel $model
     *
     * @throws \Exception
     */
    public static function save(CustomPostTypeModel $model)
    {
        $sql = "
            INSERT INTO `" . ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE) . "` 
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
     * @param $postType
     *
     * @throws \Exception
     */
    private static function deletePostType($postType)
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
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	public static function createCustomPostType($postType)
	{
		if(self::isAValidCustomPostType($postType)){
			$postTypeObject = get_post_type_object($postType);
			$postTypeSupports = get_all_post_type_supports($postType);

			if(
				$postTypeObject->show_ui === true and
				$postTypeObject->show_in_nav_menus === true and
				is_string($postTypeObject->menu_icon)
			){

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
					'custom_rewrite' => isset($postTypeObject->custom_rewrite) ? $postTypeObject->custom_rewrite : null,
					'query_var' => isset($postTypeObject->query_var) ? $postTypeObject->query_var : null,
					'custom_query_var' => isset($postTypeObject->custom_query_var) ? $postTypeObject->custom_query_var : null ,
				];

				// WPGraphQL
				if(is_plugin_active( 'wp-graphql/wp-graphql.php' )){
					$settings['show_in_graphql'] = isset($postTypeObject->show_in_graphql) ? $postTypeObject->show_in_graphql : false;
					$settings['graphql_single_name'] = isset($postTypeObject->show_in_graphql) ? $postTypeObject->graphql_single_name : null;
					$settings['graphql_plural_name'] = isset($postTypeObject->graphql_plural_name) ? $postTypeObject->graphql_plural_name : null;
				}

				$postModel = CustomPostTypeModel::hydrateFromArray([
					'id' => Uuid::v4(),
					'name' => $postTypeObject->name,
					'singular' => $postTypeObject->label,
					'plural' => $postTypeObject->label,
					'icon' => (isset($postTypeObject->menu_icon) ? $postTypeObject->menu_icon : 'dashicons-admin-site-alt3'),
					'native' => false,
					'supports' => array_keys($postTypeSupports),
					'labels' => json_decode(json_encode($postTypeObject->labels), true),
					'settings' => $settings,
				]);

				self::save($postModel);
				self::registerRelatedTaxonomies($postType);

				ACPT_Lite_DB::invalidateCacheTag(self::class);
			}
		}
	}

	/**
	 * @param $postType
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

		if(!empty($taxonomies)){
			foreach ($taxonomies as $taxonomy){
				if(
					is_array($taxonomy->object_type) and
					!empty($taxonomy->object_type)
					and $taxonomy->object_type[0] === $postType
				){
					TaxonomyRepository::createCustomTaxonomy($taxonomy->name);
				}
			}
		}
	}

	/**
	 * @param $postType
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
		if ( class_exists( 'woocommerce' ) ) {
			$notAllowed[] = 'shop_order';
			$notAllowed[] = 'scheduled-action';
			$notAllowed[] = 'shop_coupon';
			$notAllowed[] = 'product_variation';
			$notAllowed[] = 'shop_order_refund';
		}

		if(in_array($postType, $notAllowed)){
			return false;
		}

		return true;
	}
}