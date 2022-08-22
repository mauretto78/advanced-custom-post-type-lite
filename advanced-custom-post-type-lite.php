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
 * Version:           1.0.12
 * Author:            Mauro Cassani
 * Author URI:        https://github.com/mauretto78
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       custom-post-type
 * Domain Path:       /advanced-custom-post-type-lite
 */

use ACPT_Lite\Includes\ACPT_Lite_Activator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Deactivator;
use ACPT_Lite\Includes\ACPT_Lite_Loader;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// Fix PHP headers
ob_start();

/**
 * plugin settings
 */
define( 'ACPT_LITE_PLUGIN_NAME', 'advanced-custom-post-type-lite' );
define( 'ACPT_LITE_PLUGIN_VERSION', '1.0.12' );

/**
 * Composer init
 */
require_once(plugin_dir_path(__FILE__) . '/vendor/autoload.php');

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

            ACPT_Lite_DB::createSchema();
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

try {
    $plugin->run();
} catch (\Exception $exception){

    function wpb_admin_notice_error() {
        echo '<div class="notice notice-error is-dismissible">
            <p>Something went wrong.</p>
      </div>';
    }

    add_action( 'admin_notices', 'wpb_admin_notice_error' );
}