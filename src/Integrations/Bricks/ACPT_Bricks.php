<?php

namespace ACPT_Lite\Integrations\Bricks;

use ACPT_Lite\Integrations\AbstractIntegration;

class ACPT_Bricks extends AbstractIntegration
{
	const MINIMUM_BRICKS_VERSION = '1.6.2';

    /**
     * @inheritDoc
     */
    protected function isActive()
    {
        $theme = wp_get_theme();

		if(( 'Bricks' == $theme->name or 'Bricks' == $theme->parent_theme )){
			return $this->checkThemeVersion($theme, self::MINIMUM_BRICKS_VERSION);
		}

        return false;
    }

    /**
     * @inheritDoc
     */
    protected function runIntegration()
    {
	    add_filter( 'bricks/dynamic_data/register_providers', function( $providers ) {

		    require_once __DIR__ . '/providers/provider-acpt.php';

		    if ( class_exists( 'ACPT' ) ) {
			    $providers[] = 'acpt';
		    }

		    return $providers;
	    } );
    }
}
