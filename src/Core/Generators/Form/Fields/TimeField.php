<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;

class TimeField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$field = "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='time'
				class='".$this->cssClass()."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			/>";

		if($this->fieldModel->getMetaField() !== null){
			return (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $field);
		}

		return $field;
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
