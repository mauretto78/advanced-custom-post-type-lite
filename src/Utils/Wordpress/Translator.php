<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Integrations\Polylang\Helper\PolylangChecker;

class Translator
{
	/**
	 * Translate a name from the main ACPT .pot file
	 *
	 * @param $name
	 * @param $args
	 *
	 * @return string|void
	 */
	public static function translate($name, $args = [])
	{
		if( $name !== __($name, ACPT_LITE_PLUGIN_NAME)){
			$translation = __($name, ACPT_LITE_PLUGIN_NAME);
		} else {
		    $translation = __(ucfirst($name), ACPT_LITE_PLUGIN_NAME);
        }

        if(!empty($args)) {
            foreach ($args as $key => $arg) {
                $translation = str_replace("{{".$key."}}", $arg, $translation);
            }
        }

        return $translation;
	}

	/**
	 * Translate a string from an external plugin
	 *
	 * @param $string
	 *
	 * @return string
	 */
	public static function translateString($string)
	{
		// Polylang
		if(PolylangChecker::isActive() and function_exists('pll__')){
			return pll__($string);
		}

		return $string;
	}
}
