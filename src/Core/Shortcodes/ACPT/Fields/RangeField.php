<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Core\Helper\Strings;

class RangeField extends AbstractField
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

	    if(empty($rawData['value'])){
		    return null;
	    }

	    $value = $rawData['value'];
	    $value = Strings::convertStringToNumber($value);

        return $this->addBeforeAndAfter($value);
    }
}