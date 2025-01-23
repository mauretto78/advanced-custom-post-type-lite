<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
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

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXT_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$text = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="text" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXT_TYPE.'">';
			$text = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="text" class="'.$cssClass.'" value="'.esc_attr($this->getDefaultValue()).'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$pattern = $this->getAdvancedOption('pattern');

		if($min){
			$text .= ' minlength="'.$min.'"';
		}

		if($max){
			$text .= ' maxlength="'.$max.'"';
		}

		if($pattern){
			$text .= ' pattern="'.$pattern.'"';
		}

		$text .= $this->appendDataValidateAndLogicAttributes();
		$text .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $text);

		return $this->renderField($field);
	}
}