<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class ToggleField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$checked = (isset($this->fieldModel->getExtra()['checked']) and $this->fieldModel->getExtra()['checked'] == 1) ? true : false;

		return '
			<div class="toggle-group">
                <label class="toggle">
                    <input
                        id="'.$this->getIdName().'"
                        name='.$this->getIdName().'
                        type="checkbox"
                        value="1"
            			'.($checked ? "checked" : "").'            
                    	'.$this->required().'
                    />
                    <span class="slider round"/>
                </label>
            </div>
		';
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
