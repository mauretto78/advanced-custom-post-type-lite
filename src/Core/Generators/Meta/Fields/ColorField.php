<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class ColorField extends AbstractField
{
	public function render()
	{
		$cssClass = 'acpt-admin-meta-field-input acpt-color-picker';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::COLOR_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" type="text" class="'.$cssClass.'" value="' .esc_attr($this->getDefaultValue()).'" '.$this->appendDataValidateAndLogicAttributes() . '>';
			$field .= '<button data-target-id="'.esc_attr($this->getIdName()).'[value]" class="acpt-eye-dropper-button button">'.Translator::translate('Eye dropper').'</button>';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::COLOR_TYPE.'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="text" class="'.$cssClass.'" value="' .esc_attr($this->getDefaultValue()).'" '.$this->appendDataValidateAndLogicAttributes() . '>';
			$field .= '<button data-target-id="'.esc_attr($this->getIdName()).'" class="acpt-eye-dropper-button button">'.Translator::translate('Eye dropper').'</button>';
		}

		return $this->renderField($field);
	}
}