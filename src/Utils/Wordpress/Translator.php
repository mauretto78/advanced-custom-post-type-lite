<?php

namespace ACPT_Lite\Utils\Wordpress;

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
		return __($string);
	}
}
