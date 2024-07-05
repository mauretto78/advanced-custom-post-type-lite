<?php

namespace ACPT_Lite\Utils\Wordpress;

class Transient
{
	/**
	 * @param $key
	 *
	 * @return bool
	 */
	public static function delete($key)
	{
		return delete_transient($key);
	}

	/**
	 * @param $key
	 *
	 * @return bool
	 */
	public static function has($key)
	{
		return get_transient($key) !== false;
	}

	/**
	 * @param $key
	 *
	 * @return mixed
	 */
	public static function get($key)
	{
		return get_transient($key);
	}

	/**
	 * @param $key
	 * @param $value
	 * @param $ttl
	 */
	public static function set($key, $value, $ttl)
	{
		set_transient($key, $value, $ttl);
	}
}