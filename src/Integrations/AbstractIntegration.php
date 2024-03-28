<?php

namespace ACPT_Lite\Integrations;

abstract class AbstractIntegration
{
    /**
     * Check if the corresponding plugin/theme is active
     *
     * @return bool
     */
    protected abstract function isActive();

    /**
     * Run the integration
     *
     * @return mixed
     */
    protected abstract function runIntegration();

    /**
     *
     */
    public function run()
    {
        if($this->isActive()){
            $this->runIntegration();
        }
    }

	/**
	 * @param \WP_Theme $theme
	 * @param $minimumVersion
	 *
	 * @return bool|int
	 */
    protected function checkThemeVersion(\WP_Theme $theme, $minimumVersion)
    {
	    $version = $theme->parent_theme ? $theme->parent()->get('Version') : $theme->get('Version');

	    if(!$version){
		    return false;
	    }

	    return version_compare( $version, $minimumVersion, '>=' );
    }
}