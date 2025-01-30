<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PHP\Ini;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\ConfigurationOption;
use Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;

/**
 * Run the application in dev mode
 *
 * @return bool
 */
function devACPTLiteMode()
{
    if(!is_plugin_active( 'query-monitor/query-monitor.php' )){
        return false;
    }

    $devSites = [
        'http://localhost:8000',
        'http://localhost:10003',
    ];

    return in_array(site_url(), $devSites);
}

/**
 * @return ExtendedCacheItemPoolInterface
 * @throws \Exception
 */
function cacheACPTLiteInstance()
{
    $cacheDir = plugin_dir_path( __FILE__ ) . "/../cache";

    if(!is_dir($cacheDir)){
        mkdir($cacheDir, 0777, true);
    }

    $config = new ConfigurationOption();
    $config->setPath($cacheDir);

    CacheManager::setDefaultConfig($config);

    return CacheManager::getInstance('files');
}

/**
 * @return bool
 */
function isACPTLiteCacheEnabled()
{
    $query = "
            SELECT 
                id, 
                meta_key,
                meta_value
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_SETTINGS)."` WHERE meta_key = %s
            ";

    $res = ACPT_Lite_DB::getResults($query, ['enable_cache']);

    if(empty($res) or $res[0]->meta_value == 1){
        return true;
    }

    return false;
}

/**
 * Init the DB
 */
function initACPTLiteDB()
{
    /**
     * Inject DB Cache
     */
    try {
        if(isACPTLiteCacheEnabled()){
            ACPT_Lite_DB::injectCache(cacheACPTLiteInstance());
        }
    } catch (\Exception $exception){
        // do nothing
    }
}

/**
 * This function get the old version from the filemtime value of main plugin file
 *
 * @param int $old_version
 *
 * @return string
 */
function oldACPTLitePluginVersion($old_version)
{
    if(empty($old_version) or $old_version == 0){
        return null;
    }

    if(!is_numeric($old_version)){
        return null;
    }

    $date = date("Y-m-d", $old_version);

    if($date == "1970-01-01"){
        return null;
    }

    $config = Ini::read(__DIR__.'/../config.ini');
    $pluginVersions = $config['versions'];

    return (isset(array_flip($pluginVersions)[$date])) ? array_flip($pluginVersions)[$date] : null;
}

/**
 * Check for plugin upgrades
 */
function checkForACPTLitePluginUpgrades()
{
    try {
        $old_version = (!empty(get_option('acpt_lite_current_version'))) ? get_option('acpt_lite_current_version') : get_option('acpt_lite_version', 0);
        $current_version = (!empty(get_option('acpt_lite_current_version'))) ? ACPT_LITE_PLUGIN_VERSION : filemtime(__FILE__);

        if ($old_version != $current_version) {

            ACPT_Lite_DB::flushCache();
            ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, get_option('acpt_lite_current_version') ?? oldACPTLitePluginVersion($old_version));
            ACPT_Lite_DB::sync();

            update_option('acpt_lite_version', $current_version, false);
            update_option('acpt_lite_current_version', ACPT_LITE_PLUGIN_VERSION, false);
        }
    } catch (\Exception $exception){
        // do nothing
    }
}
