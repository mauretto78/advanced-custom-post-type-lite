<?php

namespace ACPT_Lite\Utils\PHP;

class Date
{
	/**
	 * @param $format
	 *
	 * @return bool
	 */
	public static function isDateFormatValid($format): bool
	{
		try {
			$dateTime = new \DateTime();
			$check = \DateTime::createFromFormat($format, $dateTime->format($format));

			return $check !== false;
		} catch (\Exception $exception){
			return false;
		}
	}

	/**
	 * @param $format
	 * @param $value
	 *
	 * @return string|null
	 */
	public static function format($format, $value)
	{
		if(!is_string($value)){
			return null;
		}

		return date_i18n($format, strtotime($value));
	}
}