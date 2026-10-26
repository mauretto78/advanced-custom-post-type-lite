<?php

namespace ACPT_Lite\Utils\PHP;

/**
 * @see https://querymonitor.com/wordpress-debugging/profiling-and-logging/
 */
class Profiler
{
    public const START_ACTION = 'qm/start';
    public const LAP_ACTION = 'qm/lap';
    public const STOP_ACTION = 'qm/stop';

    public const LOG_DEBUG = 'qm/debug';
    public const LOG_INFO = 'qm/info';
    public const LOG_NOTICE = 'qm/notice';
    public const LOG_WARNING = 'qm/warning';
    public const LOG_ERROR = 'qm/error';
    public const LOG_CRITICAL = 'qm/critical';
    public const LOG_ALERT = 'qm/alert';
    public const LOG_EMERGENCY = 'qm/emergency';

    /**
     * Start the '$name' timer
     *
     * @param string $name
     * @return void
     */
    public static function start($name)
    {
        if (ACPT_LITE_DEV_MODE) {
            add_action('init', function () use ($name) {
                do_action(self::START_ACTION, $name);
            });
        }
    }

    /**
     * Call it when iterate over some data
     *
     * @param string $name
     * @return void
     */
    public static function lap($name)
    {
        if (ACPT_LITE_DEV_MODE) {
            add_action('init', function () use ($name) {
                do_action(self::LAP_ACTION, $name);
            });
        }
    }

    /**
     * Stop the '$name' timer
     *
     * @param string $name
     * @return void
     */
    public static function stop($name)
    {
        if (ACPT_LITE_DEV_MODE) {
            add_action('init', function () use ($name) {
                do_action(self::STOP_ACTION, $name);
            });
        }
    }

    /**
     * Log a message
     *
     * @param string $level
     * @param string $message
     * @return void
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

        if (ACPT_LITE_DEV_MODE && in_array($level, $levels)) {
            add_action('init', function () use ($level, $message) {
                do_action($level, $message);
            });
        }
    }
}
