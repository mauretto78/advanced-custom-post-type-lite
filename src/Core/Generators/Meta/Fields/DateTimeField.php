<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class DateTimeField extends AbstractField
{
	public function render()
	{
		$cssClass = 'regular-text acpt-admin-meta-field-input';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::DATE_TIME_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$datetime = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="datetime-local" onfocus="this.showPicker()" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::DATE_TIME_TYPE.'">';
			$datetime = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="datetime-local" onfocus="this.showPicker()" class="'.$cssClass.'" value="'.$this->getDefaultValue().'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$datetime .= ' min="'.$min.'"';
		}

		if($max){
			$datetime .= ' max="'.$max.'"';
		}

		$datetime .= $this->appendDataValidateAndLogicAttributes();
		$datetime .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $datetime);

		return $this->renderField($field);
	}
}