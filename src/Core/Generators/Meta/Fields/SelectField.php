<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class SelectField extends AbstractField
{
	public function render()
	{
		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::SELECT_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" class="acpt-select2 acpt-admin-meta-field-input" '.$this->appendDataValidateAndLogicAttributes() . '>';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::SELECT_TYPE.'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="acpt-select2 acpt-form-control" '.$this->appendDataValidateAndLogicAttributes() . '>';
		}

		$selectedOptions = $this->selectedOptions($this->metaField->getOptions());
		$field .= '<option value="">'.Translator::translate("--Select--").'</option>';

		foreach ($this->metaField->getOptions() as $option){
			$selected = (in_array($option->getValue(), $selectedOptions)) ? 'selected="selected"' : '';
			$field .= '<option '.$selected.' value="'.esc_attr($option->getValue()).'">'.esc_html($option->getLabel()).'</option>';
		}

		$field .= '</select>';

		return $this->renderField($field);
	}
}
