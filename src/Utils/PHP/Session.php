<?php

namespace ACPT_Lite\Utils\PHP;

class Session
{
	/**
	 * Close a session
	 */
	public static function close()
	{
		session_write_close();
	}

	/**
	 * Start a session
	 */
	public static function start()
	{
		if (session_status() === PHP_SESSION_NONE) {
			session_start();
		}
	}

	/**
	 * @param $key
	 *
	 * @return bool
	 */
	public static function has($key)
	{
		return isset($_SESSION[$key]);
	}

	/**
	 * @param $key
	 *
	 * @return mixed|null
	 */
	public static function get($key)
	{
		if(!self::has($key)){
			return null;
		}

		return unserialize($_SESSION[$key]);
	}

	/**
	 * @param $key
	 */
	public static function flush($key)
	{
		unset($_SESSION[$key]);
	}

	/**
	 * @param $key
	 * @param $value
	 */
	public static function set($key, $value)
	{
		$_SESSION[$key] = serialize($value);
	}
}