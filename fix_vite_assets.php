<?php

ini_set('max_execution_time', 600);
ini_set('memory_limit','1024M');

/**
 * @throws Exception
 */
function fixViteAssets()
{
	$manifest = __DIR__ .'/assets/build/.vite/manifest.json';

	if(!file_exists($manifest)){
		throw new \Exception("Manifest.json not found");
	}

	$json = json_decode( file_get_contents( $manifest ), true );

	if(!isset($json['assets/src/App/index.jsx'])){
		throw new \Exception("App/index.jsx not found");
	}

	$root = __DIR__ .'/assets/build/'. $json['assets/src/App/index.jsx']['file'];

	if(!file_exists($root)){
		throw new \Exception("Build root file not found");
	}

	$str = file_get_contents($root);
	$str = str_replace('"/wp-content/plugins/advanced-custom-post-type-lite/assets/build/"', ' document.globals.site_url+"/wp-content/plugins/advanced-custom-post-type-lite/assets/build/"', $str);

	if(!file_put_contents($root, $str)){
		throw new \Exception("Build root file is not writable");
	}
}

try {
	fixViteAssets();
} catch (\Exception $exception){
	// do nothing
}
