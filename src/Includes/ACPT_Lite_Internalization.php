<?php

namespace ACPT_Lite\Includes;

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://acpt.io
 * @since      1.0.0
 *
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Internalization
{
    /**
     * @var ACPT_Lite_Loader
     */
    private $loader;

    public function __construct( ACPT_Lite_Loader $loader)
    {
        $this->loader = $loader;
    }

    /**
     * Load the plugin text domain for translation.
     *
     * @since    1.0.0
     */
    public function loadPluginTextDomain()
    {
        load_plugin_textdomain( ACPT_LITE_PLUGIN_NAME, false, dirname( plugin_basename( __FILE__ ) ) . "/i18n/languages" );
    }

    public function run()
    {
        $this->loader->addAction( 'plugins_loaded', $this, 'loadPluginTextDomain' );
    }
}