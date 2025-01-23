<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextareaField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$cols = $this->getAdvancedOption('cols') ? ceil($this->getAdvancedOption('cols')) : 50;
		$rows = $this->getAdvancedOption('rows') ? ceil($this->getAdvancedOption('rows')) : 8;
		$cssClass = 'regular-text acpt-admin-meta-field-input';

		if($this->isLeadingField()){
			$cssClass .= ' acpt-leading-field';
		}

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$textarea = '<textarea '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" class="'.$cssClass.'" rows="'.$rows.'" cols="'.$cols.'"';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
			$textarea = '<textarea '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="'.$cssClass.'" rows="'.$rows.'" cols="'.$cols.'"';
		}

		if($min){
			$textarea .= ' minlength="'.$min.'"';
		}

		if($max){
			$textarea .= ' maxlength="'.$max.'"';
		}

		$textarea .= $this->appendDataValidateAndLogicAttributes();
		$textarea .= '>';

		$textarea .= esc_attr($this->getDefaultValue()).'</textarea>';

		$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $textarea);

		return $this->renderField($field);
	}
}
