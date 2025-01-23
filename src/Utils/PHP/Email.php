<?php

namespace ACPT_Lite\Utils\PHP;

class Email
{
	/**
	 * @param $email
	 *
	 * @return string|null
	 */
	public static function sanitize($email)
	{
		if($email === null){
			return null;
		}

		if(!is_string($email)){
			return null;
		}

		return sanitize_email(strip_tags($email));
	}
}



