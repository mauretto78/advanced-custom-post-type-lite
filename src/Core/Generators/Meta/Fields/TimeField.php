<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TimeField extends AbstractField
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

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TIME_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$time = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="time" onfocus="this.showPicker()" class="'.$cssClass.'"';

		} else {
			$field = '<input type="hidden" name="' . esc_attr( $this->getIdName() ) . '_type" value="' . MetaFieldModel::TIME_TYPE . '">';
			$time = '<input ' . $this->required() . ' id="' . esc_attr( $this->getIdName() ) . '" name="' . esc_attr( $this->getIdName() ) . '" type="time" onfocus="this.showPicker()" class="'.$cssClass.'" value="' . $this->getDefaultValue() . '"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$time .= ' min="'.$min.'"';
		}

		if($max){
			$time .= ' max="'.$max.'"';
		}

		$time .= $this->appendDataValidateAndLogicAttributes();
		$time .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $time);

		return $this->renderField($field);
	}
}
