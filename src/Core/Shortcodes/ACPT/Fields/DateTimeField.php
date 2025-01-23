<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class DateTimeField extends DateField
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
		    $timeFormat = $this->getDefaultTimeFormat();
		    $dateTimeFormat = $dateFormat . ' ' . $timeFormat;
		    $date = new \DateTime($rawData['value']);

		    return $this->addBeforeAndAfter($this->formatDate($dateTimeFormat, $date));
	    } catch (\Exception $exception){
		    return null;
	    }
    }
}