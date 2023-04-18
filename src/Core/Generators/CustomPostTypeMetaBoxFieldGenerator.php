<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Generators\Contracts\MetaFieldInterface;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;

class CustomPostTypeMetaBoxFieldGenerator
{
	/**
	 * @param int    $postId
	 * @param AbstractMetaBoxModel $metaBoxModel
	 * @param array  $input
	 *
	 * @return MetaFieldInterface
	 * @throws \Exception
	 */
	public static function generate($postId, AbstractMetaBoxModel $metaBoxModel, array $input)
	{
		if(!isset($input['type'])){
			throw new \Exception('Type is not defined');
		}

		$field = self::getCustomPostTypeField($postId, $metaBoxModel, $input);

		if($field){
			return $field->render();
		}

		return null;
	}

	/**
	 * @param int    $postId
	 * @param AbstractMetaBoxModel $metaBoxModel
	 * @param array  $input
	 *
	 * @return MetaFieldInterface
	 */
	private static function getCustomPostTypeField( $postId, AbstractMetaBoxModel $metaBoxModel, array $input)
	{
		$className = 'ACPT_Lite\\Core\\Generators\\CustomPostTypeFields\\'.$input['type'].'Field';

		if(class_exists($className)){
			return new $className(
				$postId,
				$metaBoxModel,
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
