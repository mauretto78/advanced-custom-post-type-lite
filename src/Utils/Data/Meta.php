<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\MetaTypes;

class Meta
{
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