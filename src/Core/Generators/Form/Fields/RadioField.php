<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class RadioField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$value = $this->defaultValue();
		$options = (!empty($this->fieldModel->getExtra()['options'])) ? $this->fieldModel->getExtra()['options'] : [];

		$field = '';

		foreach ($options as $index => $option){
			$field .= '
				<input 
					id="'.esc_attr($this->getIdName()).'_'.$index.'"
					name="'.esc_attr($this->getIdName()).'"
					type="radio" 
			        value="'.esc_attr($option['value']).'"
			        '.($option['value'] == $value ? "checked" : "").'
			        '.$this->required().'
		        />
			    <label for="'.esc_attr($this->getIdName()).'_'.$index.'">
			    	'.esc_attr($option['label']).'    
				</label>';
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
