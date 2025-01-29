<?php

namespace ACPT_Lite\Utils\Vite;

class Assets
{
	/**
	 * @param $src
	 * @param $key
	 *
	 * @return array
	 */
	public static function load($src, $key)
	{
		$resources = [
			'js' => [],
			'css' => [],
		];

		// add type="module"
		add_filter('script_loader_tag', function ($tag, $handle, $src) use ($key){
			$key = ACPT_LITE_PLUGIN_NAME.'__'.$key;

			return ($key !== $handle) ? $tag : '<script type="module" src="' . esc_url( $src ) . '"></script>';
		} , 10, 3);

		$manifest = ACPT_LITE_PLUGIN_DIR_PATH."/assets/build/.vite/manifest.json";

		if(file_exists($manifest)){
			$json = json_decode(file_get_contents($manifest), true);

			foreach ($json as $entry){
				if( isset($entry['src']) and $entry['src'] === $src){
					$asset = $entry['file'];
					$styles = $entry['css'];

					$resources['js'][$key] = plugins_url( 'acpt-lite/assets/build/').$asset;

					foreach ($styles as $style){
						$resources['css'][$key] = plugins_url( 'acpt-lite/assets/build/').$style;
					}
				}
			}
		}

		return $resources;
	}
}