<?php

namespace ACPT_Lite\Utils\Data\Formatter\Driver;

use ACPT_Lite\Utils\Data\Formatter\FormatterInterface;

class CSVFormatter implements FormatterInterface
{
	/**
	 * @param array $data
	 *
	 * @return string
	 */
	public static function format( array $data = [] ): string
	{
		$f = fopen('php://memory', 'r+');

		foreach ($data as $item) {
			fputcsv($f, $item,);
		}
		rewind($f);

		return stream_get_contents($f);
	}

	/**
	 * @inheritDoc
	 */
	public static function toArray( string $string ): array
	{
		$lines = explode(PHP_EOL, $string);
		$array = [];

		foreach ($lines as $line) {
			$delimiter = self::detectDelimiter($line);
			$array[] = str_getcsv($line, $delimiter);
		}

		return $array;
	}

	/**
	 * @param $csvString
	 *
	 * @return false|int|string
	 */
	private static function detectDelimiter($csvString)
	{
		$delimiters = [";" => 0, "," => 0, "\t" => 0, "|" => 0];

		foreach ($delimiters as $delimiter => &$count) {
			$count = count(str_getcsv($csvString, $delimiter));
		}

		return array_search(max($delimiters), $delimiters);
	}
}