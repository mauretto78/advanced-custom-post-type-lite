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
                    JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                    SET tm.meta_key=REPLACE(tm.meta_key, %s, %s) 
                    WHERE tm.meta_key LIKE %s AND tax.taxonomy=%s";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey . '%', $taxonomy]);
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
		if($fieldModel->getParentId() !== null){
			self::updateNestedPostMetaWhenFieldNameChanges($fieldModel, $find);
		} elseif($fieldModel->getBlockId() !== null){
			self::updateNestedPostMetaInABlockWhenFieldNameChanges($fieldModel, $find);
		} else {
			self::updatePostMetaWhenFieldNameChanges($fieldModel, $find);
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $taxonomy)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){

			if($parentField = self::getParentMetaFieldData($fieldModel)){

				global $wpdb;

				// old parent key
				$parentBoxName = $parentField->meta_box_name;
				$parentFieldName = $parentField->field_name;
				$parentKey = Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

				// old key
				$fieldName = $oldField->field_name;
				$oldKey = Strings::toDBFormat($fieldName);

				// new key
				$newKey = Strings::toDBFormat($fieldModel->getName());

				$query = "
                    SELECT * FROM `{$wpdb->prefix}termmeta` tm 
                    JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                    JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                    WHERE tm.meta_key=%s AND tax.taxonomy=%s
                ";
				$results = ACPT_Lite_DB::getResults($query, [$parentKey, $taxonomy]);

				foreach ($results as $result) {

					$oldMetaValue = unserialize( $result->meta_value );

					// key update
					if($newKey !== $oldKey){
						$oldMetaValue[$newKey] = $oldMetaValue[$oldKey];
						unset($oldMetaValue[$oldKey]);

						$metaValue = serialize($oldMetaValue);

						$sql = "
                            UPDATE `{$wpdb->prefix}termmeta` tm 
                            JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                    		JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                            SET tm.meta_value=%s 
                            WHERE tm.meta_key=%s AND tax.taxonomy=%s
                        ";
						ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey, $taxonomy]);
					}
				}
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $taxonomy
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaInABlockWhenFieldNameChanges(MetaFieldModel $fieldModel, $taxonomy)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){
			$parentBlockModel = MetaRepository::getMetaBlockById($fieldModel->getBlockId());

			if($parentBlockModel !== null){
				$parentField = $parentBlockModel->getMetaField();

				// old parent key
				$parentBoxName = $parentField->getBox()->getName();
				$parentFieldName = $parentField->getName();
				$parentKey = Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

				// old key
				$fieldName = $oldField->field_name;
				$oldKey = Strings::toDBFormat($fieldName);

				// new key
				$newKey = Strings::toDBFormat($fieldModel->getName());

				self::updateNestedPostMetaData($parentKey, $oldKey, $newKey, $taxonomy);
			}
		}
	}

	/**
	 * @param $parentKey
	 * @param $oldKey
	 * @param $newKey
	 * @param $taxonomy
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaData($parentKey, $oldKey, $newKey, $taxonomy)
	{
		global $wpdb;

		$query = "
                    SELECT * FROM `{$wpdb->prefix}termmeta` tm 
                    JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                    JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                    WHERE tm.meta_key=%s AND tax.taxonomy=%s
                ";
		$results = ACPT_Lite_DB::getResults($query, [$parentKey, $taxonomy]);

		foreach ($results as $result) {

			$oldMetaValue = unserialize( $result->meta_value );

			// key update
			if($newKey !== $oldKey){

				// blocks
				if(isset($oldMetaValue['blocks']) and is_array($oldMetaValue['blocks'])){
					foreach ($oldMetaValue['blocks'] as $blockIndex => $block){
						foreach ($block as $blockName => $blockValues){
							foreach ($blockValues as $fieldName => $fieldValues){
								if($fieldName === $oldKey){
									$oldMetaValue['blocks'][$blockIndex][$blockName][$newKey] = $oldMetaValue['blocks'][$blockIndex][$blockName][$oldKey];
									unset($oldMetaValue['blocks'][$blockIndex][$blockName][$oldKey]);
								}
							}
						}
					}
				} else {
					$oldMetaValue[$newKey] = $oldMetaValue[$oldKey];
					unset($oldMetaValue[$oldKey]);
				}

				$metaValue = serialize($oldMetaValue);

				$sql = "
                            UPDATE `{$wpdb->prefix}termmeta` tm 
                            JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                            JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                            SET tm.meta_value=%s 
                            WHERE tm.meta_key=%s AND tax.taxonomy=%s
                        ";
				ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey, $taxonomy]);
			}
		}
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
                JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                SET tm.meta_key=%s 
                WHERE tm.meta_key=%s AND tax.taxonomy=%s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey, $taxonomy]);

			$sql = "
                UPDATE `{$wpdb->prefix}termmeta` tm 
                JOIN `{$wpdb->prefix}terms` t ON t.term_id=tm.term_id
                JOIN `{$wpdb->prefix}term_taxonomy` tax ON tax.term_id=t.term_id
                SET meta_key=REPLACE(tm.meta_key, %s, %s) 
                WHERE tm.meta_key LIKE %s AND tax.taxonomy=%s
            ";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $oldKey . '_', $newKey . '_', $oldKey . '_%', $taxonomy]);
		}
	}
}