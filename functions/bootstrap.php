<?php

use ACPT_Lite\Utils\PHP\Ini;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\ConfigurationOption;
use Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;

// Prevent any error if one of those functions is undefined:

if( !function_exists('get_user_by') ) {
	include_once( ABSPATH . 'wp-includes/pluggable.php' );
}

if( !function_exists('get_term') ) {
	include_once( ABSPATH . 'wp-includes/taxonomy.php' );
}

if( !function_exists('get_post') ) {
	include_once( ABSPATH . 'wp-includes/post.php' );
}

/**
 * Run the application in dev mode
 *
 * @return bool
 */
function devMode()
{
	if(!is_plugin_active( 'query-monitor/query-monitor.php' )){
		return false;
	}

	return site_url() === 'http://localhost:8000';
}

/**
 * @return ExtendedCacheItemPoolInterface
 * @throws \Exception
 */
function cacheInstance()
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
 * This function get the old version from the filemtime value of main plugin file
 *
 * @param int $old_version
 *
 * @return string
 */
function oldPluginVersion($old_version)
{
	if(empty($old_version) or $old_version == 0){
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
