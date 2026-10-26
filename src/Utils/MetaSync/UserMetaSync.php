<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Serializer;

class UserMetaSync extends AbstractMetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     * @param string|null $find
     *
     * @return void
     * @throws \Exception
     */
    public static function syncBox(MetaBoxModel $metaBoxModel, ?string $find = null): void
    {
        if ($oldBox = self::getMetaBoxData($metaBoxModel)) {
            $boxNames = self::changedBoxNames($oldBox->meta_box_name, $metaBoxModel->getName());
            self::updateBoxPostMeta($boxNames['newKey'], $boxNames['oldKey']);
        }
    }

    /**
     * @param string $newKey
     * @param string $oldKey
     *
     * @return void
     * @throws \Exception
     */
    private static function updateBoxPostMeta(string $newKey, string $oldKey): void
    {
        global $wpdb;

        if ($newKey !== $oldKey) {
            $sql = "UPDATE `{$wpdb->prefix}usermeta` um 
                    SET um.meta_key=REPLACE(um.meta_key, %s, %s) 
                    WHERE um.meta_key LIKE %s";
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$oldKey, $newKey, $oldKey.'%']);
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     * @param string|null $find
     *
     * @return void
     * @throws \Exception
     */
    public static function syncField(MetaFieldModel $fieldModel, ?string $find = null): void
    {
        if ($fieldModel->getParentId() !== null) {
            self::updateNestedPostMetaWhenFieldNameChanges($fieldModel);
        } elseif ($fieldModel->getBlockId() !== null) {
        } else {
            self::updatePostMetaWhenFieldNameChanges($fieldModel);
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return void
     * @throws \Exception
     */
    private static function updateNestedPostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel): void
    {
        if ($oldField = self::getMetaFieldData($fieldModel)) {
            if ($parentField = self::getParentMetaFieldData($fieldModel)) {
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
                    SELECT * FROM `{$wpdb->prefix}usermeta` um 
                    WHERE um.meta_key=%s 
                ";
                $results = ACPT_Lite_DB::getResults($query, [$parentKey]);

                foreach ($results as $result) {
                    $oldMetaValue = Serializer::unserialize($result->meta_value);

                    // key update
                    if ($newKey !== $oldKey) {
                        $oldMetaValue[$newKey] = $oldMetaValue[$oldKey];
                        unset($oldMetaValue[$oldKey]);

                        $metaValue = serialize($oldMetaValue);

                        $sql = "
                            UPDATE `{$wpdb->prefix}usermeta` um 
			                SET um.meta_key=%s 
			                WHERE um.meta_key=%s
                        ";
                        ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey]);
                    }
                }
            }
        }
    }

    /**
     * @param string $parentKey
     * @param string $oldKey
     * @param string $newKey
     *
     * @return void
     * @throws \Exception
     */
    private static function updateNestedPostMetaData(string $parentKey, string $oldKey, string $newKey): void
    {
        global $wpdb;

        $query = "
                    SELECT * FROM `{$wpdb->prefix}usermeta` um 
                    WHERE um.meta_key=%s 
                ";
        $results = ACPT_Lite_DB::getResults($query, [$parentKey]);

        foreach ($results as $result) {
            $oldMetaValue = Serializer::unserialize($result->meta_value);

            // key update
            if ($newKey !== $oldKey) {

                // blocks
                if (isset($oldMetaValue['blocks']) && is_array($oldMetaValue['blocks'])) {
                    foreach ($oldMetaValue['blocks'] as $blockIndex => $block) {
                        foreach ($block as $blockName => $blockValues) {
                            foreach ($blockValues as $fieldName => $fieldValues) {
                                if ($fieldName === $oldKey) {
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
					UPDATE `{$wpdb->prefix}usermeta` um 
	                SET um.meta_key=%s 
	                WHERE um.meta_key=%s
                ";
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaValue, $parentKey]);
            }
        }
    }

    /**
     * @param MetaFieldModel $fieldModel
     *
     * @return void
     * @throws \Exception
     */
    private static function updatePostMetaWhenFieldNameChanges(MetaFieldModel $fieldModel): void
    {
        if ($oldField = self::getMetaFieldData($fieldModel)) {

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
     * @param string $newKey
     * @param string $oldKey
     *
     * @return void
     * @throws \Exception
     */
    private static function updateFieldPostMeta(string $newKey, string $oldKey): void
    {
        global $wpdb;

        if ($newKey !== $oldKey) {
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
