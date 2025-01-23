<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class DateField extends AbstractField
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

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::DATE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$date = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="date" onfocus="this.showPicker()" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::DATE_TYPE.'">';
			$date = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="date" onfocus="this.showPicker()" class="'.$cssClass.'" value="'.$this->getDefaultValue().'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$date .= ' min="'.$min.'"';
		}

		if($max){
			$date .= ' max="'.$max.'"';
		}

		$date .= $this->appendDataValidateAndLogicAttributes();
		$date .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $date);

		return $this->renderField($field);
	}
}