<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class DateField extends AbstractField
{
	public function render()
	{
		$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::DATE_TYPE.'">';
		$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="date" class="acpt-form-control" value="'.$this->getDefaultValue().'"';
		$field .= '>';

		return $this->renderField($field);
	}
}