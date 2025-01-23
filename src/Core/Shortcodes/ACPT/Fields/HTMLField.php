<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class HTMLField extends AbstractField
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

        return $this->addBeforeAndAfter($rawData['value']);
    }
}