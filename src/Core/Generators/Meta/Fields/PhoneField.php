<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class PhoneField extends AbstractField
{
	public function render()
	{
		$this->enqueueAssets();

		$cssClass = 'regular-text acpt-admin-meta-field-input acpt-phone';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$phone = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::PHONE_TYPE.'">';
			$phone .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$phone .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[utils]" value="'.$this->getUtilsUrl() . '">';
			$phone .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[dial]" value="'.$this->getDialCode() . '">';
			$phone .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[country]" value="'.$this->getCountry() . '">';
			$phone .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="tel" class="'.$cssClass.'"';

		} else {
			$phone = '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_type" value="' . MetaFieldModel::PHONE_TYPE . '">';
			$phone .= '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_utils" value="'.$this->getUtilsUrl() . '">';
			$phone .= '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_dial" value="'.$this->getDialCode() . '">';
			$phone .= '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_country" value="'.$this->getCountry() . '">';
			$phone .= '<input ' . $this->required() . ' id="' . esc_attr( $this->getIdName() ) . '" name="' . esc_attr( $this->getIdName() ) . '" type="tel" class="'.$cssClass.'" value="' . esc_attr( $this->getDefaultValue() ) . '"';
		}
		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$pattern = $this->getAdvancedOption('pattern');

		if($min){
			$phone .= ' minlength="'.$min.'"';
		}

		if($max){
			$phone .= ' maxlength="'.$max.'"';
		}

		if($pattern){
			$phone .= ' pattern="'.$pattern.'"';
		}

		$phone .= $this->appendDataValidateAndLogicAttributes();
		$phone .= '>';

		$field = (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $phone);

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function getUtilsUrl()
	{
		return plugins_url('advanced-custom-post-type/assets/vendor/intlTelInput/js/utils.min.js');
	}

	/**
	 * @return string|null
	 */
	private function getCountry()
	{
		return $this->getDefaultAttributeValue('country', 'us');
	}

	/**
	 * @return string|null
	 */
	private function getDialCode()
	{
		return $this->getDefaultAttributeValue('dial', '1');
	}

	/**
	 * Enqueue needed assets
	 */
	private function enqueueAssets()
	{
		wp_enqueue_script( 'intlTelInput-js', plugins_url('advanced-custom-post-type/assets/vendor/intlTelInput/js/intlTelInput.min.js'), [], '1.10.60', true);
		wp_enqueue_style( 'intlTelInput-css', plugins_url('advanced-custom-post-type/assets/vendor/intlTelInput/css/intlTelInput.min.css'), [], '1.10.60', 'all');
	}
}
