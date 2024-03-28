<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

use ACPT_Lite\Utils\Translator;

class ElementsControl extends \Elementor\Base_Data_Control
{
    /**
     * @inheritDoc
     */
    public function get_type()
    {
        return 'acpt_elements';
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
                    class="elementor-control-tag-area acpt-elements-elementor-control"
                    placeholder="{{ view.getControlPlaceholder() }}"
                    data-setting="{{ data.name }}"
            >
                <option value=""><?php echo Translator::translate("--Select--"); ?></option>
                <option value="1">One element</option>
                <option value="2">Two elements</option>
                <option value="3">Three elements</option>
                <option value="4">Four elements</option>
                <option value="6">Six elements</option>
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