<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Admin\Admin;
use ACPT_Lite\Admin\Ajax;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Plugin
{
    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      Loader $loader Maintains and registers all hooks for the plugin.
     */
    private $loader;

    /**
     * The unique identifier of this plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string $name The string used to uniquely identify this plugin.
     */
    private $name;

    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    private $version;

    /**
     * Define the core functionality of the plugin.
     *
     * Set the plugin name and the plugin version that can be used throughout the plugin.
     * Load the dependencies, define the locale, and set the hooks for the admin area and
     * the public-facing side of the site.
     *
     * @param Loader $loader
     *
     * @since    1.0.0
     */
    public function __construct(Loader $loader)
    {
        $this->loader = $loader;
        $this->setName();
        $this->setVersion();
        $this->runInternalization();
        $this->runAdmin();
    }

    /**
     * Set plugin name
     */
    private function setName()
    {
        if ( defined( 'PLUGIN_NAME' ) ) {
            $this->name = PLUGIN_NAME;
        } else {
            $this->name = plugin_dir_path( __FILE__ );
        }
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set plugin version
     */
    private function setVersion()
    {
        if ( defined( 'PLUGIN_VERSION' ) ) {
            $this->version = PLUGIN_VERSION;
        } else {
            $this->version = '1.0.0';
        }
    }

    /**
     * @return string
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Define the locale for this plugin for internationalization.
     *
     * Uses the advanced-custom-post-typeInternalization class in order to set the domain and to register the hook
     * with WordPress.
     *
     * @since    1.0.0
     * @access   private
     */
    private function runInternalization()
    {
        $i18n = new Internalization($this->loader);
        $i18n->run();
    }

    /**
     * Run all scripts related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function runAdmin()
    {
        $admin = new Admin($this->loader, new Ajax());
        $admin->run();
    }

    /**
     * Run the loader to execute all of the hooks with WordPress.
     *
     * @since    1.0.0
     */
    public function run()
    {
        $this->loader->run();
    }
}