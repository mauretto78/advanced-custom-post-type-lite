<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class NumberField extends AbstractField
{
	public function render()
	{
		$cssClass = 'regular-text acpt-admin-meta-field-input';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		$defaultValue = (!empty($this->getDefaultValue() and is_numeric($this->getDefaultValue()))) ? $this->getDefaultValue() : null;

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::NUMBER_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$number = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($defaultValue).'" type="number" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::NUMBER_TYPE.'">';
			$number = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="number" class="'.$cssClass.'" value="'. esc_attr($defaultValue).'"';
		}


		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$step = $this->getAdvancedOption('step');

		if($min){
			$number .= ' min="'.$min.'"';
		}

		if($max){
			$number .= ' max="'.$max.'"';
		}

		if($step){
			$number .= ' step="'.$step.'"';
		}

		$number .= $this->appendDataValidateAndLogicAttributes();
		$number .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $number);

		return $this->renderField($field);
	}
}
