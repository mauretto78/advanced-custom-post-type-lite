<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class SettingsRepository extends AbstractRepository
{
    /**
     * @param string $key
     * @return SettingsModel|null
     * @throws \Exception
     */
    public static function getSingle($key)
    {
        $data = self::get($key);

        if (!empty($data)) {
            return $data[0];
        }

        return null;
    }

    /**
     * @param string|null $key
     *
     * @return SettingsModel[]
     * @throws \Exception
     */
    public static function get($key = null)
    {
        $results = [];
        $args = [];

        // The unfiltered call (no $key) runs from ACPT_Lite_Plugin::setCache(), before
        // the plugin's own file-cache layer exists (that read is what decides the
        // cache driver/config in the first place), so it can never benefit from
        // ACPT_Lite_DB::getResults()'s normal cache. Give it its own autoloaded-option
        // cache instead, invalidated on write in save().
        if($key === null){
            $cached = get_option('acpt_lite_settings_cache', null);

            if($cached !== null){
                foreach ($cached as $row){
                    $results[] = SettingsModel::hydrateFromArray($row);
                }

                return $results;
            }
        }

        $baseQuery = "
            SELECT
                id,
                meta_key,
                meta_value
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)."`
            ";

        if ($key) {
            $baseQuery .= ' WHERE meta_key = %s';
            $args[] = $key;
        }

        $settings = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($settings as $setting) {
            $results[] = SettingsModel::hydrateFromArray([
                    'id' => $setting->id,
                    'key' => $setting->meta_key,
                    'value' => $setting->meta_value,
            ]);
        }

        if($key === null){
            $cacheable = [];

            foreach ($results as $model){
                $cacheable[] = [
                        'id' => $model->getId(),
                        'key' => $model->getKey(),
                        'value' => $model->getValue(),
                ];
            }

            update_option('acpt_lite_settings_cache', $cacheable, true);
        }

        return $results;
    }

    /**
     * @param SettingsModel $settingsModel
     * @return void
     * @throws \Exception
     */
    public static function save(SettingsModel $settingsModel)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)."` 
            (`id`,
            `meta_key`,
            `meta_value`
            ) VALUES (
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `meta_key` = %s,
                `meta_value` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $settingsModel->getId(),
                $settingsModel->getKey(),
                $settingsModel->getValue(),
                $settingsModel->getKey(),
                $settingsModel->getValue(),
        ]);
        self::invalidateCache();
    }

    /**
     * Clears both of this repository's caching layers for the unfiltered
     * get(null) read: ACPT_Lite_DB's own tagged phpfastcache entry, and the
     * acpt_settings_cache option that get(null) checks first (see get()'s
     * docblock for why that second layer exists). ACPT_Lite_DB::flushCache()
     * alone does NOT clear this option -- callers that need a guaranteed-
     * fresh settings read after any out-of-band change must call this too.
     *
     * @return void
     */
    public static function invalidateCache(): void
    {
        ACPT_Lite_DB::invalidateCacheTag(self::class);
        delete_option('acpt_lite_settings_cache');
    }
}
