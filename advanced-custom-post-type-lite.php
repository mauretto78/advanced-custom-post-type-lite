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
 * Plugin URI:        https://acpt.io
 * Description:       Create and manage custom post types, with advanced custom fields and taxonomies management
 * Version:           1.0.0
 * Author:            Mauro Cassani
 * Author URI:        https://github.com/mauretto78
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       custom-post-type
 * Domain Path:       /advanced-custom-post-type
 */

use ACPT_Lite\Includes\Activator;
use ACPT_Lite\Includes\Deactivator;
use ACPT_Lite\Includes\Plugin;
use ACPT_Lite\Includes\Loader;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// Fix PHP headers
ob_start();

/**
 * plugin settings
 */
define( 'PLUGIN_NAME', 'advanced-custom-post-type-lite' );
define( 'PLUGIN_VERSION', '1.0.0' );

/**
 * Composer init
 */
require_once(plugin_dir_path(__FILE__) . '/vendor/autoload.php');

/**
 * The code that runs during plugin activation.
 */
function activate()
{
    Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate()
{
    Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate' );
register_deactivation_hook( __FILE__, 'deactivate' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
$plugin = new Plugin(new Loader());
$plugin->run();