<?php

namespace ACPT_Lite\Utils\Data\Formatter;

interface FormatterInterface
{
	/**
	 * @param array $data
	 *
	 * @return string
	 */
	public static function format(array $data = []): string;

	/**
	 * @param string $string
	 *
	 * @return array
	 */
	public static function toArray(string $string): array;
}