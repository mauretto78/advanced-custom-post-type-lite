<?php

namespace ACPT_Lite\Includes;

use ACPT\Core\Repository\SettingsRepository;

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Deactivator
{
    /**
     * Deactivate
     *
     * @since    1.0.0
     */
    public static function deactivate()
    {
        $deleteTablesSettings = SettingsRepository::get('delete_tables_when_deactivate');
        $destroySchema = (!empty($deleteTablesSettings)) ? $deleteTablesSettings[0]->getValue() : 1;

        if(!class_exists(\ACPT::class) and $destroySchema == 1){
            ACPT_Lite_DB::destroySchema();
        }

        delete_option('acpt_lite_version');
    }
}