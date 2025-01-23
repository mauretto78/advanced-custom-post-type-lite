<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\PHP\Phone;

class PhoneField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        return $this->renderPhone($rawData['value'], $rawData['dial']);
    }

	/**
	 * @param $phone
	 * @param null $dial
	 *
	 * @return string
	 */
    private function renderPhone($phone, $dial = null)
    {
    	if(!empty($dial)){
		    $phone = "+".$dial. " " .$phone;
	    }

    	if($this->payload->render === 'text'){
    		return $phone;
	    }

    	return '<a href="tel:'.Phone::url($phone).'" target="_blank">'.$this->addBeforeAndAfter($phone).'</a>';
    }
}