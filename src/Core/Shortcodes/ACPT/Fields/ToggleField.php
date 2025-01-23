<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

class ToggleField extends AbstractField
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

        if($this->payload->preview){
        	return ($rawData['value'] == "1") ? 1 : 0;
        }

        $width = ($this->payload->width !== null) ? str_replace('px', '', $this->payload->width) : 36;

        return $this->addBeforeAndAfter('<span class="acpt-toggle-placeholder" style="font-size: '.$width.'px;">'.$this->renderIcon($rawData['value']).'</span>');
    }

	/**
	 * @param $value
	 *
	 * @return string
	 */
    private function renderIcon($value)
    {
	    if($value === "1") {
		    return '<span class="iconify" data-icon="bx:bx-check-circle" style="color: #02c39a;"></span>';
	    }

	    return '<span class="iconify" data-icon="bx:bx-x-circle" style="color: #f94144;"></span>';
    }
}