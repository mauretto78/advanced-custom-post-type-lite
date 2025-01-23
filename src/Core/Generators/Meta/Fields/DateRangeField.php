<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class DateRangeField extends AbstractField
{
	public function render()
	{
		$this->enqueueAssets();
		$defaultValue = esc_attr($this->defaultDateInterval());

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::DATE_RANGE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$dateRange = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.$defaultValue.'" type="text" class="acpt-daterangepicker regular-text acpt-admin-meta-field-input"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::DATE_RANGE_TYPE.'">';
			$dateRange = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="text" class="acpt-daterangepicker acpt-admin-meta-field-input" value="'.$defaultValue.'"';
		}

		$min = $this->getAdvancedOption('min') ?? null;
		$max = $this->getAdvancedOption('max') ?? null;

		if($min){
			$dateRange .= ' data-min-date="'.$min.'"';
		}

		if($max){
			$dateRange .= ' data-max-date="'.$max.'"';
		}

		$dateRange .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $dateRange);

		return $this->renderField($field);
	}

	/**
	 * @return string|null
	 */
	private function defaultDateInterval()
	{
		$defaultValue = $this->getDefaultValue();

		if(
			is_array($defaultValue) and
		    isset($defaultValue['from']) and
			isset($defaultValue['to'])
		){
			return $defaultValue['from'] . " - " . $defaultValue['to'];
		}

		return $defaultValue;
	}

	private function enqueueAssets()
	{
		wp_enqueue_script( 'momentjs', plugins_url( 'advanced-custom-post-type/assets/vendor/moment/moment.min.js'), [], '2.18.1', true);
		wp_enqueue_script( 'daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/js/daterangepicker.min.js'), [], '3.1.0', true);
		wp_enqueue_style( 'daterangepicker-css', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');
		wp_enqueue_script( 'custom-daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/static/js/daterangepicker.js'), [], '1.0.0', true);
	}
}