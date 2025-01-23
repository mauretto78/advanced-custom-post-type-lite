<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Lengths;

class LengthField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$min = 0.01;
		$max = 99999999999999;
		$step = 0.01;

		$field = '
			<div class="acpt-uom">
				<input 
					placeholder="'.$this->placeholder().'"
					value="'.$this->defaultLengthValue().'"
					type="number"
                    min="'.$min.'" 
                    max="'.$max.'" 
                    step="'.$step.'" 
					id="'.$this->getIdName().'"
					name="'.$this->getIdName().'"
					class="'.$this->cssClass().'"
					'.$this->required().'
					'.$this->appendDataValidateAttributes().'
				/>
				'.$this->renderUom($this->defaultLength(), 'length', Lengths::getList()).'
			</div>
		';

		if($this->fieldModel->getMetaField() !== null){
			return (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $field);
		}

		return $field;
	}

    /**
     * @return string
     */
    private function defaultLengthValue()
    {
        $defaultValue = $this->defaultValue();

        if(is_scalar($defaultValue)){
            return $defaultValue;
        }

        if(is_array($defaultValue) and isset($defaultValue['lengthValue'])){
            return $defaultValue['lengthValue'];
        }

        return null;
    }

    /**
     * @return string
     */
    private function defaultLength()
    {
        $savedLength = $this->defaultExtraValue("length");

        if(!empty($savedLength)){
            return $savedLength;
        }

        if(isset($this->fieldModel->getExtra()['defaultValue']) and isset($this->fieldModel->getExtra()['defaultValue']['length'])){
            return $this->fieldModel->getExtra()['defaultValue']['length'];
        }

        return (isset($this->fieldModel->getExtra()['uom'])) ? esc_attr($this->fieldModel->getExtra()['uom']) : 'KILOMETER';
    }

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}