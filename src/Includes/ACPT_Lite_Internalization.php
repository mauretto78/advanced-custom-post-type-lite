<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Utils\Settings\Settings;

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://acpt.io
 * @since      1.0.0
 *
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/includes
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ACPT_Lite_Internalization
{
    public const FALLBACK_LANGUAGE = 'en_US';

    /**
     * @return string
     */
    private function getLocale(): string
    {
        try {
            $syncLanguage = Settings::get(SettingsModel::LANGUAGE_SYNC, true);

            if ($syncLanguage) {
                return get_locale();
            }

            return Settings::get(SettingsModel::LANGUAGE, self::FALLBACK_LANGUAGE);
        } catch (\Exception $exception) {
            return self::FALLBACK_LANGUAGE;
        }
    }

    public function run(): void
    {
        $defaultLanguage = self::FALLBACK_LANGUAGE;
        $moFile = file_exists($this->moFilePath($this->getLocale())) ? $this->moFilePath($this->getLocale()) : $this->moFilePath($defaultLanguage);

        // Needed to load menu pages translations. Deferred to plugins_loaded
        // (rather than called synchronously here) so it doesn't force
        // wp_get_current_user()/pluggable.php to resolve ahead of WordPress's
        // own boot sequence: loading pluggable.php early stops later plugins
        // from overriding wp_mail() and friends (#1377).
        add_action('plugins_loaded', function () use ($moFile) {
            load_textdomain(ACPT_LITE_PLUGIN_NAME, $moFile);
        });
    }

    /**
     * Constructs the file path to the .mo file for a given language.
     *
     * @param string $lang The language code used to determine the .mo file path.
     * @return string The full path to the .mo file for the specified language.
     */
    private function moFilePath(string $lang): string
    {
        return ACPT_LITE_PLUGIN_DIR_PATH . '/i18n/languages/'.$lang.'.mo';
    }
}
