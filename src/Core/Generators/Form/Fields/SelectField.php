<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class SelectField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$empty = (!empty($this->fieldModel->getExtra()['empty'])) ? $this->fieldModel->getExtra()['empty'] : false;
		$value = $this->defaultValue();
		$options = (!empty($this->fieldModel->getExtra()['options'])) ? $this->fieldModel->getExtra()['options'] : [];
		$isMulti = $this->isMulti();

		$multiple = '';
		$fieldName = esc_attr($this->getIdName());

		if($isMulti){
			$fieldName .= "[]";
			$multiple = "multiple";
		}

		$field = "<select
			".$multiple."
			id='".esc_attr($this->getIdName())."'
			name='".$fieldName."'
			placeholder='".$this->placeholder()."'
			class='".$this->cssClass()."'
			".$this->required()."
		>";

		if($empty){
			$field .= '
				<option value="">
			        '.Translator::translate("Select").'
				</option>';
		}

		foreach ($options as $option){
			$field .= '
				<option 
			        value="'.esc_attr($option['value']).'"
			        '.($option['value'] == $value ? "selected" : "").'
		        >
			        '.esc_attr($option['label']).'
				</option>';
		}

		$field .= '</select>';

		if($this->fieldModel->getMetaField() !== null){
			return (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $field);
		}

		return $field;
	}

    /**
     * @return bool
     */
	private function isMulti()
    {
        return $this->fieldModel->getMetaField() !== null ? $this->fieldModel->getMetaField()->getType() === MetaFieldModel::SELECT_MULTI_TYPE : false;
    }

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
