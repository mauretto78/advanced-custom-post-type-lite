<?php

use ACPT_Lite\Core\CQRS\Command\SaveMetaFieldValueCommand;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

if( !function_exists('save_acpt_meta_field_value') )
{
	/**
	 * Add or update a field value. This function replaces:
	 *
	 * - add_acpt_meta_field_value
	 * - edit_acpt_meta_field_value
	 *
	 * @param array $args
	 *
	 * @return bool|mixed
	 */
	function save_acpt_meta_field_value($args = [])
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
				'value' => [
					'required' => true,
					'type' => 'boolean|float|double|string|integer|array|object',
				],
			];

			$validator = new ArgumentsArrayValidator();

			if(!$validator->validate($mandatory_keys, $args)){
				return false;
			}

			$meta_field_model = MetaRepository::getMetaFieldByName([
				'boxName' => $args['box_name'] ?? $args['boxName'],
				'fieldName' => $args['field_name'] ?? $args['fieldName']
			]);

			if($meta_field_model === null){
				return false;
			}

			// save data
			try {
				$command = new SaveMetaFieldValueCommand($meta_field_model, $args);

				return $command->execute();

			} catch (\Exception $exception){
				return false;
			}

		} catch (\Exception $exception){
			return false;
		}
	}
}