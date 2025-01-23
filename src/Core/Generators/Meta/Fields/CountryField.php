<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CountryField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$this->enqueueAssets();

		$cssClass = 'regular-text acpt-admin-meta-field-input acpt-country';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$country = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::COUNTRY_TYPE.'">';
			$country .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$country .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[country]" value="'.$this->getCountry() . '">';
			$country .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="text" class="'.$cssClass.'"';
		} else {
			$country = '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_type" value="' . MetaFieldModel::COUNTRY_TYPE . '">';
			$country .= '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_country" value="'.$this->getCountry() . '">';
			$country .= '<input ' . $this->required() . ' id="' . esc_attr( $this->getIdName() ) . '" name="' . esc_attr( $this->getIdName() ) . '" type="text" class="'.$cssClass.'" value="' . esc_attr( $this->getDefaultValue() ) . '"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$pattern = $this->getAdvancedOption('pattern');

		if($min){
			$country .= ' minlength="'.$min.'"';
		}

		if($max){
			$country .= ' maxlength="'.$max.'"';
		}

		if($pattern){
			$country .= ' pattern="'.$pattern.'"';
		}

		$country .= $this->appendDataValidateAndLogicAttributes();
		$country .= '>';

		$field = (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $country);

		return $this->renderField($field);
	}

	/**
	 * @return string|null
	 */
	private function getCountry()
	{
		return $this->getDefaultAttributeValue('country', 'us');
	}

	/**
	 * Enqueue needed assets
	 */
	private function enqueueAssets()
	{
		wp_enqueue_script( 'countrySelect-js', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/js/countrySelect.min.js'), [], '2.1.1', true);
		wp_enqueue_style( 'countrySelect-css', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/css/countrySelect.min.css'), [], '2.1.1', 'all');
	}
}