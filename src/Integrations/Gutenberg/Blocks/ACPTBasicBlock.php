<?php

namespace ACPT_Lite\Integrations\Gutenberg\Blocks;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Country;
use ACPT_Lite\Utils\PHP\Maps;
use ACPT_Lite\Utils\PHP\Phone;
use ACPT_Lite\Utils\Wordpress\WPAttachment;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class ACPTBasicBlock
{
	/**
	 * @param $attributes
	 * @param $content
	 *
	 * @return string
	 */
	public function render($attributes, $content)
	{
		if(isset($attributes['field'])){

			$closingDiv = '</div>';
			$openingDiv = str_replace($closingDiv, '', $content);

			$field = json_decode($attributes['field'], true);
			$className = $attributes['className'] ?? null;
			$align = $attributes['align'] ?? 'left';

			if(!is_array($field) or empty($field)){
				return null;
			}

			$rawData = $this->getRawData($field, $attributes);

			if($rawData === null){
				return null;
			}

			return $openingDiv.'<p style="text-align: '.$align.';" class="'.$className.'">'.$rawData.'</p>'.$closingDiv;
		}

		return null;
	}

	/**
	 * @param $field
	 * @param array $attributes
	 *
	 * @return mixed|string|null
	 */
	private function getRawData($field, $attributes = [])
	{
		$findValue = null;

		// try to calculate $find and $findValue
		if(isset($field['belongsTo']) and $field['belongsTo'] === MetaTypes::TAXONOMY){
			$find = 'term_id';
			$termId = null;

			// Front-end rendering
			$queriedObject = get_queried_object();
			if($queriedObject instanceof \WP_Term){
				$termId = $queriedObject->term_id;
			}

			// try to calculate $termId from HTTP_REFERER (AJAX request)
			if($termId === null){
				$referer = $_SERVER['HTTP_REFERER'];
				$parsedReferer = parse_url($referer);
				parse_str(  $parsedReferer['query'], $parsedRefererArray );

				$prefix = wp_get_theme()->get_stylesheet()."//".$field['find']."-";
				$taxonomySlug = str_replace($prefix, "", $parsedRefererArray['postId']);

				$term = get_term_by('slug', $taxonomySlug, $field['find'] );
				$termId = $term->term_id;
			}

			$findValue = (isset($attributes['postId']) and $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : $termId;
		} else {
			global $post;

			$find = 'post_id';
			$findValue = (isset($attributes['postId']) and $attributes['postId'] < 99999999999999999) ? $attributes['postId'] : $post->ID;
		}

		// static preview if no context is available
		if(empty($findValue)){
			return '{acpt_'.$field['box'].'_'.$field['field'].'}';
		}

		$args = [
			$find => $findValue,
			'box_name' => $field['box'],
			'field_name' => $field['field'],
		];

		$rawData = get_acpt_field($args);

		if(empty($rawData)){
			return null;
		}

		switch ($field['type']){

			// DATE_TYPE
			case MetaFieldModel::DATE_TYPE:
				$format = !empty($attributes['dateFormat']) ? $attributes['dateFormat'] : get_option( 'date_format' ) ?? 'Y-m-d';

				return  date_i18n($format, strtotime($rawData));

			// EMAIL_TYPE
			case MetaFieldModel::EMAIL_TYPE:

				if(isset($attributes['display']) and $attributes['display'] === 'link'){
					return '<a href="mailto:'.sanitize_email(strip_tags($rawData)).'">'.$rawData.'</a>';
				}

				return $rawData;

			// TEXTAREA_TYPE
			case MetaFieldModel::TEXTAREA_TYPE:

				if(!is_string($rawData)){
					return null;
				}

				return WPUtils::renderShortCode($rawData, true);

			default:
				return do_shortcode($rawData);
		}
	}
}