<?php

namespace ACPT_Lite\Integrations\Gutenberg\Blocks;

use ACPT_Lite\Core\CQRS\Query\FetchMetaFieldValueQuery;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

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

		$rawData = $this->getAcptField([
			$find => $findValue,
			'box_name' => $field['box'],
			'field_name' => $field['field'],
		]);

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

	/**
	 * @param array $args
	 *
	 * @return mixed|null
	 */
	private function getAcptField($args = [])
	{
		try {
			// validate array
			$mandatory_keys = [
				'post_id' => [
					'required' => false,
					'type' => 'integer',
				],
				'term_id' => [
					'required' => false,
					'type' => 'integer',
				],
				'user_id' => [
					'required' => false,
					'type' => 'integer',
				],
				'option_page' => [
					'required' => false,
					'type' => 'string',
				],
				'box_name' => [
					'required' => true,
					'type' => 'string',
				],
				'field_name' => [
					'required' => true,
					'type' => 'string',
				],
			];

			$validator = new ArgumentsArrayValidator();

			if(!$validator->validate($mandatory_keys, $args)){
				return null;
			}

			$field_name = explode(".", $args['field_name']);

			$meta_field_model = MetaRepository::getMetaFieldByName([
				'boxName' => $args['box_name'] ?? $args['boxName'],
				'fieldName' => $field_name[0]
			]);

			if($meta_field_model === null){
				return null;
			}

			$query = new FetchMetaFieldValueQuery($meta_field_model, $args);

			return $query->execute();
		} catch (\Exception $exception){
			return null;
		}
	}
}