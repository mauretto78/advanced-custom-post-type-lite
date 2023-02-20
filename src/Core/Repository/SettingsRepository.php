<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class SettingsRepository
{
    /**
     * @param $key
     * @return SettingsModel|null
     * @throws \Exception
     */
    public static function getSingle($key)
    {
        $data = self::get($key);

        if(!empty($data) ){
            return $data[0];
        }

        return null;
    }

    /**
     * @param null $key
     *
     * @return SettingsModel[]
     * @throws \Exception
     */
    public static function get($key = null)
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                id, 
                meta_key,
                meta_value
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)."`
            ";

        if($key){
            $baseQuery .= ' WHERE meta_key = %s';
            $args[] = $key;
        }

        $settings = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($settings as $setting){
            $results[] = SettingsModel::hydrateFromArray([
                    'id' => $setting->id,
                    'key' => $setting->meta_key,
                    'value' => $setting->meta_value,
            ]);
        }

        return $results;
    }

    /**
     * @param SettingsModel $settingsModel
     *
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
    }
}