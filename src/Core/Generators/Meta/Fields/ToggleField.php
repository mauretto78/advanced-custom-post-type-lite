<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class ToggleField extends AbstractField
{
	public function render()
	{
		$checked = ($this->getToggleValue() == 1) ? 'checked="checked"' : '';

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TOGGLE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input type="hidden" id="'.$id.'" name="'.esc_html($this->getIdName()).'[value]" value="'.esc_attr($this->getToggleValue()).'">';
			$field .= '<input 
				id="'.$id.'"
				name="' . $id . '" 
				type="checkbox" 
				value="1" 
				class="wppd-ui-toggle" 
				'.$checked.' 
				'.$this->appendDataValidateAndLogicAttributes() . '
			/>';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TOGGLE_TYPE.'">';
			$field .= '<input type="hidden" id="'.esc_attr($this->getIdName()).'" name="'.esc_html($this->getIdName()).'" value="'.esc_attr($this->getToggleValue()).'">';
			$field .= '<input 
				id="'.esc_attr($this->getIdName()).'" 
				name="' . esc_attr( $this->getIdName() ) . '" 
				type="checkbox" 
				value="1" 
				class="wppd-ui-toggle" 
				'.$checked.' 
				'.$this->appendDataValidateAndLogicAttributes() . '
			/>';
		}

		return $this->renderField($field);
	}

	/**
	 * @return int
	 */
	private function getToggleValue()
	{
		$allowedValues = [0, 1];

		// this check avoids to use not boolean previously saved values
		if(!empty($this->getDefaultValue()) and in_array($this->getDefaultValue(), $allowedValues)){
			return $this->getDefaultValue();
		}

		$defaultValue = $this->metaField->getDefaultValue();

		if(!empty($defaultValue) and in_array($defaultValue, $allowedValues)){
			return $defaultValue;
		}

		return 0;
	}
}
