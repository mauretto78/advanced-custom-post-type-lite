<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class DateField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $dateFormat = $this->getDefaultDateFormat();
	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        try {
	        $date = new \DateTime($rawData['value']);

	        return $this->addBeforeAndAfter($this->formatDate($dateFormat, $date));
        } catch (\Exception $exception) {
	    	return null;
        }
    }

	/**
	 * @return mixed|void|null
	 */
    protected function getDefaultDateFormat()
    {
    	if(!empty($this->payload->dateFormat)){
    		return $this->payload->dateFormat;
	    }

	    if(!empty(get_option('date_format'))){
		    return get_option('date_format');
	    }

	    return "Y-m-d";
    }
}