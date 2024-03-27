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
                <input
                    style="background: #e6e9ec;"
                    type="text"
                    readonly
                    id="<?php $this->print_control_uid(); ?>"
                    class="elementor-control-tag-area acpt-shortcode-elementor-control"
                    placeholder="{{ view.getControlPlaceholder() }}"
                    data-setting="{{ data.name }}"
                    value="{{ data.default }}"
                />
            </div>
            <# if ( data.description ) { #>
                <div class="elementor-control-field-description">
                    {{{ data.description }}}
                </div>
            <# } #>
        <?php
    }
}