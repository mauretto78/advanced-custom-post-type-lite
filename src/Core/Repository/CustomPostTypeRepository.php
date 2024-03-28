<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Models\MetaField\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PostMetaSync;
use ACPT_Lite\Utils\WPUtils;

class CustomPostTypeRepository
{
    /**
     * @return int
     */
    public static function count()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery);

        return (int)$results[0]->count;
    }

	/**
	 * Delete a custom post type
	 *
	 * @param $postType
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
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
                        WHERE id = %s
                    ";

	            MetaRepository::deleteAll([
		            'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
		            'find' => $postType,
	            ]);
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
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
            WHERE post_name = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$postType]);

        return count($posts) === 1;
    }

    /**
     * Get the registered custom post types
     *
     * @param array $meta
     * @param bool  $lazy
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
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` cp
            LEFT JOIN `".ACPT_Lite_DB::prefix()."posts` p ON p.post_type = cp.post_name AND p.`post_status` = %s
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
		$taxonomies = ACPT_Lite_DB::getResults("
                    SELECT
                        t.id,
                        t.slug ,
                        t.singular,
                        t.plural,
                        t.labels,
                        t.settings
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` t
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` p ON p.taxonomy_id = t.id
                    WHERE p.custom_post_type_id = %s
                ;", [$postModel->getId()]);

		foreach ($taxonomies as $taxonomy) {
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
			$productData = ACPT_Lite_DB::getResults("
                        SELECT 
                            id,
                            product_data_name,
                            icon,
                            visibility,
                            show_in_ui
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."`
                    ;", []);

			foreach ($productData as $productDatum){
				$wooCommerceProductDataModel = WooCommerceProductDataModel::hydrateFromArray([
					'id' => $productDatum->id,
					'name' => $productDatum->product_data_name,
					'icon' => json_decode($productDatum->icon, true),
					'visibility' => $productDatum->visibility,
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
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."`
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
     * Delete all post meta data for a given fieldIds list
     *
     * @param $fieldIds
     *
     * @throws \Exception
     */
    private static function deletePostMetaData($fieldIds)
    {
        global $wpdb;

        foreach ($fieldIds as $fieldId){

            $baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

            $field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

            if($field->meta_box_name !== null and $field->field_name !== null){
                $metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

                $sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_key=%s";

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaFieldName
                ]);

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaFieldName.'_type'
                ]);
            }
        }
    }
}