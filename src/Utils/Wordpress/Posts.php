<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Includes\ACPT_Lite_DB;

class Posts
{
    /**
     * @param $termId
     * @return array
     */
    public static function getForTermId($termId): array
    {
        global $wpdb;

        $sql = "
            SELECT r.object_id, r.term_taxonomy_id, t.taxonomy FROM  `{$wpdb->prefix}term_relationships` r
            LEFT JOIN `{$wpdb->prefix}term_taxonomy` t ON t.term_taxonomy_id = r.term_taxonomy_id
            WHERE r.term_taxonomy_id = %s 
        ";

        $preparedQuery = $wpdb->prepare($sql, [$termId]);

        return $wpdb->get_results($preparedQuery);
    }

	/**
	 * @param array $args
	 *
	 * @return array
	 */
	public static function getList($args = []): array
	{
		try {
			global $wpdb;

			$postTypeParam = isset($args['post_type']) ? $args['post_type'] : null;
			$postStatusParam = isset($args['post_status']) ? $args['post_status'] : null;
			$taxonomyParam = isset($args['taxonomy']) ? $args['taxonomy'] : null;

			$posts = [];
			$postTypes = get_post_types([
				'public'  => true,
				'show_ui' => true,
			]);

			if($postTypeParam !== null){
				$postTypes = array_filter($postTypes, function ($postType) use($postTypeParam) {
					return $postType === $postTypeParam;
				});
			}

			foreach ($postTypes as $postType){

				$childPosts = [];
				$postStatus = ($postStatusParam !== null) ? $postStatusParam : 'publish';
				$queryArgs = [$postType, $postStatus];

				$sql = "
					SELECT ID, post_title FROM `{$wpdb->prefix}posts` p
					LEFT JOIN `{$wpdb->prefix}term_relationships` t  ON (p.ID = t.object_id) 
					WHERE p.post_type = %s 
					AND p.post_status = %s
				";

				if($taxonomyParam !== null){
					$sql .= ' AND t.term_taxonomy_id = %d';
					$queryArgs[] = (int)$taxonomyParam;
				}

				$fetchedPosts = ACPT_Lite_DB::getResults($sql, $queryArgs);

				foreach ($fetchedPosts as $fetchedPost){
					$childPosts[$fetchedPost->ID] = $fetchedPost->post_title;
				}

				$posts[] = [
					'postType' => $postType,
					'posts' => $childPosts
				];
			}

			return $posts;
		} catch (\Exception $exception){
			return [];
		}
	}
}
