<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class SelectField extends AbstractField
{
	public function render()
	{
		$cssClass = 'acpt-select2 acpt-admin-meta-field-input';

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::SELECT_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$select = '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" class="'.$cssClass.'" '.$this->appendDataValidateAndLogicAttributes() . '>';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::SELECT_TYPE.'">';
			$select = '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="'.$cssClass.'" '.$this->appendDataValidateAndLogicAttributes() . '>';
		}

		$selectedOptions = $this->selectedOptions($this->metaField->getOptions());
		$select .= '<option value="">'.Translator::translate("--Select--").'</option>';

		foreach ($this->metaField->getOptions() as $option){
			$selected = (in_array($option->getValue(), $selectedOptions)) ? 'selected="selected"' : '';
			$select .= '<option '.$selected.' value="'.esc_attr(Translator::translateString($option->getValue())).'">'.esc_html(Translator::translateString($option->getLabel())).'</option>';
		}

		$select .= '</select>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $select);

		return $this->renderField($field);
	}
}
