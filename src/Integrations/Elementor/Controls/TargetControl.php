<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

use ACPT_Lite\Utils\Wordpress\Translator;

class TargetControl extends \Elementor\Base_Data_Control
{
    /**
     * @inheritDoc
     */
    public function get_type()
    {
        return 'acpt_target';
    }

    /**
     * @inheritDoc
     */
    public function content_template()
    {
        ?>
        <# if ( data.label ) {#>
        <label for="<?php $this->print_control_uid(); ?>" class="elementor-control-title">
            {{{ data.label }}}
        </label>
        <# } #>
        <div class="elementor-control-input-wrapper">
            <select
                id="<?php $this->print_control_uid(); ?>"
                class="elementor-control-tag-area acpt-target-elementor-control"
                placeholder="{{ view.getControlPlaceholder() }}"
                data-setting="{{ data.name }}"
            >
                <option value=""><?php echo Translator::translate("--Select--"); ?></option>
                <option value="_blank">Opens in a new window or tab</option>
                <option value="_self">Opens in the same frame as it was clicked</option>
                <option value="_parent">Opens in the parent frame</option>
                <option value="_top">Opens in the full body of the window</option>
            </select>
        </div>
        <# if ( data.description ) { #>
            <div class="elementor-control-field-description">
                {{{ data.description }}}
            </div>
        <# } #>
        <?php
    }
}