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

    	if($this->metaBoxFieldModel !== null and $this->metaBoxFieldModel->getAdvancedOption('date_format') !== null){
    		return $this->metaBoxFieldModel->getAdvancedOption('date_format');
	    }

	    if(!empty(get_option('date_format'))){
		    return get_option('date_format');
	    }

	    return "Y-m-d";
    }

	/**
	 * @return mixed|void|null
	 */
    protected function getDefaultTimeFormat()
    {
	    if(!empty($this->payload->timeFormat)){
		    return $this->payload->timeFormat;
	    }

	    if($this->metaBoxFieldModel !== null and  $this->metaBoxFieldModel->getAdvancedOption('time_format') !== null){
		    return $this->metaBoxFieldModel->getAdvancedOption('time_format');
	    }

	    if(!empty(get_option('time_format'))){
	    	return get_option('time_format');
	    }

	    return "H:i";
    }
}