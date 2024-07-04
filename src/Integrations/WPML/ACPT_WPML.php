<?php

namespace ACPT_Lite\Integrations\WPML;

use ACPT_Lite\Integrations\AbstractIntegration;
use ACPT_Lite\Integrations\Polylang\Helper\PolylangChecker;
use ACPT_Lite\Integrations\WPML\Helper\WPMLChecker;
use ACPT_Lite\Integrations\WPML\Helper\WPMLConfig;
use ACPT_Lite\Integrations\WPML\Provider\MetaFieldsProvider;

class ACPT_WPML extends AbstractIntegration
{
	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		$isActive = WPMLChecker::isActive();

		if(!$isActive and !PolylangChecker::isActive()){
			WPMLConfig::destroy();
		}

		return $isActive;
	}

	/**
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		add_action( 'plugins_loaded', [new ACPT_WPML(), 'generateConfigFile']);
	}

	/**
	 * Genereate WPML settings
	 */
	public function generateConfigFile()
	{
		$fields = MetaFieldsProvider::getInstance()->getFields();
		WPMLConfig::generate($fields);
	}
}
