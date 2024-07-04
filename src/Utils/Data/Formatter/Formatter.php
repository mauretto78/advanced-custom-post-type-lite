<?php

namespace ACPT_Lite\Utils\Data\Formatter;

use ACPT_Lite\Constants\FormatterFormat;

class Formatter
{
	/**
	 * @param $format
	 * @param $data
	 *
	 * @return string
	 * @throws \Exception
	 */
	public static function format($format, $data)
	{
		if(!in_array($format, FormatterFormat::ALLOWED_FORMATS)){
			throw new \Exception($format . ' is not supported format');
		}

		$driver = self::getDriver($format);

		if($driver){
			return $driver->format($data);
		}

		return '';
	}

	/**
	 * @param string $format
	 * @param string $string
	 *
	 * @return array
	 * @throws \Exception
	 */
	public static function toArray($format, $string): array
	{
		if(!in_array($format, FormatterFormat::ALLOWED_FORMATS)){
			throw new \Exception($format . ' is not supported format');
		}

		$driver = self::getDriver($format);

		if($driver){
			return $driver->toArray($string);
		}

		return [];
	}

	/**
	 * @param $format
	 *
	 * @return FormatterInterface|null
	 */
	private static function getDriver($format): ?FormatterInterface
	{
		$driver = "ACPT\\Utils\\Data\\Formatter\\Driver\\".strtoupper($format)."Formatter";

		if(class_exists($driver)){
			return new $driver();
		}

		return null;
	}
}