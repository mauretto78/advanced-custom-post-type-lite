<?php

namespace ACPT_Lite\Utils\PHP;

class Phone
{
	/**
	 * @param $number
	 *
	 * @return string
	 */
	public static function url($number)
	{
		$number = strip_tags($number);
		$number = str_replace([" ", "-", "(", ")", "#"], "", $number);

		return trim($number);
	}
}