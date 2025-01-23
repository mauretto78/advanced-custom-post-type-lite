<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class IconField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return "
			 <div class='acpt-iconpicker-wrapper'>
		        <span id='".esc_attr($this->getIdName())."_target' class='acpt-selected-icon hidden'></span>
		        <input
					id='".esc_attr($this->getIdName())."_svg'
					name='".esc_attr($this->getIdName())."_svg'
					value=''
					type='hidden'
				/>
				<input
					id='".esc_attr($this->getIdName())."'
					name='".esc_attr($this->getIdName())."'
					placeholder='".$this->placeholder()."'
					value='".$this->defaultValue()."'
					type='text'
					class='acpt-iconpicker ".$this->cssClass()."'
					data-target='".esc_attr($this->getIdName())."'
				/>
			 </div>   
		";
	}

	public function enqueueFieldAssets()
	{
		wp_register_style('iconpicker-css',  plugins_url( 'advanced-custom-post-type/assets/vendor/iconpicker/iconpicker.theme.min.css') );
		wp_enqueue_style('iconpicker-css');

		wp_register_script('iconpicker-js',  plugins_url( 'advanced-custom-post-type/assets/vendor/iconpicker/iconpicker.min.js') );
		wp_enqueue_script('iconpicker-js');
	}
}
