<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;

class Maps
{
	/**
	 * @return string|null
	 */
	public static function googleMapsKey()
	{
		try {
			$googleMapsKey = SettingsRepository::getSingle(SettingsModel::GOOGLE_MAPS_API_KEY);

			return ($googleMapsKey !== null) ? $googleMapsKey->getValue() : null;
		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * Render a maps iframe
	 *
	 * @param $width
	 * @param $height
	 * @param $address
	 * @param $zoom
	 * @param $lat
	 * @param $lng
	 *
	 * @return string
	 */
	public static function render($width, $height, $address, $zoom, $lat = null, $lng = null)
	{
		if(self::googleMapsKey()){
			return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://maps.google.com/maps?q='.$address.'&z='.$zoom.'&ie=UTF8&output=embed" frameborder="0" allowfullscreen></iframe>';
		}

		if($lat !== null and $lng !== null){
			$bbox = GeoLocation::boundingBox($lat, $lng, $zoom);
			$bboxString = $bbox['minLong'].','.$bbox['minLat'].','.$bbox['maxLong'].','.$bbox['maxLat'];
			$pointerString = $lat.','.$lng;

			return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://www.openstreetmap.org/export/embed.html?bbox='.$bboxString.'&amp;layer=mapnik&amp;marker='.$pointerString.'" style="border: 1px solid black"></iframe>';
		}

		// fallback on Google Maps
		return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://maps.google.com/maps?q='.$address.'&z='.$zoom.'&ie=UTF8&output=embed" frameborder="0" allowfullscreen></iframe>';
	}
}