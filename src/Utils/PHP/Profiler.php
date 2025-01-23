<?php

namespace ACPT_Lite\Utils\PHP;

/**
 * @see https://querymonitor.com/wordpress-debugging/profiling-and-logging/
 */
class Profiler
{
	const START_ACTION = 'qm/start';
	const LAP_ACTION = 'qm/lap';
	const STOP_ACTION = 'qm/stop';

	const LOG_DEBUG = 'qm/debug';
	const LOG_INFO = 'qm/info';
	const LOG_NOTICE = 'qm/notice';
	const LOG_WARNING = 'qm/warning';
	const LOG_ERROR = 'qm/error';
	const LOG_CRITICAL = 'qm/critical';
	const LOG_ALERT = 'qm/alert';
	const LOG_EMERGENCY = 'qm/emergency';

	/**
	 * Start the '$name' timer
	 *
	 * @param $name
	 */
	public static function start($name)
	{
		if(ACPT_DEV_MODE){
			do_action( self::START_ACTION, $name );
		}
	}

	/**
	 * Call it when iterate over some data
	 *
	 * @param $name
	 */
	public static function lap($name)
	{
		if(ACPT_DEV_MODE){
			do_action( self::LAP_ACTION, $name );
		}
	}

	/**
	 * Start the '$name' timer
	 *
	 * @param $name
	 */
	public static function stop($name)
	{
		if(ACPT_DEV_MODE){
			do_action( self::STOP_ACTION, $name );
		}
	}

	/**
	 * Log a message
	 *
	 * @param $level
	 * @param $message
	 */
	public static function log($level, $message)
	{
		$levels = [
			self::LOG_DEBUG,
			self::LOG_INFO,
			self::LOG_NOTICE,
			self::LOG_WARNING,
			self::LOG_ERROR,
			self::LOG_CRITICAL,
			self::LOG_ALERT,
			self::LOG_EMERGENCY,
		];

		if(ACPT_DEV_MODE and in_array($level, $levels)){
			do_action( $level, $message );
		}
	}
}