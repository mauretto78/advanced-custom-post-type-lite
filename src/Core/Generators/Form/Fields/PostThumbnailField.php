<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class PostThumbnailField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$value = $this->defaultValue();

		$field = "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				accept='image/*'
				placeholder='".$this->placeholder()."'
				type='file'
				class='".$this->cssClass()."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			/>";

		if(empty($value)){
			return $field;
		}

		return "<div class='actp-form-inline'>
			<img src='".$value."' class='acpt-thumbnail'/>
			".$field."
			</div>";
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
