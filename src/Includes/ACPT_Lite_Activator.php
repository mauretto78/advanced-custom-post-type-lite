<?php

namespace ACPT_Lite\Includes;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Activator
{
    /**
     * @throws \Exception
     * @since    1.0.0
     */
    public static function activate(): void
    {
        // Flush phpfastcache to prevent stale serialized objects
        // from a previous plugin version causing property errors.
        ACPT_Lite_Plugin::setCache();
        $cache = ACPT_Lite_Plugin::getCache();
        if ($cache !== null) {
            ACPT_Lite_DB::injectCache($cache);
            ACPT_Lite_DB::flushCache();
        }

        $old_version = get_option('acpt_lite_version', 0);
        ACPT_Lite_DB::createSchema(ACPT_LITE_PLUGIN_VERSION, get_option('acpt_lite_current_version') ?? oldACPTLitePluginVersion($old_version));
        ACPT_Lite_DB::sync();

        // fix `The plugin generated unexpected output` error
        if (ob_get_length() > 0) {
            ob_get_clean();
        }
    }
}
