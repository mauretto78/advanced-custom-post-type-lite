<?php

namespace ACPT_Lite\Integrations\Polylang;

use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Polylang\Helper\PolylangChecker;
use ACPT_Lite\Integrations\WPML\ACPT_WPML;
use ACPT_Lite\Integrations\WPML\Helper\WPMLChecker;
use ACPT_Lite\Integrations\WPML\Helper\WPMLConfig;

class ACPT_Polylang extends AbstractIntegration
{
	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		$isActive = PolylangChecker::isActive();

		if(!$isActive and !WPMLChecker::isActive()){
			WPMLConfig::destroy();
		}

		return $isActive;
	}

	/**
	 * @see https://polylang.pro/doc/filter-reference/
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		add_action( 'plugins_loaded', [new ACPT_WPML(), 'generateConfigFile']);
	}
}
