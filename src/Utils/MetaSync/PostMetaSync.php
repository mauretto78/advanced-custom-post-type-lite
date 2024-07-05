<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class PostMetaSync extends AbstractMetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     * @param null $find
     *
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
	 * @param $postType
	 *
	 * @throws \Exception
	 */
    private static function updateBoxPostMeta($newKey, $oldKey, $postType)
    {
	    global $wpdb;

	    if($newKey !== $oldKey){
		    $sql = "UPDATE `{$wpdb->prefix}postmeta` pm 
                    JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                    SET pm.meta_key=REPLACE(pm.meta_key, %s, %s) 
                    WHERE pm.meta_key LIKE %s AND p.post_type=%s";
		    ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey . '%', $postType]);
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
	 * @param $postType
	 *
	 * @throws \Exception
	 */
	private  static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel, $postType)
    {
        if($oldField = self::getMetaFieldData($fieldModel)){

            // old key
            $boxName = $oldField->meta_box_name;
            $fieldName = $oldField->field_name;
            $oldKey = Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

            // new key
            $newKey = $fieldModel->getDbName();

            self::updateFieldPostMeta($newKey, $oldKey, $postType);
        }
    }

    /**
     * @param $newKey
     * @param $oldKey
     * @param $postType
     *
     * @throws \Exception
     */
    private static function updateFieldPostMeta($newKey, $oldKey, $postType)
    {
        global $wpdb;

        if($newKey !== $oldKey){
            $sql = "
                UPDATE `{$wpdb->prefix}postmeta` pm 
                JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                SET pm.meta_key=%s 
                WHERE pm.meta_key=%s AND p.post_type=%s
            ";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$newKey, $oldKey, $postType]);

            $sql = "
                UPDATE `{$wpdb->prefix}postmeta` pm 
                JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                SET meta_key=REPLACE(pm.meta_key, %s, %s) 
                WHERE pm.meta_key LIKE %s AND p.post_type=%s
            ";
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $oldKey . '_', $newKey . '_', $oldKey . '_%', $postType]);
        }
    }
}