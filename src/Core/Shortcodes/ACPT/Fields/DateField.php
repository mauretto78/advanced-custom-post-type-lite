<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class DateField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $dateFormat = $this->payload->dateFormat ? $this->payload->dateFormat : get_option('date_format');
	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        try {
	        $date = new \DateTime($this->fetchMeta($rawData['value']));

	        return $this->addBeforeAndAfter($this->formatDate($dateFormat, $date));
        } catch (\Exception $exception) {
	    	return null;
        }
    }
}