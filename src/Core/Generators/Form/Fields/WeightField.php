<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Weights;

class WeightField extends AbstractField
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
					value="'.$this->defaultWeightValue().'"
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
				'.$this->renderUom($this->defaultWeight(), 'weight', Weights::getList()).'
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
    private function defaultWeightValue()
    {
        $defaultValue = $this->defaultValue();

        if(is_scalar($defaultValue)){
            return $defaultValue;
        }

        if(is_array($defaultValue) and isset($defaultValue['weightValue'])){
            return $defaultValue['weightValue'];
        }

        return null;
    }

    /**
     * @return string
     */
    private function defaultWeight()
    {
        $savedWeight = $this->defaultExtraValue("weight");

        if(!empty($savedWeight)){
            return $savedWeight;
        }

        if(isset($this->fieldModel->getExtra()['defaultValue']) and isset($this->fieldModel->getExtra()['defaultValue']['weight'])){
            return $this->fieldModel->getExtra()['defaultValue']['weight'];
        }

        return (isset($this->fieldModel->getExtra()['uom'])) ? esc_attr($this->fieldModel->getExtra()['uom']) : 'KILOGRAM';
    }

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}