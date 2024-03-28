<?php

namespace ACPT_Lite\Utils;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class PostMetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     *
     * @throws \Exception
     */
    public static function updatePostMetaWhenBoxNameChanges( MetaBoxModel $metaBoxModel)
    {
        // check if box already exists
        $query = "SELECT * FROM 
            `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` 
            WHERE id = %s 
        ";
        $results = ACPT_Lite_DB::getResults($query, [$metaBoxModel->getId()]);

        if(isset($results[0]) and count($results) === 1){

            global $wpdb;

            $oldBox = $results[0];

            // old key
            $boxName = $oldBox->meta_box_name;
            $postType = $oldBox->post_type;
            $oldKey = Strings::toDBFormat($boxName).'_';

            // new key
            $newKey = Strings::toDBFormat($metaBoxModel->getName()).'_';

            if($newKey !== $oldKey){
                $sql = "UPDATE `{$wpdb->prefix}postmeta` pm 
                    JOIN `{$wpdb->prefix}posts` p ON p.ID=pm.post_id
                    SET pm.meta_key=REPLACE(pm.meta_key, %s, %s) 
                    WHERE pm.meta_key LIKE %s AND p.post_type=%s";
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey.'%', $postType]);
            }
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @throws \Exception
     */
    public static function updatePostMetaWhenFieldNameChanges( MetaFieldModel $fieldModel)
    {
        // check if field already exists
        $query = "SELECT * FROM 
            `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id = %s 
            GROUP BY f.id
        ";
        $results = ACPT_Lite_DB::getResults($query, [$fieldModel->getId()]);

        if(isset($results[0]) and count($results) === 1){

            $oldField = $results[0];

            // old key
            $boxName = $oldField->meta_box_name;
            $postType = $oldField->post_type;
            $fieldName = $oldField->field_name;
            $oldKey = Strings::toDBFormat($boxName).'_'.Strings::toDBFormat($fieldName);

            // new key
            $newKey = $fieldModel->getDbName();

            self::updatePostMeta($newKey, $oldKey, $postType);
        }
    }

    /**
     * @param $newKey
     * @param $oldKey
     * @param $postType
     *
     * @throws \Exception
     */
    private static function updatePostMeta($newKey, $oldKey, $postType)
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
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey.'_', $newKey.'_', $oldKey.'_%', $postType]);
        }
    }
}