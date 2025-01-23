<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Currencies;

class CurrencyField extends AbstractField
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
					value="'.$this->defaultCurrencyValue().'"
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
				'.$this->renderUom($this->defaultCurrency(), 'currency', Currencies::getList()).'
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
    private function defaultCurrencyValue()
    {
        $defaultValue = $this->defaultValue();

        if(is_scalar($defaultValue)){
            return $defaultValue;
        }

        if(is_array($defaultValue) and isset($defaultValue['currencyValue'])){
            return $defaultValue['currencyValue'];
        }

        return null;
    }

    /**
     * @return string
     */
	private function defaultCurrency()
    {
        $savedCurrency = $this->defaultExtraValue("currency");

        if(!empty($savedCurrency)){
            return $savedCurrency;
        }

        if(isset($this->fieldModel->getExtra()['defaultValue']) and isset($this->fieldModel->getExtra()['defaultValue']['currency'])){
            return $this->fieldModel->getExtra()['defaultValue']['currency'];
        }

        return (isset($this->fieldModel->getExtra()['uom'])) ? esc_attr($this->fieldModel->getExtra()['uom']) : 'USD';
    }

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}