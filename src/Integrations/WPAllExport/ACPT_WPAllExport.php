<?php

namespace ACPT_Lite\Integrations\WPAllExport;

use ACPT_Lite\Integrations\AbstractIntegration;

class ACPT_WPAllExport extends AbstractIntegration
{
	/**
	 * @inheritDoc
	 */
	protected function isActive()
	{
		return (
			is_plugin_active( 'wp-all-export-pro/wp-all-export-pro.php' ) or
			is_plugin_active( 'wp-all-export/wp-all-export.php' )
		);
	}

	/**
	 * @inheritDoc
	 */
	protected function runIntegration()
	{
		require_once __DIR__.'/../../../functions/_inc/wp_all_export/wpae_acpt_export_all_fields.php';
		require_once __DIR__.'/../../../functions/_inc/wp_all_export/wpae_acpt_export_all_tax_fields.php';
		require_once __DIR__.'/../../../functions/_inc/wp_all_export/wpae_acpt_export_all_user_fields.php';
	}
}