<?php

namespace ACPT_Lite\Includes;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Activator
{
    /**
     * Activate plugin
     *
     * @since    1.0.0
     */
    public static function activate()
    {
        if ( version_compare( PHP_VERSION, '5.6', '<=' ) ) {
            deactivate_plugins( plugin_basename( __FILE__ ) );
            wp_die( __( 'This plugin requires PHP Version 5.6 or greater.  Sorry about that.', 'acpt' ) );
        }

        $pluginPremium = 'advanced-custom-post-type/advanced-custom-post-type.php';

        if (is_plugin_active($pluginPremium) ) {
            deactivate_plugins( __FILE__ );
            die( __( 'ACPT Lite cannot be activated because ACPT Premium version it\'s already active.', 'acpt' ) );
        } else {
            ACPT_Lite_DB::createSchema();
            ACPT_Lite_DB::sync();
        }
    }
}