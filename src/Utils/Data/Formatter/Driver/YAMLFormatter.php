<?php

namespace ACPT_Lite\Utils\Data\Formatter\Driver;

use ACPT_Lite\Utils\Data\Formatter\FormatterInterface;
use Symfony\Component\Yaml\Yaml;

class YAMLFormatter implements FormatterInterface
{
	/**
	 * @param array $data
	 *
	 * @return string
	 */
	public static function format(array $data = []): string
	{
		return Yaml::dump($data);
	}

	/**
	 * @inheritDoc
	 */
	public static function toArray( string $string ): array
	{
		return Yaml::parse($string);
	}
}



