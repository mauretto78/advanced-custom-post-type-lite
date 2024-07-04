<?php

namespace ACPT_Lite\Utils\Data\Formatter\Driver;

use ACPT_Lite\Utils\Data\Formatter\FormatterInterface;

class JSONFormatter implements FormatterInterface
{
	/**
	 * @param array $data
	 *
	 * @return string
	 */
	public static function format(array $data = []): string
	{
		return json_encode($data, JSON_PRETTY_PRINT);
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public static function toArray( string $string ): array
	{
		$array = json_decode($string, true);

		if(json_last_error() === JSON_ERROR_NONE){
			return $array;
		}

		throw new \Exception("Malformed JSON");
	}
}
