<?php

namespace ACPT_Lite\Includes;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Activator
{
	/**
	 * Activate plugin
	 *
	 * @throws \Exception
	 * @since    1.0.0
	 */
    public static function activate()
    {
        if ( version_compare( PHP_VERSION, '7.3', '<=' ) ) {
            deactivate_plugins( plugin_basename( __FILE__ ) );
            wp_die( __( 'This plugin requires PHP Version 7.3 or greater.  Sorry about that.', 'acpt' ) );
        }

        // check for version lite
        // and deactivate lite version if enabled
        $pluginLite = 'advanced-custom-post-type-lite/advanced-custom-post-type-lite.php';

	    // plugin root file was changed in ACPT Lite v2.0.6
	    $pluginLiteAfter206 = 'acpt-lite/acpt-lite.php';

        if (is_plugin_active($pluginLite) ) {
            deactivate_plugins($pluginLite);
        } elseif(is_plugin_active($pluginLiteAfter206)){
	        deactivate_plugins($pluginLiteAfter206);
        } else {
	        $old_version = get_option('acpt_version', 0);
	        ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, get_option('acpt_current_version') ?? oldPluginVersion($old_version));
            ACPT_Lite_DB::sync();
        }

        // fix `The plugin generated unexpected output` error
	    if ( ob_get_length() > 0 ) {
		    ob_get_clean();
	    }
    }
}