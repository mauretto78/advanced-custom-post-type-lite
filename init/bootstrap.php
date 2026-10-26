<?php

use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\PHP\Ini;

/**
 * Run the application in dev mode
 *
 * @return bool
 */
function devACPTLiteMode(): bool
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
 * This function get the old version from the filemtime value of main plugin file
 *
 * @param int|string|null $old_version
 *
 * @return string|null
 */
function oldACPTLitePluginVersion($old_version): ?string
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
function checkForACPTLitePluginUpgrades(): void
{
	try {
		// | =====================================================|
		// | LEGACY FORMAT | get_option('acpt_lite_version')           |
		// | =====================================================|
		// | NEW FORMAT    | get_option('acpt_lite_current_version')   |
		// | =====================================================|

		$old_version = get_option('acpt_lite_current_version') ?? get_option('acpt_lite_version', 0);
		$current_version = get_option('acpt_lite_current_version') ? ACPT_LITE_PLUGIN_VERSION : filemtime(__FILE__);

		if ($old_version != $current_version) {
			// Initialize cache before flushing, since ACPT_Lite_DB::$cache
			// has not been injected yet at this point in the boot sequence.
			// Without this, flushCache() silently does nothing because
			// self::$cache is still null, leaving stale serialized objects
			// from the previous plugin version in phpfastcache.
			ACPT_Lite_Plugin::setCache();
			$cache = ACPT_Lite_Plugin::getCache();
			if($cache !== null){
				ACPT_Lite_DB::injectCache($cache);
			}

			ACPT_Lite_DB::flushCache();
			delete_option('acpt_lite_settings_cache');
			ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, get_option('acpt_lite_current_version') ?? oldACPTLitePluginVersion($old_version));
			ACPT_Lite_DB::sync();
			
			// Lite ships no versioned migrations: the schema converges through the health check
			$schemaIssues = \ACPT_Lite\Includes\ACPT_Lite_DB_Tools::healthCheck();
			if (!empty($schemaIssues)) {
			    \ACPT_Lite\Includes\ACPT_Lite_DB_Tools::repair($schemaIssues);
			}

			update_option('acpt_lite_version', $current_version, true);
			update_option('acpt_lite_current_version', ACPT_LITE_PLUGIN_VERSION, true);
		}

		// One-time migration: these 3 options used to be written with autoload='no',
		// forcing a dedicated SELECT per option on every request instead of folding
		// into WP's single bulk alloptions query. New writes now use autoload='yes';
		// this backfills existing rows, since update_option()'s autoload param is
		// ignored for pre-existing rows on WP < 6.6 (only add_option() reliably sets
		// autoload, hence delete+re-add rather than a raw autoload UPDATE).
		if (!get_option('acpt_lite_autoload_migration_done', false)) {
			$autoloadMigrationKeys = [
				'acpt_lite_current_version',
			];

			foreach ($autoloadMigrationKeys as $autoloadMigrationKey) {
				$autoloadMigrationValue = get_option($autoloadMigrationKey, false);

				if ($autoloadMigrationValue === false) {
					continue;
				}

				delete_option($autoloadMigrationKey);
				add_option($autoloadMigrationKey, $autoloadMigrationValue, '', 'yes');
			}

			add_option('acpt_lite_autoload_migration_done', true, '', 'yes');
		}
	} catch (\Exception $exception){
		// do nothing
	}
}

/**
 * Checks whether tests are currently being executed in the environment.
 *
 * Not spoofable from a production HTTP request: PHPUNIT_ACPT_TEST_SUITE is only
 * ever defined by tests/_inc/bootstrap.php (loaded solely by the WP PHPUnit test
 * scaffold), and php_sapi_name() can't be influenced by request data — a normal
 * web request never satisfies both conditions.
 *
 * @return bool Returns true if tests are running, false otherwise.
 */
function testsAreRunning(): bool
{
    return (
        defined('PHPUNIT_ACPT_TEST_SUITE') &&
        PHPUNIT_ACPT_TEST_SUITE &&
        php_sapi_name() === 'cli'
    );
}
