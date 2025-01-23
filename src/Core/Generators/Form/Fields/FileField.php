<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class FileField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$accept = (!empty($this->fieldModel->getExtra()['accept'])) ? $this->fieldModel->getExtra()['accept'] : '*';
		$multiple = (!empty($this->fieldModel->getExtra()['multiple'])) ? $this->fieldModel->getExtra()['multiple'] : '';
		$name = ($multiple) ? esc_attr($this->getIdName()).'[]' : esc_attr($this->getIdName());

		return "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".$name."'
				placeholder='".$this->placeholder()."'
				value='".$this->defaultValue()."'
				type='file'
				".($multiple ? 'multiple' : '')."
				accept='".$accept."'
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
