<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Utils\Settings\Settings;

class Maps
{
	/**
	 * @return string|null
	 */
	public static function googleMapsKey()
	{
		try {
			return Settings::get(SettingsModel::GOOGLE_MAPS_API_KEY);
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
		// Google Maps
		if(self::googleMapsKey()){
			return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://maps.google.com/maps?q='.$address.'&z='.$zoom.'&ie=UTF8&output=embed" frameborder="0" allowfullscreen></iframe>';
		}

		// OSM
		if($lat !== null and $lng !== null){
			$bbox = GeoLocation::boundingBox($lat, $lng, $zoom);
			$bboxString = $bbox['minLong'].','.$bbox['minLat'].','.$bbox['maxLong'].','.$bbox['maxLat'];
			$pointerString = $lat.','.$lng;

			return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://www.openstreetmap.org/export/embed.html?bbox='.$bboxString.'&amp;layer=mapnik&amp;marker='.$pointerString.'" style="border: 1px solid black"></iframe>';
		}

		// fallback on Google Maps
		return '<iframe class="maps" width="'.esc_attr($width).'" height="'.esc_attr($height).'" src="https://maps.google.com/maps?q='.$address.'&z='.$zoom.'&ie=UTF8&output=embed" frameborder="0" allowfullscreen></iframe>';
	}

	/**
	 * @param $width
	 * @param $height
	 * @param $zoom
	 * @param array $data
	 * @param bool $preview
	 *
	 * @return string
	 */
	public static function renderMulti($width, $height, $zoom, $data = [], $preview = false)
	{
		if(empty($data)){
			return null;
		}

		// render the map
		try {
			$id = Strings::generateRandomId();
			self::enqueueAssets($id, $zoom, $data);

			$style = '';
			$style .= 'background: #f4f4f4;';
			$style .= 'width: '.$width . (is_numeric($width) ? 'px' : '') .';';
			$style .= 'height: '.$height. (is_numeric($height) ? 'px' : '') .';';
			$style .= 'display: flex;';
			$style .= 'justify-content: center;';
			$style .= 'align-items: center;';

			return '<div id="'.$id.'" style="'.$style.'">Preview not avaiable</div>';
		} catch (\Exception $exception){
			return null;
		}
	}

	/**
	 * @param $id
	 * @param $zoom
	 * @param array $data
	 */
	private static function enqueueAssets($id, $zoom, $data = [])
	{
		if(!empty(Maps::googleMapsKey())){

			// use Google Maps
			wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key='.Maps::googleMapsKey().'&libraries=places&callback=initMultiPointMap', false, '3', true);
			wp_enqueue_script('google-maps');

			wp_register_script( 'google-maps-multi-point-run', '', [], '', true );
			wp_enqueue_script('google-maps-multi-point-run');
			wp_add_inline_script( 'google-maps-multi-point-run', self::generateGoogleMapsCode($id, $zoom, $data));

		} else {
			// use Leaflet
			wp_enqueue_script( 'leaflet-js', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/leaflet.min.js'), [], '1.9.4', true);
			wp_enqueue_script( 'leaflet-geosearch-js', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/geosearch.bundle.min.js'), [], '4.0.0', true);
			wp_enqueue_style( 'leaflet-css', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/leaflet.min.css'), [], '1.9.4', 'all');

			wp_register_script( 'leaflet-multi-point-run', '', [], '', true );
			wp_enqueue_script('leaflet-multi-point-run');
			wp_add_inline_script( 'leaflet-multi-point-run', self::generateOSMCode($id, $zoom, $data));
		}
	}

	/**
	 * @param $id
	 * @param $zoom
	 * @param array $data
	 *
	 * @return string
	 */
	private static function generateGoogleMapsCode($id, $zoom, $data = [])
	{
		if(empty($data)){
			return null;
		}

		$code = '
			if(typeof initMultiPointMap === "undefined"){
					function initMultiPointMap(){
						
						var map = new google.maps.Map(document.getElementById("'.$id.'"), {
					      zoom: '.$zoom.',
					      center: {
					        lat: '.$data[0]['lat'].',
					        lng: '.$data[0]['lng'].'
					      }
					    });';

		foreach ($data as $index => $datum){

			$code .= '
				var infowindow = new google.maps.InfoWindow({
                    content: "<div style=\'color: black;\'>'.$datum['address'].'</div>"
                });
			';

			$code .= '
				var marker'.$index.' = new google.maps.Marker({
			      position: {
			        lat: '.$datum['lat'].',
			        lng: '.$datum['lng'].'
			      },
			      map: map
			    });
			    
			    marker'.$index.'.addListener("click", function() {
		          infowindow.open(map, marker'.$index.');
		        });
			';
		}

		$code .='}
			}
		';

		return $code;
	}

	/**
	 * @param $id
	 * @param $zoom
	 * @param array $data
	 *
	 * @return string
	 */
	private static function generateOSMCode($id, $zoom, $data = [])
	{
		$code = '
			if(typeof initMultiPointMap === "undefined"){
				function initMultiPointMap(){
					const map = L.map("'.$id.'").setView(['.$data[0]['lat'].', '.$data[0]['lng'].'], '.$zoom.');
                    L.tileLayer(\'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\').addTo(map);';

		foreach ($data as $index => $datum){
			$code .= '
				var marker'.$index.' = L.marker(['.$datum['lat'].', '.$datum['lng'].']).addTo(map);
				marker'.$index.'.bindPopup("'.$datum['address'].'").openPopup();
			';
		}

		$code .= '}';
		$code .= 'initMultiPointMap();
			}
		';

		return $code;
	}
}