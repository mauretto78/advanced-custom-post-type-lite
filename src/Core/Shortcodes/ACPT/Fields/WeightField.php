<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Core\Helper\Weights;

class WeightField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

        return $this->addBeforeAndAfter($this->renderWeight($rawData));
    }

	/**
	 * @param $value
	 * @param $weight
	 *
	 * @return string
	 */
	private function renderWeight($rawData)
	{
		if(!isset($rawData['value'])){
			return null;
		}

		if(!isset($rawData['weight'])){
			return null;
		}

		if(!isset(Weights::getList()[$rawData['weight']]['symbol'])){
			return null;
		}

		return '<span class="amount">'.$rawData['value'].'<span class="currency">'.Weights::getList()[$rawData['weight']]['symbol'].'</span></span>';
	}
}