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
		if($number === null){
			return null;
		}

		if(!is_string($number)){
			return null;
		}

		$number = strip_tags($number);
		$number = str_replace([" ", "-", "(", ")", "#"], "", $number);
        $number = trim($number);

		// Fix for French numbers
        $number = str_replace("+330", "+33", $number);

		return $number;
	}
}