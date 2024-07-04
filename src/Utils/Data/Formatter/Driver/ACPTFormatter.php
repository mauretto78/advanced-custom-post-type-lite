<?php

namespace ACPT_Lite\Utils\Data\Formatter\Driver;

use ACPT_Lite\Utils\Data\Formatter\FormatterInterface;

class ACPTFormatter implements FormatterInterface
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
	 */
	public static function toArray( string $string ): array
	{
		if($string[0] === "\""){
			$string = self::prepareString($string);
		}

		return json_decode($string, true);
	}

	/**
	 * @param string $string
	 *
	 * @return string
	 */
	private static function prepareString(string $string): string
	{
		$string = str_replace('\\n',"",$string);
		$string = stripslashes_deep($string);
		$string = trim($string, '"');

		return $string;
	}
}
