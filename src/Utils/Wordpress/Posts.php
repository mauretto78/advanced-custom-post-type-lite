<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Includes\ACPT_Lite_DB;

class Posts
{
	/**
	 * @return array
	 */
	public static function getList(): array
	{
		global $wpdb;

		$posts = [];
		$postTypes = get_post_types([
			'public'  => true,
			'show_ui' => true,
		]);

		foreach ($postTypes as $postType){

			$childPosts = [];
			$sql = "SELECT ID, post_title FROM `{$wpdb->prefix}posts` WHERE post_type = %s AND post_status = %s";
			$fetchedPosts = ACPT_Lite_DB::getResults($sql, [$postType, 'publish']);

			foreach ($fetchedPosts as $fetchedPost){
				$childPosts[$fetchedPost->ID] = $fetchedPost->post_title;
			}

			$posts[] = [
				'postType' => $postType,
				'posts' => $childPosts
			];
		}

		return $posts;
	}
}