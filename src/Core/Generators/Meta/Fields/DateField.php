<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class DateField extends AbstractField
{
	public function render()
	{
		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::DATE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="date" class="regular-text acpt-admin-meta-field-input"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::DATE_TYPE.'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="date" class="acpt-form-control" value="'.$this->getDefaultValue().'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$field .= ' min="'.$min.'"';
		}

		if($max){
			$field .= ' max="'.$max.'"';
		}

		$field .= $this->appendDataValidateAndLogicAttributes();
		$field .= '>';

		return $this->renderField($field);
	}
}