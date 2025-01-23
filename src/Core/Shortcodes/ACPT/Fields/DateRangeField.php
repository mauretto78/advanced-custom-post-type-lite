<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class DateRangeField extends DateField
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
		    $dateFormat = $this->getDefaultDateFormat();
		    $rawValue = $rawData['value'];
		    $rawValue = explode(" - ", $rawValue);
		    $dateStart = new \DateTime($rawValue[0]);
		    $dateEnd = new \DateTime($rawValue[1]);

		    return $this->addBeforeAndAfter($this->formatDate($dateFormat, $dateStart)) . ' - '. $this->addBeforeAndAfter($this->formatDate($dateFormat, $dateEnd));
	    } catch (\Exception $exception){
	    	return null;
	    }
    }
}