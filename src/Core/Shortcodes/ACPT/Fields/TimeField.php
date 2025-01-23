<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class TimeField extends DateField
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

	    try {
		    $timeFormat = $this->getDefaultTimeFormat();
		    $date = new \DateTime($rawData['value']);

		    return $this->addBeforeAndAfter($this->formatDate($timeFormat, $date));
	    } catch (\Exception $exception){
		    return null;
	    }
    }
}