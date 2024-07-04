<?php

namespace ACPT_Lite\Utils\Wordpress;

class Translator
{
	/**
	 * @param $name
	 *
	 * @return string|void
	 */
	public static function translate($name)
	{
		if( $name !== __($name, ACPT_PLUGIN_NAME)){
			return __($name, ACPT_PLUGIN_NAME);
		}

		return __(ucfirst($name), ACPT_PLUGIN_NAME);
	}
}
