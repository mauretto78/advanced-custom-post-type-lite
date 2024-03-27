<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextField extends AbstractField
{
	public function render()
	{
		$cssClass = 'regular-text acpt-admin-meta-field-input';
		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXT_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="text" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXT_TYPE.'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="text" class="'.$cssClass.'" value="'.esc_attr($this->getDefaultValue()).'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$pattern = $this->getAdvancedOption('pattern');

		if($min){
			$field .= ' minlength="'.$min.'"';
		}

		if($max){
			$field .= ' maxlength="'.$max.'"';
		}

		if($pattern){
			$field .= ' pattern="'.$pattern.'"';
		}

		$field .= $this->appendDataValidateAndLogicAttributes();
		$field .= '>';

		return $this->renderField($field);
	}
}