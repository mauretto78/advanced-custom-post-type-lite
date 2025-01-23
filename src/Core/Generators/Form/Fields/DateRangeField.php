<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;

class DateRangeField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$min = (!empty($this->fieldModel->getExtra()['minDate'])) ? esc_attr($this->fieldModel->getExtra()['minDate']) : null;
		$max = (!empty($this->fieldModel->getExtra()['maxDate'])) ? esc_attr($this->fieldModel->getExtra()['maxDate']) : null;

		$field = "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='text'
				class='acpt-daterangepicker ".$this->cssClass()."'
		";

		if($min){
			$field .= ' data-min-date="'.$min.'"';
		}

		if($max){
			$field .= ' data-max-date="'.$max.'"';
		}

		$field .= '>';

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
		wp_enqueue_script( 'momentjs', plugins_url( 'advanced-custom-post-type/assets/vendor/moment/moment.min.js'), [], '2.18.1', true);
		wp_enqueue_script( 'daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/js/daterangepicker.min.js'), [], '3.1.0', true);
		wp_enqueue_style( 'daterangepicker-css', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');
		wp_enqueue_script( 'custom-daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/static/js/daterangepicker.js'), [], '1.0.0', true);
	}
}
