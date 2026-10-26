<?php

namespace ACPT_Lite\Integrations;

use ACPT_Lite\Utils\PHP\Request;

abstract class AbstractIntegration
{
    /**
     * Integration name
     *
     * @return string
     */
    abstract protected function name(): string;

    /**
     * Check if the corresponding plugin/theme is active
     *
     * @param Request|null $request
     *
     * @return bool
     */
    abstract protected function isActive(?Request $request = null): bool;

    /**
     * Run the integration
     *
     * @return mixed
     */
    abstract protected function runIntegration();

    /**
     * Run the code
     *
     * @param Request|null $request
     *
     * @return void
     */
    public function run(?Request $request = null): void
    {
        //
        // External filter to override $this->isActive() check.
        //
        // Example: acpt_is_elementor_pro_active
        //
        $isActiveFromFilter = apply_filters('acpt_is_'.$this->name().'_active', false);

        if ($isActiveFromFilter === true) {
            $isActive = true;
        } else {
            $isActive = $this->isActive($request);
        }

        if ($isActive) {
            $this->runIntegration();
        }
    }

    /**
     * @param \WP_Theme $theme
     *
     * @return false|string
     */
    protected function getThemeVersion(\WP_Theme $theme)
    {
        $parentTheme = $theme->parent();

        return ($parentTheme instanceof \WP_Theme) ? $parentTheme->get('Version') : $theme->get('Version');
    }

    /**
     * @param \WP_Theme $theme
     * @param string $minimumVersion
     *
     * @return bool|int
     */
    protected function checkThemeVersion(\WP_Theme $theme, string $minimumVersion)
    {
        $version = $this->getThemeVersion($theme);

        if (!$version) {
            return false;
        }

        return version_compare($version, $minimumVersion, '>=');
    }
}
