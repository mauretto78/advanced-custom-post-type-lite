<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Generators\Contracts\MetaFieldInterface;

class CustomPostTypeMetaBoxFieldGenerator
{
	/**
	 * @param int    $postId
	 * @param string $metaboxId
	 * @param array  $input
	 *
	 * @return MetaFieldInterface
	 * @throws \Exception
	 */
	public static function generate($postId, $metaboxId, array $input)
	{
		if(!isset($input['type'])){
			throw new \Exception('Type is not defined');
		}

		$field = self::getCustomPostTypeField($postId, $metaboxId, $input);

		if($field){
			return $field->render();
		}

		return null;
	}

	/**
	 * @param int    $postId
	 * @param string $metaboxId
	 * @param array  $input
	 *
	 * @return MetaFieldInterface
	 */
	private static function getCustomPostTypeField( $postId, $metaboxId, array $input)
	{
		$className = 'ACPT_Lite\\Core\\Generators\\CustomPostTypeFields\\'.$input['type'].'Field';

		if(class_exists($className)){
			return new $className(
				$postId,
				$metaboxId,
				$input['name'],
				$input['sort'],
				$input['isRequired'],
				$input['defaultValue'],
				$input['description'],
				$input['options']
			);
		}

		return null;
	}
}
