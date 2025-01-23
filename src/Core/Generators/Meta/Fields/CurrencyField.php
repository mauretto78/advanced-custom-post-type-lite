<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Currencies;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CurrencyField extends AbstractField
{
	public function render()
	{
		$list = Currencies::getList();
		$cssClass = 'currency-amount';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		$after = (!empty($this->getAdvancedOption('after'))) ? "<span class='after'>".htmlspecialchars($this->getAdvancedOption('after'))."</span>" : "";
		$before =  (!empty($this->getAdvancedOption('before'))) ? "<span class='before'>".htmlspecialchars($this->getAdvancedOption('before'))."</span>" : "";

		$min = $this->getAdvancedOption('min') ? $this->getAdvancedOption('min') : 0.01;
		$max = $this->getAdvancedOption('max') ? $this->getAdvancedOption('max') : null;
		$step = $this->getAdvancedOption('step') ? $this->getAdvancedOption('step') : 0.01;

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::CURRENCY_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input type="hidden" name="meta_fields[]" value="'.esc_attr($this->getIdName()).'[currency]">';
			$field .= '<div class="currency-group w-full">
					'.$before.'
                    <div class="currency-symbol">'.Currencies::getList()[$this->getDefaultCurrencyValue()]['symbol'].'</div>
                    <input 
                        '.$this->required().' 
                        id="'.esc_attr($this->getIdName()).'[value]" 
                        name="'. esc_attr($this->getIdName()).'[value]" 
                        type="number" 
                        min="'.$min.'" 
                        max="'.$max.'" 
                        step="'.$step.'"
                        class="'.$cssClass.'" 
                        value="'.esc_attr($this->defaultValue()).'"
                        '.$this->appendDataValidateAndLogicAttributes() . '
                    >
                    <div class="currency-addon">
                        <select name="'. esc_attr($this->getIdName()).'[currency]" class="currency-selector">';

			foreach (Currencies::getList() as $currency => $data){
				$selected = ($currency === $this->getDefaultCurrencyValue()) ? 'selected' : '';
				$field .= '<option value="'.esc_attr($currency).'" data-symbol="'.esc_attr($data['symbol']).'" data-placeholder="0.00" '.$selected.'>'.esc_html($currency).'</option>';
			}

		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::CURRENCY_TYPE.'">';
			$field .= '<div class="currency-group">
					'.$before.'
                    <div class="currency-symbol">'.$list[$this->getDefaultCurrencyValue()]['symbol'].'</div>
                    <input 
                    	'.$this->required().' 
                    	id="'.esc_attr($this->getIdName()).'" 
                    	name="'. esc_attr($this->getIdName()).'" 
                    	type="number" 
                    	min="'.$min.'" 
                    	max="'.$max.'" 
                    	step="'.$step.'" 
                    	class="'.$cssClass.'" 
                    	value="'.esc_attr($this->defaultValue()).'"
                    	'.$this->appendDataValidateAndLogicAttributes() . '
					>
                  	<div class="currency-addon">
                        <select name="'. esc_attr($this->getIdName()).'_currency" class="currency-selector">';

			foreach ($list as $currency => $data){
				$selected = ($currency === $this->getDefaultCurrencyValue()) ? 'selected' : '';
				$field .= '<option value="'.esc_attr($currency).'" data-symbol="'.esc_attr($data['symbol']).'" data-placeholder="0.00" '.$selected.'>'.esc_html($currency).'</option>';
			}
		}

		$field .=' </select>
              </div>
              '.$after.'
            </div>';

		return $this->renderField($field);
	}

    /**
     * @return mixed|null
     */
    private function defaultValue()
    {
        $defaultValue = $this->getDefaultValue();

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
	private function getDefaultCurrencyValue()
	{
        $defaultValue = $this->getDefaultValue();

        if(is_scalar($defaultValue)){
            $uomDefaultValue = $this->getAdvancedOption('uom_default_value') ? $this->getAdvancedOption('uom_default_value') : 'USD';

            return $this->getDefaultAttributeValue('currency', $uomDefaultValue);
        }

        if(is_array($defaultValue) and isset($defaultValue['currency'])){
            return $defaultValue['currency'];
        }

        return null;
	}
}