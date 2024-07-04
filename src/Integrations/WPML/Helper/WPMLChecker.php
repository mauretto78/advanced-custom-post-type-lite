<?php

namespace ACPT_Lite\Integrations\WPML\Helper;

class WPMLChecker
{
	/**
	 * @return bool
	 */
	public static function isActive()
	{
		if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
			return true;
		}

		return false;
	}
}