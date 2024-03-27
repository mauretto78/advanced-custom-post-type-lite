<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class TaxonomyMetaSync extends AbstractMetaSync
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
			self::updateBoxPostMeta($boxNames['newKey'], $boxNames['oldKey'], $find);
		}
	}

	/**
	 * @param $newKey
	 * @param $oldKey
	 * @param $taxonomy
	 *
	 * @throws \Exception
	 */
	private static function updateBoxPostMeta($newKey, $oldKey, $taxonomy)
	{
		global $wpdb;

		if($newKey !== $oldKey){
			$sql = "UPDATE `{$wpdb->prefix}termmeta` tm 
                    JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                    JOIN `wp_term_taxonomy` tax ON tax.term_id=t.term_id
                    SET tm.meta_key=REPLACE(tm.meta_key, %s, %s) 
                    WHERE tm.meta_key LIKE %s AND tax.taxonomy=%s";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey.'%', $taxonomy]);
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param null $find
	 *
	 * @throws \Exception
	 */
	public static function syncField(MetaFieldModel $fieldModel, $find = null)
	{
		self::updatePostMetaWhenFieldNameChanges($fieldModel, $find);
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $taxonomy
	 *
	 * @throws \Exception
	 */
	private  static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $taxonomy)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){

			// old key
			$boxName = $oldField->meta_box_name;
			$fieldName = $oldField->field_name;
			$oldKey = Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

			// new key
			$newKey = $fieldModel->getDbName();

			self::updateFieldPostMeta($newKey, $oldKey, $taxonomy);
		}
	}

	/**
	 * @param $newKey
	 * @param $oldKey
	 * @param $taxonomy
	 *
	 * @throws \Exception
	 */
	private static function updateFieldPostMeta($newKey, $oldKey, $taxonomy)
	{
		global $wpdb;

		if($newKey !== $oldKey){
			$sql = "
                UPDATE `{$wpdb->prefix}termmeta` tm 
                JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                SET tm.meta_key=%s 
                WHERE tm.meta_key=%s AND t.slug=%s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey, $taxonomy]);

			$sql = "
                UPDATE `{$wpdb->prefix}termmeta` tm 
                JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                SET meta_key=REPLACE(tm.meta_key, %s, %s) 
                WHERE tm.meta_key LIKE %s AND t.slug=%s
            ";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey.'_', $newKey.'_', $oldKey.'_%', $taxonomy]);
		}
	}
}