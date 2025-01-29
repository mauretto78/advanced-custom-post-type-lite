<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class UserMetaSync extends AbstractMetaSync
{
	/**
	 * @param MetaBoxModel $metaBoxModel
	 * @param null $find
	 *
	 * @return mixed|void
	 * @throws \Exception
	 */
	public static function syncBox(MetaBoxModel $metaBoxModel, $find = null)
	{
		if($oldBox = self::getMetaBoxData($metaBoxModel)){
			$boxNames = self::changedBoxNames($oldBox->meta_box_name, $metaBoxModel->getName());
			self::updateBoxPostMeta($boxNames['newKey'], $boxNames['oldKey']);
		}
	}

	/**
	 * @param $newKey
	 * @param $oldKey
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	private static function updateBoxPostMeta($newKey, $oldKey)
	{
		global $wpdb;

		if($newKey !== $oldKey){
			$sql = "UPDATE `{$wpdb->prefix}usermeta` um 
                    SET um.meta_key=REPLACE(um.meta_key, %s, %s) 
                    WHERE um.meta_key LIKE %s";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey.'%']);
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param null $find
	 *
	 * @return mixed|void
	 * @throws \Exception
	 */
	public static function syncField(MetaFieldModel $fieldModel, $find = null)
	{
	    self::updatePostMetaWhenFieldNameChanges($fieldModel);
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){

			// old key
			$boxName = $oldField->meta_box_name;
			$fieldName = $oldField->field_name;
			$oldKey = Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

			// new key
			$newKey = $fieldModel->getDbName();

			self::updateFieldPostMeta($newKey, $oldKey);
		}
	}

	/**
	 * @param $newKey
	 * @param $oldKey
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	private static function updateFieldPostMeta($newKey, $oldKey)
	{
		global $wpdb;

		if($newKey !== $oldKey){
			$sql = "
                UPDATE `{$wpdb->prefix}usermeta` um 
                SET um.meta_key=%s 
                WHERE um.meta_key=%s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey]);

			$sql = "
                UPDATE `{$wpdb->prefix}usermeta` um 
                SET meta_key=REPLACE(um.meta_key, %s, %s) 
                WHERE um.meta_key LIKE %s
            ";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey.'_', $newKey.'_', $oldKey.'_%']);
		}
	}
}