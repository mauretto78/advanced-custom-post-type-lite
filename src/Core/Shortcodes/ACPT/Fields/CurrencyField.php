<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Core\Helper\Currencies;

class CurrencyField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

        return $this->addBeforeAndAfter($this->renderCurrency($rawData));
    }

	/**
	 * @param $rawData
	 *
	 * @return string|null
	 */
	private function renderCurrency($rawData)
	{
		if(!isset($rawData['value'])){
			return null;
		}

		if(!isset($rawData['currency'])){
			return null;
		}

		if(!isset(Currencies::getList()[$rawData['currency']]['symbol'])){
			return null;
		}

		return '<span class="amount">'.$rawData['value'].'<span class="currency">'.Currencies::getList()[$rawData['currency']]['symbol'].'</span></span>';
    }
}