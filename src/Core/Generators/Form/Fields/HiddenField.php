<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class HiddenField extends AbstractField
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
				value='".$this->defaultValue()."'
				type='hidden'
			/>";
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
