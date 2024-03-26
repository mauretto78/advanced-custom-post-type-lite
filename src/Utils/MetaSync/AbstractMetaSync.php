<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Includes\ACPT_DB;

abstract class AbstractMetaSync
{
	/**
	 * @param MetaBoxModel $metaBoxModel
	 * @param null $find
	 *
	 * @return mixed
	 */
	public abstract static function syncBox(MetaBoxModel $metaBoxModel, $find = null);

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param null $find
	 *
	 * @return mixed
	 */
	public abstract static function syncField(MetaFieldModel $fieldModel, $find = null);

	/**
	 * @param MetaBoxModel $metaBoxModel
	 *
	 * @return mixed
	 */
	protected static function getMetaBoxData(MetaBoxModel $metaBoxModel)
	{
		// check if box already exists
		$query = "SELECT * FROM 
            `".ACPT_DB::prefixedTableName(ACPT_DB::TABLE_META_BOX)."` 
            WHERE id = %s 
        ";
		$results = ACPT_DB::getResults($query, [$metaBoxModel->getId()]);

		if(isset($results[0]) and count($results) === 1){
			return $results[0];
		}

		return false;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return mixed|bool
	 */
	protected static function getMetaFieldData(MetaFieldModel $fieldModel)
	{
		$query = "SELECT * FROM 
            `".ACPT_DB::prefixedTableName(ACPT_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_DB::prefixedTableName(ACPT_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id = %s 
            GROUP BY f.id
        ";
		$results = ACPT_DB::getResults($query, [$fieldModel->getId()]);

		if(isset($results[0]) and count($results) === 1){
			return $results[0];
		}

		return false;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return mixed|bool
	 */
	protected static function getParentMetaFieldData(MetaFieldModel $fieldModel)
	{
		$query = "SELECT * FROM 
            `".ACPT_DB::prefixedTableName(ACPT_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_DB::prefixedTableName(ACPT_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id = %s 
            GROUP BY f.id
        ";
		$results = ACPT_DB::getResults($query, [$fieldModel->getParentId()]);

		if(isset($results[0]) and count($results) === 1){
			return $results[0];
		}

		return false;
	}

	/**
	 * @param $oldBoxName
	 * @param $newBoxName
	 *
	 * @return array
	 */
	protected static function changedBoxNames($oldBoxName, $newBoxName)
	{
		return [
			'newKey' => Strings::toDBFormat($newBoxName).'_',
			'oldKey' => Strings::toDBFormat($oldBoxName).'_',
		];
	}
}