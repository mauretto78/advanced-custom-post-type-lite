<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

use ACPT_Lite\Utils\Wordpress\Translator;

class DateFormatControl extends \Elementor\Base_Data_Control
{
    /**
     * @inheritDoc
     */
    public function get_type()
    {
        return 'acpt_dateformat';
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
                        class="elementor-control-tag-area acpt-dateformat-elementor-control"
                        placeholder="{{ view.getControlPlaceholder() }}"
                        data-setting="{{ data.name }}"
                >
                    <option value=""><?php echo Translator::translate("--Select--"); ?></option>
                    <option value="d-M-y">dd-mmm-yy (ex. 28-OCT-90)</option>
                    <option value="d-M-Y">dd-mmm-yyyy (ex. 28-OCT-1990)</option>
                    <option value="d M y">mmm yy (ex. 28 OCT 90)</option>
                    <option value="d M Y">mmm yyyy (ex. 28 OCT 1990)</option>
                    <option value="d/m/Y">dd/mm/yy (ex. 28/10/90)</option>
                    <option value="m/d/y">mm/dd/yy (ex. 10/28/90)</option>
                    <option value="m/d/Y">mm/dd/yyyy (ex. 10/28/1990)</option>
                    <option value="d.m.Y">dd.mm.yy (ex. 28.10.90)</option>
                    <option value="d.m.Y">dd.mm.yyyy (ex. 28.10.1990)</option>
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