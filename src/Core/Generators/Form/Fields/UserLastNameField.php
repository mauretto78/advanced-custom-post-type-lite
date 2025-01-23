<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class UserLastNameField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='text'
				class='".$this->cssClass()."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			/>";
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
