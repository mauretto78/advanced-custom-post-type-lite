<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\PHP\Maps;

class AddressField extends AbstractField
{
    public function render()
    {
        if(!$this->isFieldVisible()){
            return null;
        }

        $width = ($this->payload->width !== null) ? $this->payload->width : '100%';
        $height = ($this->payload->height !== null) ? $this->payload->height : 500;
        $z = 16;

	    $rawData = $this->fetchRawData();

	    if(!isset($rawData['value'])){
		    return null;
	    }

        $address = $rawData['value'];
        $lat = $rawData['lat'] ?? null;
        $lng = $rawData['lng'] ?? null;

        if($this->payload->preview){
        	return $this->addBeforeAndAfter($address);
        }

        return $this->addBeforeAndAfter(Maps::render($width, $height, $address, $z, $lat, $lng));
    }
}
