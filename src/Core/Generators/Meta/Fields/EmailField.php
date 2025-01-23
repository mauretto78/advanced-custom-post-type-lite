<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class EmailField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
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

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::EMAIL_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$email = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="email" class="'.$cssClass.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::EMAIL_TYPE.'">';
			$email = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="email" class="'.$cssClass.'" value="'.esc_attr($this->getDefaultValue()).'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$email .= ' minlength="'.$min.'"';
		}

		if($max){
			$email .= ' maxlength="'.$max.'"';
		}

		$email .= $this->appendDataValidateAndLogicAttributes();
		$email .= '>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $email);

		return $this->renderField($field);
	}
}