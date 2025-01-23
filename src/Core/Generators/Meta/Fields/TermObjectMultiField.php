<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class TermObjectMultiField extends TermObjectField
{
	public function render()
	{
		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TERM_OBJECT_MULTI_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<select '.$this->required().' multiple id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value][]" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 acpt-admin-meta-field-input">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TERM_OBJECT_MULTI_TYPE.'">';
			$field .= '<select '.$this->required().' multiple id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'[]" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 regular-text">';
		}

		$field .= '<option value="">'.Translator::translate("--Select--").'</option>';
		$termList = $this->termList();

		if(is_array($termList)){
			foreach($termList as $element){
				$field .= '<optgroup label="'.$element['taxonomy'].'">';

				foreach ($element['terms'] as $id => $term){
					if(empty($this->getDefaultValue()) or $this->getDefaultValue() === ''){
						$selected = '';
					} else {
						$selected = (is_array($this->getDefaultValue()) and in_array($id, $this->getDefaultValue())) ? 'selected="selected"' : '';
					}

					$field .= '<option '.$selected.' value="'.$id.'">'.esc_html($term).'</option>';
				}

				$field .= '</optgroup>';
			}
		}


		$field .= '</select>';

		return $this->renderField($field);
	}
}