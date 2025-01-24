<?php

namespace ACPT_Lite\Integrations\Gutenberg\Blocks;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Date;
use ACPT_Lite\Utils\PHP\Email;
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
		if(isset($field['belongsTo']) and $field['belongsTo'] === MetaTypes::OPTION_PAGE){
			$findValue = $field['find'];
			$find = 'option_page';
		} elseif(isset($field['belongsTo']) and $field['belongsTo'] === MetaTypes::TAXONOMY){
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

		if(isset($field['block_name'])){
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
				'block_name' => $field['block_name'],
				'block_index' => $field['block_index'],
			];

			$rawData = get_acpt_block_child_field($args);
		} elseif(isset($field['parent_field'])){
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
			];

			$rawData = get_acpt_child_field($args);
		} else {
			$args = [
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
			];

			$rawData = get_acpt_field($args);
		}

		if(!is_acpt_field_visible($args)){
			return null;
		}

		if(empty($rawData)){
			return null;
		}

		switch ($field['type']){

			// DATE_TYPE
			case MetaFieldModel::DATE_TYPE:

				if( !empty($attributes['dateFormat']) and Date::isDateFormatValid($attributes['dateFormat']) ){
					return date_i18n($attributes['dateFormat'], strtotime($rawData));
				}

				return $rawData;

			// EMAIL_TYPE
			case MetaFieldModel::EMAIL_TYPE:

				if(!is_string($rawData)){
					return null;
				}

				if(isset($attributes['display']) and $attributes['display'] === 'link' and $rawData !== null){
					return '<a href="mailto:'.Email::sanitize($rawData).'">'.$rawData.'</a>';
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