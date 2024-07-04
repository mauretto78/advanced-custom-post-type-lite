<?php

namespace ACPT_Lite\Includes;

use ACPT_Lite\Core\Repository\SettingsRepository;

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://acpt.io
 * @since      1.0.0
 *
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
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
	 * @return string
	 */
    private function getLocale()
    {
    	try {
		    $language = SettingsRepository::getSingle('language');

		    if($language !== null){
			    return $language->getValue();
		    }

		    return 'en_US';
	    } catch (\Exception $exception){
		    return 'en_US';
	    }
    }

	/**
	 * Run localisation
	 */
    public function run()
    {
	    // Needed to load menu pages translations
	    load_textdomain( ACPT_LITE_PLUGIN_NAME, __DIR__ . '/../../i18n/languages/'.$this->getLocale().'.mo');

	    add_action( 'plugins_loaded', function (){
		    unload_textdomain( ACPT_LITE_PLUGIN_NAME, false);
		    load_textdomain( ACPT_LITE_PLUGIN_NAME, __DIR__ . '/../../i18n/languages/'.$this->getLocale().'.mo');
	    } );
    }
}