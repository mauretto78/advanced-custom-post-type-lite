<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class EmailField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::EMAIL_TYPE.'">';
		$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="email" class="regular-text acpt-admin-meta-field-input" value="'.esc_attr($this->getDefaultValue()).'"';
		$field .= '>';

		return $this->renderField($field);
	}
}