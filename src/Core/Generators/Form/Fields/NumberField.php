<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;

class NumberField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$min = (!empty($this->fieldModel->getExtra()['min'])) ? esc_attr($this->fieldModel->getExtra()['min']) : 1;
		$max = (!empty($this->fieldModel->getExtra()['max'])) ? esc_attr($this->fieldModel->getExtra()['max']) : 100;
		$step = (!empty($this->fieldModel->getExtra()['step'])) ? esc_attr($this->fieldModel->getExtra()['step']) : 1;
		$field = "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='number'
				min='".$min."'
				max='".$max."'
				step='".$step."'
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
