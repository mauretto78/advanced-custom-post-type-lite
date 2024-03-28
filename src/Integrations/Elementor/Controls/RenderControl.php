<?php

namespace ACPT_Lite\Integrations\Elementor\Controls;

use ACPT_Lite\Utils\Translator;

class RenderControl extends \Elementor\Base_Data_Control
{
	/**
	 * @inheritDoc
	 */
	public function get_type()
	{
		return 'acpt_render';
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
				class="elementor-control-tag-area acpt-render-elementor-control"
				placeholder="{{ view.getControlPlaceholder() }}"
				data-setting="{{ data.name }}"
			>
				<option value=""><?php echo Translator::translate("--Select--"); ?></option>
				<option value="text">Plain text</option>
				<option value="link">Link</option>
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
