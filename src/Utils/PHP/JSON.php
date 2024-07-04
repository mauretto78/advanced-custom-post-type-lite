<?php

namespace ACPT_Lite\Utils\PHP;

class JSON
{
	/**
	 * @param array $object
	 *
	 * @return string
	 */
	public static function arrayToEscapedJson($object = [])
	{
		$json = json_encode($object);
		$json = str_replace('"', '&quot;', $json);

		return $json;
	}

	/**
	 * @param $json
	 *
	 * @return array
	 */
	public static function escapedJsonToArray($json): array
	{
		$array = str_replace('&quot;', '"', $json);
		$array = json_decode($array, true);

		return $array;
	}
}