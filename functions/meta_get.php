<?php

use ACPT_Lite\Core\CQRS\Query\FetchMetaFieldValueQuery;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

if( !function_exists('get_acpt_field') )
{
	/**
	 * @param array $args
	 *
	 * @return mixed|null
	 */
	function get_acpt_field($args = [])
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
				'comment_id' => [
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
			$result = $query->execute();

			if(is_array($result) and count($field_name) === 2){
				$r = [];

				foreach ($result as $item){
					if(isset($item[$field_name[1]])){
						$r[] = $item[$field_name[1]];
					}
				}

				return $r;
			}

			if(is_array($result) and count($field_name) === 3){
				$r = [];

				foreach ($result as $item){
					if(isset($item[$field_name[1]])){
						foreach ($item[$field_name[1]] as $nested_item){
							if(isset($nested_item[$field_name[2]])){
								$r[] = $nested_item[$field_name[2]];
							}
						}
					}
				}

				return $r;
			}

			return $result;

		} catch (\Exception $exception){
			return null;
		}
	}
}
