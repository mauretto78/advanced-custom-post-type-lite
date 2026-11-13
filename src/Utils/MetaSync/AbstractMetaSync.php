<?php

namespace ACPT_Lite\Utils\MetaSync;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Arrays;

/**
 * Every read in the syncers skips ACPT's cache: the stored (pre-save) name and the values a
 * rename rewrites must come from the database. A cache flush that fails part-way (phpfastcache
 * can't empty a directory another request is writing to) left a stale name here, so the rename
 * computed the wrong old key and moved nothing.
 */
abstract class AbstractMetaSync
{
    /**
     * @param MetaBoxModel $metaBoxModel
     * @param string|null $find
     *
     * @return mixed
     */
    abstract public static function syncBox(MetaBoxModel $metaBoxModel, ?string $find = null);

    /**
     * @param MetaFieldModel $fieldModel
     * @param string|null $find
     *
     * @return mixed
     */
    abstract public static function syncField(MetaFieldModel $fieldModel, ?string $find = null);

    /**
     * @param MetaBoxModel $metaBoxModel
     *
     * @return mixed
     */
    protected static function getMetaBoxData(MetaBoxModel $metaBoxModel)
    {
        // check if box already exists
        $query = "SELECT * FROM 
            `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` 
            WHERE id = %s 
        ";
        $results = ACPT_Lite_DB::getResults($query, [$metaBoxModel->getId()], 7200, null, true);

        if (isset($results[0]) && Arrays::count($results) === 1) {
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
            `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id = %s 
            GROUP BY f.id
        ";
        $results = ACPT_Lite_DB::getResults($query, [$fieldModel->getId()], 7200, null, true);

        if (isset($results[0]) && Arrays::count($results) === 1) {
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
            `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id = %s 
            GROUP BY f.id
        ";
        $results = ACPT_Lite_DB::getResults($query, [$fieldModel->getParentId()], 7200, null, true);

        if (isset($results[0]) && Arrays::count($results) === 1) {
            return $results[0];
        }

        return false;
    }

    /**
     * @param string $oldBoxName
     * @param string $newBoxName
     *
     * @return array<string>
     */
    protected static function changedBoxNames($oldBoxName, $newBoxName)
    {
        return [
            'newKey' => Strings::toDBFormat($newBoxName).'_',
            'oldKey' => Strings::toDBFormat($oldBoxName).'_',
        ];
    }

    /**
     * The SET and WHERE of the query that moves a renamed field's value and its extra keys
     * (`<key>_id`, `<key>_type`, `<key>_attachment_id`...) to the new key, in one statement.
     *
     * One CASE renames each row once. The old two-step rename (exact key, then
     * REPLACE over `LIKE '<key>_%'`) matched the key it had just renamed when the new name
     * starts with `<old name>_` (zz_field -> zz_field_renamed stored the value under
     * zz_field_renamed_renamed), and also moved a sibling field named `<old name>_<anything>`.
     * Only the exact key and the ExtraFields suffixes are touched.
     *
     * @param string $column  the key column, e.g. `pm.meta_key`
     * @param string $oldKey
     * @param string $newKey
     *
     * @return array{set: string, where: string, args: array<int, string>} args: SET's, then WHERE's
     */
    protected static function renameFieldKeys(string $column, string $oldKey, string $newKey): array
    {
        $pairs = [$oldKey => $newKey];

        foreach (ExtraFields::ALLOWED_VALUES as $suffix) {
            $pairs[$oldKey.'_'.$suffix] = $newKey.'_'.$suffix;
        }

        $set = "{$column} = CASE {$column}";
        $setArgs = [];

        foreach ($pairs as $old => $new) {
            $set .= " WHEN %s THEN %s";
            $setArgs[] = (string)$old;
            $setArgs[] = $new;
        }

        $set .= " ELSE {$column} END";
        $where = "{$column} IN (".implode(', ', array_fill(0, count($pairs), '%s')).")";

        return [
            'set' => $set,
            'where' => $where,
            'args' => array_merge($setArgs, array_map('strval', array_keys($pairs))),
        ];
    }
}
