<?php

namespace ACPT_Lite\Utils\PHP;

class Server
{
	/**
	 * Check if the server is running on a secure protocol
	 *
	 * @return bool
	 */
	public static function isSecure()
	{
		if (
			( ! empty($_SERVER['HTTPS']) and $_SERVER['HTTPS'] !== 'off')
			or ( ! empty($_SERVER['HTTP_X_FORWARDED_PROTO']) and $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
			or ( ! empty($_SERVER['HTTP_X_FORWARDED_SSL']) and $_SERVER['HTTP_X_FORWARDED_SSL'] == 'on')
			or (isset($_SERVER['SERVER_PORT']) and $_SERVER['SERVER_PORT'] == 443)
			or (isset($_SERVER['HTTP_X_FORWARDED_PORT']) and $_SERVER['HTTP_X_FORWARDED_PORT'] == 443)
			or (isset($_SERVER['REQUEST_SCHEME']) and $_SERVER['REQUEST_SCHEME'] == 'https')
		) {
			return true;
		}

		return false;
	}
}
