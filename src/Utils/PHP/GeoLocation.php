<?php

namespace ACPT_Lite\Utils\PHP;

use AnthonyMartin\GeoLocation\GeoPoint;

class GeoLocation
{
    /**
     * @param string $address
     *
     * @return null|array
     * @throws \Exception
     */
    public static function getCoordinates($address)
    {
        try {
	        $apiKey = Maps::googleMapsKey();

	        // try with Google maps
	        if($apiKey){
		        $url = 'https://maps.googleapis.com/maps/api/geocode/json?address='.urlencode($address).'&key='.$apiKey;
		        $request = CURL::get($url);
		        $json = json_decode($request);

		        if(!isset($json->error_message)){
			        $data['lat'] = $json->results[0]->geometry->location->lat;
			        $data['lng'] = $json->results[0]->geometry->location->lng;

			        return $data;
		        }
	        }

	        $url = 'https://nominatim.openstreetmap.org/search?q='.urlencode($address).'&format=json';
	        $request = CURL::get($url);
	        $json = json_decode($request);

	        if(empty($json)){
		        return [
			        'lat' => null,
			        'lng' => null,
		        ];
	        }

	        $data['lat'] = $json[0]->lat;
	        $data['lng'] = $json[0]->lon;

	        return $data;
        } catch (\Exception $exception){
	        return [
	        	'lat' => null,
	        	'lng' => null,
	        ];
        }
    }

	/**
	 * @param $lat
	 * @param $lng
	 *
	 * @return string|null
	 */
	public static function getCity($lat, $lng)
	{
		try {
			$url = 'https://nominatim.openstreetmap.org/reverse?lat='.$lat.'&lon='.$lng.'&format=json';
			$request = CURL::get($url);
			$json = json_decode($request);

			if(empty($json)){
				return null;
			}

			if(!isset($json->address)){
				return null;
			}

			$address = $json->address;

			if(isset($address->city)){
				return $address->city;
			}

			if(isset($address->town)){
				return $address->town;
			}

			return $address->county;

		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * @param $lat
	 * @param $lng
	 * @param $zoom
	 *
	 * @return array
	 */
    public static function boundingBox($lat, $lng, $zoom)
    {
    	try {
		    $geoPoint = new GeoPoint($lat, $lng);
		    $distance = self::zoomDistance($zoom);
		    $boundingBox = $geoPoint->boundingBox($distance, 'km');

		    return [
			    'maxLat' => $boundingBox->getMaxLatitude(),
			    'maxLong' => $boundingBox->getMaxLongitude(),
			    'minLat' => $boundingBox->getMinLatitude(),
			    'minLong' => $boundingBox->getMinLongitude(),
		    ];
	    } catch (\Exception $exception){
		    return [
			    'maxLat' => null,
			    'maxLong' => null,
			    'minLat' => null,
			    'minLong' => null,
		    ];
	    }
    }

	/**
	 * @param $zoom
	 *
	 * @return float|int
	 */
    private static function zoomDistance($zoom)
    {
	    if($zoom > 19){
		    return 0.01;
	    }

	    $distance = 6400;

	    for($i = 1; $i < $zoom; $i++){
		    $distance = $distance / 2;
	    }

	    return number_format((float)$distance, 2, '.', '');
    }
}