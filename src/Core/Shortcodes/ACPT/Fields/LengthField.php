<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Core\Helper\Lengths;

class LengthField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

	    return $this->addBeforeAndAfter($this->renderLength($rawData));
    }

	/**
	 * @param $rawData
	 *
	 * @return string|null
	 */
    private function renderLength($rawData)
    {
	    if(!isset($rawData['value'])){
		    return null;
	    }

	    if(!isset($rawData['length'])){
		    return null;
	    }

	    if(!isset(Lengths::getList()[$rawData['length']]['symbol'])){
		    return null;
	    }

	    return '<span class="amount">'.$rawData['value'].'<span class="currency">'.Lengths::getList()[$rawData['length']]['symbol'].'</span></span>';
    }
}