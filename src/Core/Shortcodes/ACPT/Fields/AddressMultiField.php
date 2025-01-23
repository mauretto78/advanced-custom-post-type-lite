<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\Fields;

use ACPT_Lite\Utils\PHP\Address;
use ACPT_Lite\Utils\PHP\Maps;

class AddressMultiField extends AbstractField
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
        $city = $rawData['city'] ?? null;

        if($this->payload->preview){
        	return $this->addBeforeAndAfter(Address::toHumanReadable($address));
        }

        if($this->payload->list){

        	$addresses = Address::fetchMulti($address);

        	if(!is_array($addresses)){
        		return null;
	        }

	        return $this->renderList($addresses);
        }

        $data = [];

        $addresses = Address::fetchMulti($address);
        $latitudes = Address::fetchMulti($lat);
        $longitudes = Address::fetchMulti($lng);
        $cities = Address::fetchMulti($city);

	    foreach ($addresses as $index => $addr){
		    $values[] = [
			    'address' => $this->addBeforeAndAfter($addr),
			    'city' => $cities[$index] ?? null,
			    'lat'  => $latitudes[$index] ?? null,
			    'lng'  => $longitudes[$index] ?? null,
		    ];
	    }

        return $this->addBeforeAndAfter(Maps::renderMulti($width, $height, $z, $data));
    }
}
