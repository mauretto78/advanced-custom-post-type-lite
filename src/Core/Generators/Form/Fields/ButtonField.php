<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class ButtonField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$label = (!empty($this->fieldModel->getExtra()['label'])) ? esc_attr($this->fieldModel->getExtra()['label']) : 'Button';
		$css = (!empty($this->fieldModel->getSettings()['css'])) ? $this->fieldModel->getSettings()['css'] : 'acpt-form-button';
		$type = (!empty($this->fieldModel->getExtra()['type'])) ? $this->fieldModel->getExtra()['type'] : 'submit';
		$dataAttr = ($type === 'submit') ? 'data-acpt-submit' : '';

		return "
			<button
				id='".esc_attr($this->getIdName())."'
				type='".$type."'
				class='".$css."'
				".$dataAttr."
			>
				".trim($label)."
			</button>
		";
	}

	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
