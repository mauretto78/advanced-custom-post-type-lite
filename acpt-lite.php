<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              #
 * @since             1.0.0
 * @package           advanced-custom-post-type-lite
 *
 * @wordpress-plugin
 * Plugin Name:       ACPT Lite
 * Plugin URI:        https://wordpress.org/plugins/acpt-lite
 * Description:       Create and manage custom post types, with advanced custom fields and taxonomies management
 * Version:           2.0.7
 * Author:            Mauro Cassani
 * Author URI:        https://github.com/mauretto78
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       custom-post-type
 * Domain Path:       /advanced-custom-post-type-lite
 */

use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Includes\ACPT_Lite_Activator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Deactivator;
use ACPT_Lite\Includes\ACPT_Lite_Loader;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Composer init
 */
require_once(plugin_dir_path(__FILE__) . '/vendor/autoload.php');
require_once(plugin_dir_path(__FILE__) . '/functions/bootstrap.php');
require_once(plugin_dir_path(__FILE__) . '/functions/meta_get.php');
require_once(plugin_dir_path(__FILE__) . '/functions/meta_set.php');

// Fix PHP headers
ob_start();

/**
 * Avoid Call to undefined function is_plugin_active() error
 */
if( !function_exists('is_plugin_active') ) {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
}

/**
 * plugin settings
 */
define( 'ACPT_LITE_PLUGIN_NAME', 'acpt-lite' );
define( 'ACPT_LITE_PLUGIN_VERSION', '2.0.7' );
define( 'ACPT_LITE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'ACPT_LITE_DEV_MODE', devMode() );

/**
 * Inject DB Cache
 */
try {
	$isCacheEnabled = SettingsRepository::getSingle('enable_cache');

	if($isCacheEnabled === null or $isCacheEnabled->getValue() == 1){
		ACPT_Lite_DB::injectCache(cacheInstance());
	}
} catch (\Exception $exception){
	// do nothing
}

class ACPT_Lite
{
    /**
     * The code that runs during plugin activation.
     */
    public function activate()
    {
        ACPT_Lite_Activator::activate();
    }

    /**
     * The code that runs during plugin deactivation.
     */
    public function deactivate()
    {
        ACPT_Lite_Deactivator::deactivate();
    }

    /**
     * Check for plugin upgrades
     */
    public static function checkForPluginUpgrades()
    {
        $old_version = get_option('acpt_lite_version', 0);
        $current_version = filemtime(__FILE__);

        if ($old_version != $current_version) {

	        ACPT_Lite_DB::flushCache();
            ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, oldPluginVersion($old_version));
            ACPT_Lite_DB::sync();

            update_option('acpt_lite_version', $current_version, false);
        }
    }
}

register_activation_hook( __FILE__, [new ACPT_Lite(), 'activate'] );
register_deactivation_hook( __FILE__, [new ACPT_Lite(), 'deactivate'] );

ACPT_Lite::checkForPluginUpgrades();

/**
 * APPSERO
 * Initialize the plugin tracker
 *
 * @return void
 */
function appsero_init_tracker_acpt_lite() {

    if ( ! class_exists( 'Appsero\Client' ) ) {
        require_once __DIR__ . '/vendor/appsero/client/src/Client.php';
    }

    $client = new Appsero\Client( '858a08d4-bccd-4710-a3bc-e768cfe80675', 'Advanced Custom Post Type Lite', __FILE__ );

    // Active insights
    $client->insights()->init();

}

appsero_init_tracker_acpt_lite();

try {
	/**
	 * Begins execution of the plugin.
	 *
	 * Since everything within the plugin is registered via hooks,
	 * then kicking off the plugin from this point in the file does
	 * not affect the page life cycle.
	 *
	 * @since    1.0.0
	 */
	$plugin = new ACPT_Lite_Plugin(new ACPT_Lite_Loader());
    $plugin->run();
} catch (\Exception $exception){

    function wpb_admin_notice_error() {
        echo '<div class="notice notice-error is-dismissible">
            <p>Something went wrong.</p>
      </div>';
    }

    add_action( 'admin_notices', 'wpb_admin_notice_error' );
}