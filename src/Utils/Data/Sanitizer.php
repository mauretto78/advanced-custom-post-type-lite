<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\HTMLTag;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

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
	public static function sanitizeRawData($type, $rawData)
	{
		switch ($type){

			case MetaFieldModel::ICON_TYPE:
				return Sanitizer::sanitizeSVG($rawData);

			case MetaFieldModel::EMAIL_TYPE:
				return sanitize_email($rawData);

			case MetaFieldModel::URL_TYPE:
				return esc_url_raw($rawData);

			case MetaFieldModel::TEXTAREA_TYPE:
				return stripslashes_deep(sanitize_textarea_field($rawData));

			case MetaFieldModel::EDITOR_TYPE:
			case MetaFieldModel::HTML_TYPE:
				return Sanitizer::wpKsesWithSVG( $rawData );

			case is_array($rawData):
			case MetaFieldModel::GALLERY_TYPE:
			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::USER_MULTI_TYPE:
				return Sanitizer::recursiveSanitizeRawData($rawData);
				break;

			default:
				return stripslashes_deep(sanitize_text_field($rawData));
		}
	}

    /**
     * @param $array
     *
     * @return mixed
     */
    public static function recursiveSanitizeRawData($array)
    {
    	if(is_string($array)){
    		return sanitize_text_field($array);
	    }

        foreach ( $array as $key => &$value ) {
            if ( is_array( $value ) ) {
                $value = self::recursiveSanitizeRawData($value);
            } elseif(Strings::contains('</svg>', $value) or Strings::contains('&lt;/svg&gt;', $value)){
	            $value = self::sanitizeSVG($value);
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
	 * Improved wp_kses() with support for SVG
	 *
	 * @param $string
	 *
	 * @return string
	 */
    private static function wpKsesWithSVG($string)
    {
	    $svgArgs = [
		    'svg'   => [
			    'class'           => true,
			    'aria-hidden'     => true,
			    'aria-labelledby' => true,
			    'role'            => true,
			    'xmlns'           => true,
			    'width'           => true,
			    'height'          => true,
			    'viewBox'         => true,
			    'viewbox'         => true
		    ],
		    'g'     => [ 'fill' => true ],
		    'title' => [ 'title' => true ],
		    'path'  => [
			    'd'    => true,
			    'fill' => true
		    ]
	    ];

	    $ksesDefaults = wp_kses_allowed_html( 'post' );
	    $allowedTags = array_merge( $ksesDefaults, $svgArgs );

	    return wp_kses( self::escapeField($string), $allowedTags );
    }

	/**
	 * @param $svg
	 *
	 * @return mixed
	 */
    private static function sanitizeSVG($svg)
    {
    	return self::escapeField($svg);
    }

    /**
     * @param $string
     *
     * @return string
     */
    private static function sanitizeHTML($string)
    {
        // Fix &entity\n;
        $string = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $string);
        $string = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $string);
        $string = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $string);
        $string = html_entity_decode($string, ENT_COMPAT, 'UTF-8');

        // Remove any attribute starting with "on" or xmlns
        $string = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $string);

        // Remove javascript: and vbscript: protocols
        $string = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $string);
        $string = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $string);
        $string = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $string);

        // Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
        $string = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $string);
        $string = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $string);
        $string = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $string);

        // Remove namespaced elements (we do not need them)
        $string = preg_replace('#</*\w+:\w[^>]*+>#i', '', $string);

        do {
            // Remove really unwanted tags
            $old_data = $string;
            $string   = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $string);
        }

        while ( $old_data !== $string);

        return $string;
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
        return wp_kses($field, HTMLTag::ALLOWED_FORMATS);
    }
}