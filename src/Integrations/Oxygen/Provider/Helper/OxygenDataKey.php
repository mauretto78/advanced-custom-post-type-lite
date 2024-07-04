<?php

namespace ACPT_Lite\Integrations\Oxygen\Provider\Helper;

class OxygenDataKey
{
	const FIELD_DATA_SEPARATOR = '::';

	/**
	 * @param $belongsTo
	 * @param $find
	 * @param $boxName
	 * @param $fieldName
	 *
	 * @return string
	 */
	public static function encode($belongsTo, $find, $boxName, $fieldName)
	{
		return base64_encode($belongsTo . self::FIELD_DATA_SEPARATOR . $find . self::FIELD_DATA_SEPARATOR  . $boxName . self::FIELD_DATA_SEPARATOR . $fieldName);
	}

	/**
	 * @param $key
	 *
	 * @return array
	 */
	public static function decode($key)
	{
		$decoded = base64_decode($key);
		$data = explode(self::FIELD_DATA_SEPARATOR, $decoded);

		if(count($data) != 4){
			return [];
		}

		return [
			'belongs_to' => $data[0],
			'find' => $data[1],
			'box_name' => $data[2],
			'field_name' => $data[3],
		];
	}
}