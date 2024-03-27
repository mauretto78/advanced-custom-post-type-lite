<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextareaField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<textarea '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" class="acpt-admin-meta-field-input" rows="8" cols="50"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
			$field .= '<textarea '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="acpt-form-control" rows="8" cols="50"';

		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');

		if($min){
			$field .= ' minlength="'.$min.'"';
		}

		if($max){
			$field .= ' maxlength="'.$max.'"';
		}

		$field .= $this->appendDataValidateAndLogicAttributes();
		$field .= '>';

		$field .= esc_attr($this->getDefaultValue()).'</textarea>';

		return $this->renderField($field);
	}
}
