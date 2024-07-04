<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Deactivator
{
    /**
     * Deactivate plugin
     *
     * destroy schema only if `delete_tables_when_deactivate` settings is set to 1 (default value)
     *
     * @throws \Exception
     * @since    1.0.0
     */
    public static function deactivate()
    {
	    // Delete all saved ACPT definitions when you deactivate the plug-in
	    $deleteTablesSettings = SettingsRepository::getSingle(SettingsModel::DELETE_TABLES_WHEN_DEACTIVATE_KEY);
	    $destroySchema = ($deleteTablesSettings !== null) ? $deleteTablesSettings->getValue() : 0;

	    if($destroySchema == 1){
		    ACPT_Lite_DB::destroySchema();
	    }
    }
}