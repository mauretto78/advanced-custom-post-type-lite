<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Admin\ACPT_Lite_Admin;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Utils\PHP\Request;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Vendor\Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;

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
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Plugin
{
    private static Request $request;

    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      ACPT_Lite_Loader $loader Maintains and registers all hooks for the plugin.
     */
    private ACPT_Lite_Loader $loader;

    /**
     * The unique identifier of this plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string $name The string used to uniquely identify this plugin.
     */
    private string $name;

    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    private string $version;

    /**
     * Static cache instance.
     *
     * @var ExtendedCacheItemPoolInterface|null
     */
    private static $cache;

    /**
     * @throws \Exception
     */
    public function activationHook(): void
    {
        ACPT_Lite_Activator::activate();
    }

    /**
     * @throws \Exception
     */
    public function deactivationHook(): void
    {
        ACPT_Lite_Deactivator::deactivate();
    }

    /**
     * ACPT_Lite_Plugin constructor.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        self::$request = $request;
        $this->loader = new ACPT_Lite_Loader();
    }

    /**
     * @throws \Exception
     * @since    1.0.0
     */
    public function run(): void
    {
        if ($this->isMediaModalRequest()) {
            return;
        }

        $this->setCache();
        $this->initACPTDB();
        $this->initSettingsConstants();
        $this->syncDBAndRunHealthCheck();
        $this->setName();
        $this->setVersion();
        $this->runInternalization();
        $this->runAdmin();
        $this->loader->run();

        do_action("acpt/init", $this);
    }

    /**
     * @return Request
     */
    public static function getRequest(): Request
    {
        return self::$request ?? Request::fromGlobals();
    }

    /**
     * Determines whether the current request is a WordPress media modal query.
     * ACPT does not need to be initialized for these requests, and doing so
     * would trigger a massive number of unnecessary DB queries.
     *
     * @return bool
     */
    private function isMediaModalRequest(): bool
    {
        return self::$request->isAjax() && self::$request->request('action') === 'query-attachments';
    }

    /**
     * Configures and initializes the caching mechanism based on the application's settings.
     * Retrieves cache settings from the configuration repository, sets up the cache driver
     * and configuration, and stores the cache instance for further use. A shutdown handler
     * is registered to ensure corrupted cache entries are cleared upon encountering errors.
     *
     * @return void
     * @throws \Exception If an unexpected error occurs during cache setup.
     */
    public static function setCache(): void
    {
        try {
            $settings = SettingsRepository::get();
            $cacheEnabled = Settings::fromSettings(SettingsModel::ENABLE_CACHE, $settings) ?? true;

            if ($cacheEnabled) {
                $cacheDriver = Settings::fromSettings(SettingsModel::CACHE_DRIVER, $settings) ?? "files";
                $cacheConfig = Settings::fromSettings(SettingsModel::CACHE_CONFIG, $settings) ?? ["folder" => "cache"];

                $cacheConfigArray = is_array($cacheConfig) ? $cacheConfig : ["folder" => "cache"];

                // The "Cache folder (absolute path)" setting overrides the folder
                // the pool is actually built with -- it must be applied to
                // $cacheConfigArray (the value passed to ACPT_Lite_Cache below), not to
                // the unused $cacheConfig copy.
                $cacheFolder = Settings::fromSettings(SettingsModel::CACHE_FOLDER, $settings);
                if ($cacheFolder) {
                    $cacheConfigArray['folder'] = $cacheFolder;
                }
                $cache = new ACPT_Lite_Cache((string)$cacheDriver, $cacheConfigArray);

                $instance = $cache->getInstance();

                if ($instance instanceof ExtendedCacheItemPoolInterface) {
                    self::$cache = $instance;
                }

                // Register a shutdown handler to clear corrupted cache
                register_shutdown_function(function () {
                    $error = error_get_last();
                    if ($error && self::$cache instanceof ExtendedCacheItemPoolInterface && str_contains($error['message'], 'phpfastcache')) {
                        self::$cache->clear();
                    }
                });
            }
        } catch (\Throwable $exception) {
            // Cache setup must never be fatal, but a silently-disabled cache is
            // exactly what makes "edits don't persist / Flush cache does nothing"
            // impossible to diagnose -- surface it through the error channel.
            do_action("acpt/error", $exception);
        }
    }

    /**
     * Get plugin cache instance
     *
     * @return ExtendedCacheItemPoolInterface|null
     */
    public static function getCache()
    {
        return self::$cache;
    }

    /**
     * @return bool
     */
    public static function isCacheEnabled()
    {
        return self::$cache instanceof ExtendedCacheItemPoolInterface;
    }

    private function initACPTDB(): void
    {
        try {
            $cache = self::getCache();

            if ($cache !== null) {
                ACPT_Lite_DB::injectCache($cache);
            }
        } catch (\Exception $exception) {
            // do nothing
        }
    }

    /**
     * Initializes global settings constants with values retrieved from the settings repository.
     * If an exception occurs during retrieval, default values are used as fallbacks.
     *
     * @return void
     * @throws \Exception If an unexpected error occurs during constant definition.
     */
    private function initSettingsConstants(): void
    {
        try {
            $settings = SettingsRepository::get();
        } catch (\Exception $exception) {
            $settings = [];
        }

        define('ACPT_LITE_SKIN', Settings::fromSettings(SettingsModel::SKIN, $settings) ?? 'light');
        define('ACPT_LITE_ENABLE_ADMIN_MENU', Settings::fromSettings(SettingsModel::ENABLE_ADMIN_MENU, $settings) ?? true);
        define('ACPT_LITE_ENABLE_META_CACHE', Settings::fromSettings(SettingsModel::ENABLE_META_CACHE, $settings) ?? false);
        define('ACPT_LITE_ENABLE_META', Settings::fromSettings(SettingsModel::ENABLE_META, $settings) ?? true);
        define('ACPT_LITE_ENABLE_CPT', Settings::fromSettings(SettingsModel::ENABLE_CPT, $settings) ?? true);
        define('ACPT_LITE_ENABLE_TAX', Settings::fromSettings(SettingsModel::ENABLE_TAX, $settings) ?? true);
        define('ACPT_LITE_DELETE_TABLES_WHEN_DEACTIVATE_KEY', Settings::fromSettings(SettingsModel::DELETE_TABLES_WHEN_DEACTIVATE_KEY, $settings) ?? false);
        define('ACPT_LITE_DELETE_POSTS_KEY', Settings::fromSettings(SettingsModel::DELETE_POSTS_KEY, $settings) ?? false);
        define('ACPT_LITE_DELETE_POSTMETA_KEY', Settings::fromSettings(SettingsModel::DELETE_POSTMETA_KEY, $settings) ?? false);
        define('ACPT_LITE_DELETE_UNUSED_TABLES', Settings::fromSettings(SettingsModel::DELETE_UNUSED_TABLES, $settings) ?? false);
        define('ACPT_LITE_HTTP_TIMEOUT', 15); // 15 seconds by default
    }

    /**
     * Synchronizes the database schema and performs a health check to ensure the system is up-to-date and operating correctly.
     *
     * The method verifies the schema health version against the plugin version. If the versions do not match, it proceeds to:
     * - Check if the schema exists and creates it if necessary.
     * - Synchronize the database schema.
     * - Check if native posts exist, and if not, re-synchronize the database and run a health check.
     *
     * Once completed, the schema health version is updated in the database.
     *
     * @throws \Exception If there is an error during the schema creation, synchronization, or health check processes.
     */
    private function syncDBAndRunHealthCheck(): void
    {
        $healthOptionKey = 'acpt_lite_schema_health_version';

        if (get_option($healthOptionKey) === ACPT_LITE_PLUGIN_VERSION) {
            return;
        }

        if (false === ACPT_Lite_DB::checkIfSchemaExists()) {
            $old_version = get_option('acpt_lite_version', 0);
            ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, get_option('acpt_lite_current_version') ?? oldACPTLitePluginVersion($old_version));
            ACPT_Lite_DB::sync();
        }

        if (false === ACPT_Lite_DB::checkIfNativePostsExists()) {
            ACPT_Lite_DB::sync();
            ACPT_Lite_DB_Tools::runHealthCheck();
        }

        update_option($healthOptionKey, ACPT_LITE_PLUGIN_VERSION, true);
    }

    /**
     * Sets the name property based on the ACPT_LITE_PLUGIN_NAME constant if it is defined.
     * If the constant is not defined, it sets the name property to the plugin's directory path.
     *
     * @return void
     */
    private function setName(): void
    {
        if (defined('ACPT_LITE_PLUGIN_NAME')) {
            $this->name = ACPT_LITE_PLUGIN_NAME;
        } else {
            $this->name = plugin_dir_path(__FILE__);
        }
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return void
     */
    private function setVersion(): void
    {
        if (defined('ACPT_LITE_PLUGIN_VERSION')) {
            $this->version = ACPT_LITE_PLUGIN_VERSION;
        } else {
            $this->version = '1.0.0';
        }
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @return void
     */
    private function runInternalization(): void
    {
        $i18n = new ACPT_Lite_Internalization();
        $i18n->run();
    }

    /**
     * @throws \Exception
     */
    private function runAdmin(): void
    {
        $admin = new ACPT_Lite_Admin($this->loader, self::$request);
        $admin->run();
    }

}
