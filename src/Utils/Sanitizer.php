<?php

namespace ACPT_Lite\Utils;

use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxFieldModel;
use ACPT_Lite\Core\Models\User\UserMetaBoxFieldModel;

class Sanitizer
{
	/**
	 * Sanitize post type data before saving
	 *
	 * @param $type
	 * @param $rawData
	 *
	 * @return mixed
	 */
	public static function sanitizePostTypeRawData($type, $rawData)
	{
		switch ($type){

			case CustomPostTypeMetaBoxFieldModel::EMAIL_TYPE:
				return sanitize_email($rawData);

			default:
				return sanitize_text_field($rawData);
		}
	}

	/**
	 * Sanitize post type data before saving
	 *
	 * @param $type
	 * @param $rawData
	 *
	 * @return mixed
	 */
	public static function sanitizeTaxonomyRawData($type, $rawData)
	{
		switch ($type){

			case TaxonomyMetaBoxFieldModel::EMAIL_TYPE:
				return sanitize_email($rawData);

			default:
				return sanitize_text_field($rawData);
		}
	}

	/**
	 * Sanitize user meta data before saving
	 *
	 * @param $type
	 * @param $rawData
	 *
	 * @return mixed
	 */
	public static function sanitizeUserMetaFieldRawData($type, $rawData)
	{
		switch ($type){
			case UserMetaBoxFieldModel::EMAIL_TYPE:
				return sanitize_email($rawData);

			default:
				return sanitize_text_field($rawData);
		}
	}

	/**
	 * @param $array
	 *
	 * @return mixed
	 */
	public static function recursiveSanitizeRawData($array)
	{
		foreach ( $array as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = self::recursiveSanitizeRawData($value);
			} elseif(\is_string($value)){
				$value = self::sanitizeHTML($value);
				$value = self::rebuildPHP($value);
			} elseif(\is_bool($value)) {
				$value = (bool)( $value );
			} elseif (\is_null($value)){
				$value = null;
			}
		}

		return $array;
	}

	/**
	 * @param $data
	 *
	 * @return string
	 */
	private static function sanitizeHTML($data)
	{
		// Fix &entity\n;
		$data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
		$data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
		$data = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $data);
		$data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');

		// Remove any attribute starting with "on" or xmlns
		$data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);

		// Remove javascript: and vbscript: protocols
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
		$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);

		// Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
		$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);

		// Remove namespaced elements (we do not need them)
		$data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);

		do {
			// Remove really unwanted tags
			$old_data = $data;
			$data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
		}

		while ($old_data !== $data);

		return $data;
	}

	/**
	 * @param $value
	 *
	 * @return string|string[]
	 */
	private static function rebuildPHP($value)
	{
		preg_match_all('/&lt;\?php(.*?)\?&gt;/iu', $value, $phpMatches);

		if(empty($phpMatches[0])){
			return $value;
		}

		foreach ($phpMatches[0] as $match){
			$value = str_replace($match, str_replace(['&lt;','&gt;'], ['<','>'], $match), $value);
		}

		return $value;
	}

	/**
	 * @param $field
	 *
	 * @return mixed
	 */
	public static function escapeField($field)
	{
		$allowedTags = [
			'a' => [
				'class' => [],
				'id' => [],
				'href' => [],
				'title' => [],
				'style' => [],
				'data-index' => [],
				'data-group-id' => [],
				'data-target-id' => []
			],
			'br' => [],
			'img' => [
				'class' => [],
				'id' => [],
				'src' => [],
				'alt' => [],
				'title' => [],
			],
			'iframe' => [
				'title' => [],
				'width' => [],
				'height' => [],
				'src' => [],
				'frameborder' => [],
				'allow' => [],
				'allowfullscreen' => [],
			],
			'strong' => [],
			'div' => [
				'data-target' => [],
				'data-target-copy' => [],
				'data-index' => [],
				'style' => [],
				'class' => [],
				'id' => [],
				'draggable' => [],
			],
			'label' => [
				'for' => [],
				'style' => [],
				'type' => [],
				'name' => [],
				'class' => [],
				'id' => []
			],
			'input' => [
				'data-index' => [],
				'checked' => [],
				'required' => [],
				'value' => [],
				'readonly' => [],
				'style' => [],
				'type' => [],
				'name' => [],
				'class' => [],
				'id' => [],
				'minlength' => [],
				'maxlength' => [],
				'min' => [],
				'max' => [],
				'step' => [],
				'pattern' => [],
				'placeholder' => [],
			],
			'select' => [
				'required' => [],
				'readonly' => [],
				'style' => [],
				'multiple' => [],
				'type' => [],
				'name' => [],
				'class' => [],
				'id' => []
			],
			'textarea' => [
				'required' => [],
				'rows' => [],
				'cols' => [],
				'readonly' => [],
				'style' => [],
				'multiple' => [],
				'type' => [],
				'name' => [],
				'class' => [],
				'id' => []
			],
			'option' => [
				'selected' => [],
				'value' => [],
				'data-symbol' => [],
				'data-placeholder' => [],
			],
			'button' => [
				'value' => [],
				'data-target-id' => [],
				'readonly' => [],
				'style' => [],
				'multiple' => [],
				'type' => [],
				'name' => [],
				'class' => [],
				'id' => []
			],
			'video' => [
				'controls' => [],
				'width' => [],
				'height' => [],
				'muted' => [],
			],
			'source' => [
				'src' => [],
				'type' => [],
			],
			'ul' => [
				'style' => [],
				'class' => [],
				'id' => []
			],
			'li' => [
				'style' => [],
				'class' => [],
				'id' => [],
				'draggable' => [],
			],
			'span' => [
				'style' => [],
				'class' => [],
				'id' => []
			],
			'svg' => [
				'xmlns' => [],
				'aria-hidden' => [],
				'role' => [],
				'class' => [],
				'width' => [],
				'height' => [],
				'preserveAspectRatio' => [],
				'viewBox' => [],
				'data-width' => [],
				'data-height' => [],
				'data-icon' => [],
				'style' => [],
			],
			'path' => [
				'd' => [],
				'fill' => [],
			]
		];

		return wp_kses($field, $allowedTags);
	}
}