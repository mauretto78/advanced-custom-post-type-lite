<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;

class CountryField extends AbstractField
{
	/**
	 * @inheritDoc
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
				class='acpt-country ".$this->cssClass()."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			/>";

		if($this->fieldModel->getMetaField() !== null){
			return (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $field);
		}

		return $field;
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets()
	{
		wp_enqueue_script( 'countrySelect-js', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/js/countrySelect.min.js'), [], '2.1.1', true);
		wp_enqueue_style( 'countrySelect-css', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/css/countrySelect.min.css'), [], '2.1.1', 'all');
	}
}
