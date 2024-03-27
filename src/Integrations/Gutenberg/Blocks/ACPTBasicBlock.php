<?php

namespace ACPT_Lite\Integrations\Gutenberg\Blocks;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

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
		global $post;

		$find = 'post_id';
		$findValue = $post->ID;

		if(isset($field['block_name'])){
			$rawData = get_acpt_block_child_field([
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
				'block_name' => $field['block_name'],
				'block_index' => $field['block_index'],
			]);
		} elseif(isset($field['parent_field'])){
			$rawData = get_acpt_child_field([
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
				'parent_field_name' => $field['parent_field'],
				'index' => $field['index'],
			]);
		} else {
			$rawData = get_acpt_field([
				$find => $findValue,
				'box_name' => $field['box'],
				'field_name' => $field['field'],
			]);
		}

		if($rawData === null){
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
					return '<a href="mailto:'.$rawData.'">'.$rawData.'</a>';
				}

				return $rawData;

			default:
				return $rawData;
		}
	}
}