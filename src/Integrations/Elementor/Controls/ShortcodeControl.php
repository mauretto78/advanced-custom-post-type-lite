<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

class ShortcodeControl extends \Elementor\Base_Data_Control
{
    /**
     * @inheritDoc
     */
    public function get_type()
    {
        return 'acpt_shortcode';
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
                <div
                    style="background: #e6e9ec; padding: 5px; border-radius: 3px; border: 1px solid #d5d8dc;"
                >
                    {{{ data.default }}}
                </div>
            </div>
            <# if ( data.description ) { #>
                <div class="elementor-control-field-description">
                    {{{ data.description }}}
                </div>
            <# } #>
        <?php
    }
}