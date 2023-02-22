<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Costants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class TaxonomyRepository
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
        }
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

			if(!$lazy){

				// Meta boxes
				$metaBoxQuery = "
                    SELECT 
                        id, 
                        meta_box_name as name,
                        sort
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."`
                    WHERE taxonomy = %s
                ";
				$metaBoxArgs = [$taxonomy->slug];

				if(isset($meta['boxName'])){
					$metaBoxQuery .= " AND meta_box_name = %s";
					$metaBoxArgs[] = $meta['boxName'];
				}

				$metaBoxQuery .= " ORDER BY sort;";

				$boxes = ACPT_Lite_DB::getResults($metaBoxQuery, $metaBoxArgs);

				foreach ($boxes as $boxIndex => $box){
					$boxModel = TaxonomyMetaBoxModel::hydrateFromArray([
						'id' => $box->id,
						'taxonomy' => $taxonomy->slug,
						'name' => $box->name,
						'sort' => $box->sort
					]);

					$sql = "
                        SELECT
                            id,
                            field_name as name,
                            field_type,
                            field_default_value,
                            field_description,
                            required,
                            showInArchive,
                            sort
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
                        WHERE meta_box_id = %s
                    ";

					if(isset($meta['excludeFields'])){
						$sql .= " AND id NOT IN ('".implode("','", $meta['excludeFields'])."')";
					}

					$sql .= " ORDER BY sort;";

					$fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

					// Meta box fields
					foreach ($fields as $fieldIndex => $field){
						$fieldModel = MetaRepository::hydrateMetaBoxFieldModel($field, $boxModel);
						$boxModel->addField($fieldModel);
					}

					$taxonomyModel->addMetaBox($boxModel);
				}
			}

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

			$results[] = $taxonomyModel;
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
    }
}