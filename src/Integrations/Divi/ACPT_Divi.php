<?php

namespace ACPT_Lite\Integrations\Divi;

use ACPT_Lite\Integrations\AbstractIntegration;

class ACPT_Divi extends AbstractIntegration
{
	const MINIMUM_DIVI_VERSION = '4.19.3';

	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		$theme = wp_get_theme();

		if(( 'Divi' == $theme->name or 'Divi' == $theme->parent_theme )){
			return $this->checkThemeVersion($theme, self::MINIMUM_DIVI_VERSION);
		}

		return false;
	}

	/**
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		define('ACPT_EXT_NAME', 'acpt-divi-extension');
		define('ACPT_EXT_TEXT_DOMAIN', 'acpt-divi-extension');

		add_action( 'divi_extensions_init', function() {
			require_once plugin_dir_path( __FILE__ ) . 'includes/ACPT_Divi_Extension.php';
		});

		// Enqueue the assets
		require_once plugin_dir_path( __FILE__ ) . 'includes/ACPT_Divi_Assets.php';
		add_filter( 'et_required_module_assets', ['ACPT_Divi_Assets', 'enqueue_assets'], 10, 1 );

		// Run the dynamic content handler
		require_once plugin_dir_path( __FILE__ ) . 'includes/ACPT_Divi_Dynamic_Content.php';

		add_filter( 'et_builder_custom_dynamic_content_fields', ['ACPT_Divi_Dynamic_Content','get_fields'], 10, 3 );
		add_filter( 'et_builder_dynamic_content_meta_value', ['ACPT_Divi_Dynamic_Content','get_value'], 10, 3 );
		add_filter( 'et_builder_get_parent_modules', ['ACPT_Divi_Dynamic_Content','add_dynamic_support_for_gallery_field'], 10, 3 );
		add_filter( 'et_required_module_assets', ['ACPT_Divi_Assets', 'add_required_slugs'], 10, 2 );
	}
}