<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class Meta
{
	/**
	 * @param $id
	 * @param $belongsTo
	 * @param $key
	 */
	public static function delete($id, $belongsTo, $key)
	{
		switch($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				delete_post_meta((int)$id, $key);
				break;

			case MetaTypes::OPTION_PAGE:
				delete_option($key);
				break;

			case MetaTypes::TAXONOMY:
				delete_term_meta((int)$id, $key);
				break;

			case MetaTypes::USER:
				delete_user_meta((int)$id, $key);
				break;

			case MetaTypes::COMMENT:
				delete_comment_meta((int)$id, $key);
				break;
		}
	}

	/**
	 * @param $belongsTo
	 * @param array $args
	 *
	 * @throws \Exception
	 */
	public static function deleteBy($belongsTo, $args = [])
	{
		global $wpdb;

		$metaId = (isset($args['meta_id']) and !empty($args['meta_id'])) ? $args['meta_id'] : null;
		$id = (isset($args['id']) and !empty($args['id'])) ? $args['id'] : null;
		$key = (isset($args['key']) and !empty($args['key'])) ? $args['key'] : null;
		$value = (isset($args['value']) and !empty($args['value'])) ? $args['value'] : null;
		$queryArgs = [];

		switch ($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				$sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE 1=1";

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND post_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

			case MetaTypes::TAXONOMY:
				$sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE 1=1";

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND term_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

				break;

			case MetaTypes::USER:
				$sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE 1=1";

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND user_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

			case MetaTypes::OPTION_PAGE:
				$sql = "DELETE FROM `{$wpdb->prefix}options` WHERE 1=1";

				if($metaId){
					$sql .= ' AND option_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND option_name = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND option_value = %s';
					$queryArgs[] = $value;
				}

				break;
		}

		if(isset($sql)){
			ACPT_Lite_DB::executeQueryOrThrowException($sql, $queryArgs);
		}
	}

	/**
	 * @param $belongsTo
	 * @param $id
	 *
	 * @throws \Exception
	 */
	public static function deleteByMetaId($belongsTo, $id)
	{
		global $wpdb;

		switch ($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				$sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_id = %d";
				break;

			case MetaTypes::TAXONOMY:
				$sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE meta_id = %d";
				break;
			case MetaTypes::USER:
				$sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE meta_id = %d";
				break;

			case MetaTypes::OPTION_PAGE:
				$sql = "DELETE FROM `{$wpdb->prefix}options` WHERE option_id = %d";
				break;
		}

		if(isset($sql)){
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$id]);
		}
	}

	/**
	 * @param string $id
	 * @param string $belongsTo
	 * @param string $key
	 * @param bool $single
	 *
	 * @return mixed|null
	 */
	public static function fetch($id, $belongsTo, $key, $single = true)
	{
		$fetched = null;

		switch ($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				$fetched = get_post_meta((int)$id, $key, $single);
				break;

			case MetaTypes::TAXONOMY:
				$fetched = get_term_meta((int)$id, $key, $single);
				break;

			case MetaTypes::OPTION_PAGE:
				$fetched = get_option($key);
				break;

			case MetaTypes::USER:
				$fetched = get_user_meta((int)$id, $key, $single);
				break;

			case MetaTypes::COMMENT:
				$fetched = get_comment_meta((int)$id, $key, $single);
				break;
		}

		// in case of failure, return null
		if($fetched === false or empty($fetched)){
			return null;
		}

		return $fetched;
	}

	/**
	 * @param $belongsTo
	 * @param array $args
	 *
	 * @return array
	 */
	public static function fetchBy($belongsTo, $args = [])
	{
		global $wpdb;

		$metaIdIn = (isset($args['meta_id_in']) and !empty($args['meta_id_in'])) ? $args['meta_id_in'] : null;
		$metaIdNotIn = (isset($args['meta_id_not_in']) and !empty($args['meta_id_not_in'])) ? $args['meta_id_not_in'] : null;
		$metaId = (isset($args['meta_id']) and !empty($args['meta_id'])) ? $args['meta_id'] : null;
		$id = (isset($args['id']) and !empty($args['id'])) ? $args['id'] : null;
		$key = (isset($args['key']) and !empty($args['key'])) ? $args['key'] : null;
		$value = (isset($args['value']) and !empty($args['value'])) ? $args['value'] : null;
		$queryArgs = [];

		switch ($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				$sql = "SELECT * FROM `{$wpdb->prefix}postmeta` WHERE 1=1";

				if($metaIdIn and is_array($metaIdIn) and !empty($metaIdIn)){
					$sql .= " AND post_id IN ('".implode("','", $metaIdIn) . "')";
				}

				if($metaIdNotIn and is_array($metaIdNotIn) and !empty($metaIdNotIn)){
					$sql .= " AND post_id NOT IN ('".implode("','", $metaIdNotIn) . "')";
				}

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND post_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

			case MetaTypes::TAXONOMY:
				$sql = "SELECT * FROM `{$wpdb->prefix}termmeta` WHERE 1=1";

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND term_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

				break;

			case MetaTypes::USER:
				$sql = "SELECT * FROM `{$wpdb->prefix}usermeta` WHERE 1=1";

				if($metaId){
					$sql .= ' AND meta_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND meta_key = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND meta_value = %s';
					$queryArgs[] = $value;
				}

				if($id){
					$sql .= ' AND user_id = %d';
					$queryArgs[] = (int)$id;
				}

				break;

			case MetaTypes::OPTION_PAGE:
				$sql = "SELECT * FROM `{$wpdb->prefix}options` WHERE 1=1";

				if($metaId){
					$sql .= ' AND option_id = %d';
					$queryArgs[] = (int)$metaId;
				}

				if($key){
					$sql .= ' AND option_name = %s';
					$queryArgs[] = $key;
				}

				if($value){
					$sql .= ' AND option_value = %s';
					$queryArgs[] = $value;
				}

				break;
		}

		if(isset($sql)){
			return ACPT_Lite_DB::getResults($sql, $queryArgs);
		}

		return [];
	}

	/**
	 * @param $id
	 * @param $belongsTo
	 * @param $key
	 * @param $value
	 *
	 * @return bool|int|\WP_Error
	 */
	public static function save($id, $belongsTo, $key, $value)
	{
		$value = wp_unslash($value);

		switch($belongsTo){
			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:
				return update_post_meta((int)$id, $key, $value);

			case MetaTypes::OPTION_PAGE:
				return update_option($key, $value);

			case MetaTypes::TAXONOMY:
				return update_term_meta((int)$id, $key, $value);

			case MetaTypes::USER:
				return update_user_meta((int)$id, $key, $value);

			case MetaTypes::COMMENT:
				return update_comment_meta((int)$id, $key, $value);
		}
	}
}