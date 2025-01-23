<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Utils\PHP\Maps;

class AddressField extends AbstractField
{
	/**
	 * @return string
	 * @throws \Exception
	 */
	public function render()
	{
		$field = "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='text'
				class='input-map ".$this->cssClass()."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			/>
		";

		if(Maps::googleMapsKey() !== null){
			$field .= '<input type="hidden" id="'. esc_attr($this->getIdName()).'_lat" name="'. esc_attr($this->getIdName()).'_lat" value="">';
			$field .= '<input type="hidden" id="'. esc_attr($this->getIdName()).'_lng" name="'. esc_attr($this->getIdName()).'_lng" value="">';
			$field .= '<div class="map_preview" id="'. esc_attr($this->getIdName()).'_map"></div>';
		}

		return $field;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function enqueueFieldAssets()
	{
		if(Maps::googleMapsKey() !== null){
			wp_register_script('admin_google_maps_js',  plugins_url( 'advanced-custom-post-type/assets/static/js/google-maps.js'), ['jquery'], ACPT_PLUGIN_VERSION );
			wp_enqueue_script('admin_google_maps_js');

			wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key='.Maps::googleMapsKey().'&libraries=places&callback=initAutocomplete', false, '3', true);
			wp_enqueue_script('google-maps');
		}
	}
}
