<?php

namespace ACPT_Lite\Utils;

class Nonce
{
	const ACPT_LITE_NONCE = 'acpt_lite_nonce';

	/**
	 * @param $nonce
	 *
	 * @return string
	 */
	public static function field($nonce = null)
	{
		if($nonce === null){
			$nonce = self::ACPT_LITE_NONCE;
		}

		return wp_nonce_field(self::generate(), $nonce, true, false);
	}

	/**
	 * @param $nonce
	 *
	 * @return bool|int
	 */
	public static function verify($nonce)
	{
		return wp_verify_nonce($nonce, self::generate());
	}

	/**
	 * @return string
	 */
	public static function generate()
	{
		return plugin_basename(__FILE__) . '/src/Utils/Wordpress/Nonce.php';
	}
}