<?php

namespace ACPT_Lite\Core\API\AJAX\Controllers;

use ACPT_Lite\Core\CQRS\Query\FetchAllFindBelongsQuery;
use ACPT_Lite\Core\CQRS\Query\FetchLanguagesQuery;
use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Helper\Lengths;
use ACPT_Lite\Core\Helper\Weights;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_DB_Tools;
use ACPT_Lite\Utils\PHP\Browser;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Wordpress\Roles;

class GlobalsController extends AbstractController
{
    /**
     * @throws \Exception
     */
    public function globalSettingsAction(): void
    {
        try {
            $locale = get_locale();
            $syncLanguage = Settings::get('sync_language', true);

            if ($syncLanguage) {
                $language = $locale;
            } else {
                $language = Settings::get('language', 'en_US');
            }

            $font = Settings::get('font', 'Inter');
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            $syncLanguage = true;
            $locale = 'en_US';
            $language = 'en_US';
            $font = 'Inter';
        }

        $languageQuery = new FetchLanguagesQuery();
        $languageEntries = $languageQuery->execute();

        $findQuery = new FetchAllFindBelongsQuery();
        $findEntries = $findQuery->execute();

        global $wpdb;

        $globals = [
            "plugin_version" => ACPT_LITE_PLUGIN_VERSION,
            "site_url" =>  site_url(),
            "site_name" => get_bloginfo('name'),
            "admin_email" => get_option('admin_email'),
            "admin_url" => admin_url(),
            "ajax_url" => admin_url('admin-ajax.php'),
            "rest_route_url" => "/?rest_route=/acpt/v1",
            "http_referer" => $this->request->httpReferer(),
            "language" => $language,
            "locale" => $locale,
            "sync_language" => $syncLanguage,
            "font" => $font,
            "is_rtl" => is_rtl(),
            "is_maria_db" => ACPT_Lite_DB::isMariaDB(),
            "mysql_version" => $wpdb->db_version(),
            "supports_invisible_columns" => ACPT_Lite_DB::supportsInvisibleColumns(),
            "charset_collate" => ACPT_Lite_DB::getCharsetCollationArray(),
            "mysql_engines" => ACPT_Lite_DB::getEngineList(),
            'find' => $findEntries,
            'roles' => Roles::get(),
            "browser" => Browser::getBrowser(),
            "available_languages" => $languageEntries['languages'],
            "translations" =>  $languageEntries['translations'],
            "uom" => [
                "currency" => Currencies::getSymbolList(),
                "length" => Lengths::getSymbolList(),
                "weight" => Weights::getSymbolList(),
            ],
        ];

        $settings = SettingsRepository::get();

        wp_send_json([
            'globals' => $globals,
            'settings' => $settings,
        ]);
    }

    /**
     * Performs a health check for the plugin by verifying the version, cache status, database health, and connectivity.
     *
     * @return void Returns a JSON response containing the health status of database, cache, cURL connectivity, and version alignment.
     *              The response includes the following keys:
     *              - 'db': The database check status.
     *              - 'db_health_check': Detailed database health check results or error messages.
     *              - 'curl': The cURL connectivity status.
     *              - 'version': The plugin version alignment status.
     *              - 'cache': The cache directory status.
     *
     *              Example statuses:
     *              - 'ok': Indicates the check passed successfully.
     *              - Error message: A descriptive message if an issue was detected.
     */
    public function healthCheckAction()
    {
        // version

        // | =====================================================|
        // | LEGACY FORMAT | get_option('acpt_lite_version')           |
        // | =====================================================|
        // | NEW FORMAT    | get_option('acpt_lite_current_version')   |
        // | =====================================================|

        $savedVersion = get_option('acpt_lite_current_version') ?? oldACPTLitePluginVersion(get_option('acpt_lite_version', 0));
        $versionCheck = ($savedVersion === ACPT_LITE_PLUGIN_VERSION) ? 'ok' : 'Saved version is not aligned';

        // cache
        $cacheCheck = 'ok';
        try {
            $isCacheEnabled = Settings::get('enable_cache', 1);

            if ($isCacheEnabled == 1) {
                $cacheDir = ACPT_LITE_PLUGIN_DIR_PATH . "cache";

                if (!is_dir($cacheDir)) {
                    $cacheCheck = 'The cache directory does not exists';
                } elseif (!is_writable($cacheDir)) {
                    $cacheCheck = 'The cache directory is not writable';
                }
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            $cacheCheck = $exception->getMessage();
        }

        // db
        try {
            $dbHealthCheck = ACPT_Lite_DB_Tools::healthCheck();
            $dbCheck = (empty($dbHealthCheck)) ? 'ok' : 'Missing tables or columns';
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            $dbHealthCheck = $exception->getMessage();
            $dbCheck = $exception->getMessage();
        }

        wp_send_json([
            'db' => $dbCheck,
            'db_health_check' => $dbHealthCheck,
            'version' => $versionCheck,
            'cache' => $cacheCheck,
        ]);
    }

    public function runRepairAction(): void
    {
        try {
            // version
            $current_version = filemtime(ACPT_LITE_PLUGIN_DIR_PATH . "acpt-lite.php");
            update_option('acpt_lite_version', $current_version, true);

            // cache
            $cacheDir = ACPT_LITE_PLUGIN_DIR_PATH . "cache";

            if (!is_dir($cacheDir)) {
                mkdir($cacheDir, 0777, true);
            }

            if (!is_writable($cacheDir)) {
                chmod($cacheDir, 0777);
            }

            // db
            if (ACPT_Lite_DB_Tools::repair(ACPT_Lite_DB_Tools::healthCheck()) === false) {
                throw new \Exception("DB repair failed");
            }

            wp_send_json([
                'success' => 'ok',
            ]);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            wp_send_json([
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
