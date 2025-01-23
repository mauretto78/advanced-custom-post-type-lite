<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class RadioField extends CheckboxField
{
	public function render()
	{
		$cssClass = '';

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass = ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::RADIO_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::RADIO_TYPE.'">';
		}

		$selectedOptions = $this->selectedOptions($this->metaField->getOptions());
		$field .= '<div class="acpt_checkboxes">';
		$selected = ('' === $this->getDefaultValue()) ? 'checked="checked"' : '';

		if($this->isChild()){
			if(empty($this->getAdvancedOption('hide_blank_radio'))){
				$field .= '<div class="item"><input class="'.$cssClass.'" name="'.esc_attr($this->getIdName()).'[value]" id="'.esc_attr($this->getIdName()).'_blank" type="radio" '.$selected.' value="" /><label for="'.esc_attr($this->getIdName()).'_blank">'.Translator::translate('No choice').'</label></div>';
			}

			foreach ($this->metaField->getOptions() as $index => $option){
				$id = esc_attr($this->getIdName()).'_'.$index;
				$selected = (in_array($option->getValue(), $selectedOptions)) ? 'checked="checked"' : '';
				$field .= '<div class="item"><input class="'.$cssClass.'" name="'.esc_attr($this->getIdName()).'[value]" id="'.$id.'" type="radio" '.$selected.' value="'.esc_attr(Translator::translateString($option->getValue())).'" '.$this->appendDataValidateAndLogicAttributes().'/><label for="'.$id.'">'. $this->renderItemLabel($option->getLabel()) . '</label></div>';
			}
		} else {
			if(empty($this->getAdvancedOption('hide_blank_radio'))){
				$field .= '<div class="item"><input class="'.$cssClass.'" name="'.esc_attr($this->getIdName()).'" id="'.esc_attr($this->getIdName()).'_blank" type="radio" '.$selected.' value="" '.$this->appendDataValidateAndLogicAttributes().'/><label for="'.esc_attr($this->getIdName()).'_blank">'.Translator::translate('No choice').'</label></div>';
			}

			foreach ($this->metaField->getOptions() as $index => $option){
				$id = esc_attr($this->getIdName()).'_'.$index;
				$selected = (in_array($option->getValue(), $selectedOptions)) ? 'checked="checked"' : '';
				$field .= '<div class="item"><input class="'.$cssClass.'" name="'.esc_attr($this->getIdName()).'" id="'.$id.'" type="radio" '.$selected.' value="'.esc_attr(Translator::translateString($option->getValue())).'" '.$this->appendDataValidateAndLogicAttributes().'/><label for="'.$id.'">'. $this->renderItemLabel($option->getLabel()) . '</label></div>';
			}
		}

		$field .= '</div>';

		return $this->renderField($field);
	}
}
