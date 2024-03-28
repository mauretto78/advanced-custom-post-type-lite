<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

class HeightControl extends \Elementor\Base_Data_Control
{
    /**
     * @inheritDoc
     */
    public function get_type()
    {
        return 'acpt_height';
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
                    type="text"
                    id="<?php $this->print_control_uid(); ?>"
                    class="elementor-control-tag-area acpt-height-elementor-control"
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