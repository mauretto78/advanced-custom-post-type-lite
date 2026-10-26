<?php

/**
 * @link              ####
 * @since             1.0.0
 * @package           acpt-lite
 *
 * @wordpress-plugin
 * Plugin Name:       ACPT Lite
 * Plugin URI:        https://wordpress.org/plugins/acpt-lite
 * Description:       Create and manage custom post types, taxonomies and custom fields from a clean, developer-friendly interface. The free version of ACPT.
 * Version:           2.1.0
 * Author:            Mauro Cassani
 * Author URI:        https://github.com/mauretto78
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       acpt-lite
 * Domain Path:       /acpt-lite
 * Requires PHP:      7.4
 * Requires at least: 6.5
 */

use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\PHP\Request;

/**
 * If this file is called directly, abort.
 */
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * PHP 7.4 polyfills (str_contains, str_starts_with, str_ends_with, array_is_list)
 */
require_once(plugin_dir_path(__FILE__) . '/functions/polyfills.php');

/**
 * Bootstrap the application
 */
// the PHP dependencies, prefixed with ACPT_Lite\Vendor\ (bin/vendor-prefix/prefix.php) so other plugins cannot replace them
require_once(plugin_dir_path(__FILE__) . '/vendor-prefixed/autoload.php');

// the plugin classes (PSR-4): the release zip ships no vendor/ folder
spl_autoload_register(function ($class) {
    $prefix = 'ACPT_Lite\\';

    if (strpos($class, $prefix) === 0) {
        $file = __DIR__ . '/src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';

        if (is_file($file)) {
            require $file;
        }
    }
});

// a development checkout (dev tools); ACPT Lite (the AppSero client)
if (is_file(plugin_dir_path(__FILE__) . '/vendor/autoload.php')) {
    require_once(plugin_dir_path(__FILE__) . '/vendor/autoload.php');
}

require_once(plugin_dir_path(__FILE__) . '/src/Includes/ACPT_Script_Module_Polyfill.php');
require_once(plugin_dir_path(__FILE__) . '/init/bootstrap.php');

/**
 * Fix PHP headers
 */
ob_start();

if( !function_exists('is_plugin_active') ) {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
}

/**
 * General Settings
 */
define('ACPT_LITE_PLUGIN_NAME', 'acpt-lite');
define('ACPT_LITE_PLUGIN_VERSION', '2.1.0');
define('ACPT_LITE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ));
define('ACPT_LITE_DEV_MODE', devACPTLiteMode());

$request = Request::fromGlobals();

/**
 * Activation/deactivation hooks
 */
register_activation_hook( __FILE__, [new ACPT_Lite_Plugin($request), 'activationHook'] );
register_deactivation_hook( __FILE__, [new ACPT_Lite_Plugin($request), 'deactivationHook'] );

checkForACPTLitePluginUpgrades();

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 */
try {
    $plugin = new ACPT_Lite_Plugin($request);
    $plugin->run();

    // Usage insights (AppSero)
    if (class_exists('Appsero\\Client')) {
        $client = new \Appsero\Client('858a08d4-bccd-4710-a3bc-e768cfe80675', 'Advanced Custom Post Type Lite', __FILE__);
        $client->insights()->init();
    }

} catch (\Exception $exception){
    //
    function wpb_admin_notice_error() {
        echo '
			<div class="notice notice-error is-dismissible">
	            <p>Something went wrong.</p>
			</div>
		';
    }

    add_action( 'admin_notices', 'wpb_admin_notice_error' );
}
