<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class TaxonomyRepository extends AbstractRepository
{
    /**
     * Associate a post with a taxonomy
     *
     * @param $postId
     * @param $taxonomyId
     *
     * @throws \Exception
     */
    public static function assocToPostType( $postId, $taxonomyId)
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
    public static function count()
    {
        $baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."`
            ";

        $results = ACPT_Lite_DB::getResults($baseQuery);

        if(empty($results)){
            return 0;
        }

        return (int)$results[0]->count;
    }

    /**
     * Delete taxonomy
     *
     * @param $taxonomy
     *
     * @throws \Exception
     */
    public static function delete($taxonomy)
    {
        $taxonomyId = self::getId($taxonomy);

        if($taxonomyId){
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` WHERE id = %s;", [$taxonomyId]);
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."` WHERE taxonomy_id = %s;", [$taxonomyId]);
            MetaRepository::deleteBelongs(MetaTypes::TAXONOMY, $taxonomy);
        }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete all post's associations with taxonomies
     *
     * @param $postId
     *
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
     * @param $slug
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

        return count($posts) === 1;
    }

    /**
     * Get the registered taxonomies
     *
     * @param array $meta
     *
     * @param bool $lazy
     * @return TaxonomyModel[]
     * @throws \Exception
     * @since    1.0.0
     */
    public static function get(array $meta = [], $lazy = false)
    {
        $results = [];
        $join = '';
        $args = [];

	    if(isset($meta['customPostType'])){
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

        if(isset($meta['id'])){
            $baseQuery .= " AND t.id = %s";
            $args[] = $meta['id'];
        }

	    if(isset($meta['customPostType'])){
		    $baseQuery .= " AND cp.post_name = %s";
		    $args[] = $meta['customPostType'];
	    }

        if(isset($meta['taxonomy'])){
            $baseQuery .= " AND t.slug = %s";
            $args[] = $meta['taxonomy'];
        }

	    if(isset($meta['exclude'])){
		    $baseQuery .= " AND t.slug != %s";
		    $args[] = $meta['exclude'];
	    }

        $baseQuery .= " GROUP BY t.id";
        $baseQuery .= " ORDER BY t.slug ASC";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= '';
        $taxonomies = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($taxonomies as $taxonomy){
        	try {
		        $taxonomyModel = TaxonomyModel::hydrateFromArray([
			        'id' => $taxonomy->id,
			        'slug' => $taxonomy->slug,
			        'singular' => $taxonomy->singular,
			        'plural' => $taxonomy->plural,
			        'native' => $taxonomy->native == '1' ? true : false,
			        'labels' => json_decode($taxonomy->labels, true),
			        'settings' => json_decode($taxonomy->settings, true),
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

		        $count = (count($res) > 0 and isset($res[0]->count) ) ? $res[0]->count : 0;
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

		        foreach ($customPostTypes as $post){
			        $postModel = CustomPostTypeModel::hydrateFromArray([
				        'id' => $post->id,
				        'name' => $post->post_name,
				        'singular' => $post->singular,
				        'plural' => $post->plural,
				        'icon' => $post->icon,
				        'native' => $post->native == '0' ? false : true,
				        'supports' => json_decode($post->supports),
				        'labels' => json_decode($post->labels, true),
				        'settings' => json_decode($post->settings, true),
			        ]);

			        $taxonomyModel->addCustomPostType($postModel);
		        }

		        // Permissions
		        $permissions = PermissionRepository::getByEntityId($taxonomyModel->getId());
		        foreach ($permissions as $permission){
			        $taxonomyModel->addPermission($permission);
		        }

		        $results[] = $taxonomyModel;
	        } catch (\Exception $exception){}
        }

        return $results;
    }

    /**
     * Get the id of a post type by registed name
     *
     * @since    1.0.0
     * @param $taxonomy
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

        if(count($posts) === 1){
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

        foreach ($taxonomies as $taxonomy){
            $names[] = $taxonomy->slug;
        }

        return $names;
    }

    /**
     * @param TaxonomyModel $taxonomyModel
     *
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
     * @param $postId
     * @param $taxonomyId
     *
     * @throws \Exception
     */
    public static function removeAssocPost( $postId, $taxonomyId)
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
	 * @param $taxonomy
	 */
	public static function createCustomTaxonomy($taxonomy)
	{
		try {
			$idTax = Uuid::v4();
			$taxonomyObject = get_taxonomy($taxonomy);

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

			foreach ($taxonomyObject->object_type as $postType){

				$postTypeModels = CustomPostTypeRepository::get([
					'postType' => $postType
				]);

				if(!empty($postTypeModels)){
					$postTypeModel = $postTypeModels[0];

					if($postTypeModel !== null){
						TaxonomyRepository::assocToPostType($postTypeModel->getId(), $idTax);
					}
				}
			}

			ACPT_Lite_DB::flushCache();

		} catch (\Exception $exception){}
	}
}