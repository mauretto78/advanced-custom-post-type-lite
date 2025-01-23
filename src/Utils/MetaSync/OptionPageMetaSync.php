<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class OptionPageMetaSync extends AbstractMetaSync
{
	/**
	 * @TODO no more in use?!?
	 *
	 * @param OptionPageModel $optionPage
	 *
	 * @throws \Exception
	 */
	public static function syncAllMeta(OptionPageModel $optionPage)
	{
		$savedPage = OptionPageRepository::getById($optionPage->getId(), true);

		if($savedPage !== null){
			$sql = "
                UPDATE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` 
                SET page=%s 
                WHERE page=%s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$optionPage->getMenuSlug(), $savedPage->getMenuSlug()]);
		}
	}

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
			self::updateBoxPostMeta( $find.'_'.$boxNames['newKey'], $find.'_'.$boxNames['oldKey'] );
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
			$sql = "UPDATE `{$wpdb->prefix}options` o 
                    SET o.option_name=REPLACE(o.option_name, %s, %s) 
                    WHERE o.option_name LIKE %s";
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
		if($fieldModel->getParentId() !== null){
			self::updateNestedPostMetaWhenFieldNameChanges($fieldModel, $find);
		} elseif($fieldModel->getBlockId() !== null){
			self::updateNestedPostMetaInABlockWhenFieldNameChanges($fieldModel, $find);
		}  else {
			self::updatePostMetaWhenFieldNameChanges($fieldModel, $find);
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $optionPageSlug
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaInABlockWhenFieldNameChanges(MetaFieldModel $fieldModel, $optionPageSlug)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){
			$parentBlockModel = MetaRepository::getMetaBlockById( $fieldModel->getBlockId());

			if($parentBlockModel !== null){
				$parentField = $parentBlockModel->getMetaField();

				// old parent key
				$parentBoxName = $parentField->getBox()->getName();
				$parentFieldName = $parentField->getName();
				$parentKey = Strings::toDBFormat($optionPageSlug).'_'.Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

				// old key
				$fieldName = $oldField->field_name;
				$oldKey = Strings::toDBFormat($optionPageSlug).'_'. Strings::toDBFormat($fieldName);

				// new key
				$newKey = Strings::toDBFormat($optionPageSlug).'_'. Strings::toDBFormat($fieldModel->getName());

				self::updateNestedPostMetaData($parentKey, $oldKey, $newKey);
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $optionPageSlug)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){

			if($parentField = self::getParentMetaFieldData($fieldModel)){

				// old parent key
				$parentBoxName = $parentField->meta_box_name;
				$parentFieldName = $parentField->field_name;
				$parentKey = Strings::toDBFormat($optionPageSlug).'_'. Strings::toDBFormat($parentBoxName).'_'.Strings::toDBFormat($parentFieldName);

				// old key
				$fieldName = $oldField->field_name;
				$oldKey = Strings::toDBFormat($optionPageSlug).'_'. Strings::toDBFormat($fieldName);

				// new key
				$newKey = Strings::toDBFormat($optionPageSlug).'_'. Strings::toDBFormat($fieldModel->getName());

				self::updateNestedPostMetaData($parentKey, $oldKey, $newKey);
			}
		}
	}

	/**
	 * @param $parentKey
	 * @param $oldKey
	 * @param $newKey
	 *
	 * @throws \Exception
	 */
	private static function updateNestedPostMetaData($parentKey, $oldKey, $newKey)
	{
		global $wpdb;

		$query = "
                    SELECT * FROM `{$wpdb->prefix}options` o 
                    WHERE o.option_name=%s
                ";
		$results = ACPT_Lite_DB::getResults($query, [$parentKey]);

		foreach ($results as $result) {

			$oldMetaValue = unserialize( $result->option_value );

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
                            UPDATE `{$wpdb->prefix}options` o 
                            SET o.option_value=%s 
                            WHERE o.option_name=%s 
                        ";
				ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey]);
			}
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $optionPageSlug
	 *
	 * @throws \Exception
	 */
	private static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $optionPageSlug)
	{
		if($oldField = self::getMetaFieldData($fieldModel)){

			// old key
			$boxName = $oldField->meta_box_name;
			$fieldName = $oldField->field_name;
			$oldKey = Strings::toDBFormat($optionPageSlug).'_'.Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

			// new key
			$newKey = Strings::toDBFormat($optionPageSlug).'_'.$fieldModel->getDbName();

			self::updateFieldPostMeta($newKey, $oldKey);
		}
	}

	/**
	 * @param $newKey
	 * @param $oldKey
	 *
	 * @throws \Exception
	 */
	private static function updateFieldPostMeta($newKey, $oldKey)
	{
		global $wpdb;

		if($newKey !== $oldKey){
			$sql = "
                UPDATE `{$wpdb->prefix}options` o 
                SET o.option_name=%s 
                WHERE o.option_name=%s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey]);

			$sql = "
                UPDATE `{$wpdb->prefix}options` o 
                SET o.option_name=REPLACE(o.option_name, %s, %s) 
                WHERE o.option_name LIKE %s 
            ";
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey.'_', $newKey.'_', $oldKey.'_%']);
		}
	}
}