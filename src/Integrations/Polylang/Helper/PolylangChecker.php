<?php

namespace ACPT_Lite\Integrations\Polylang\Helper;

class PolylangChecker
{
	/**
	 * @return bool
	 */
	public static function isActive()
	{
		return is_plugin_active( 'polylang/polylang.php' );
	}
}