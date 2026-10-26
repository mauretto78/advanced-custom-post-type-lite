<?php

namespace ACPT_Lite\Utils\PHP;

class Session
{
    /**
     * Close a session
     * @return void
     */
    public static function close()
    {
        session_write_close();
    }

    /**
     * Start a session
     * @return void
     */
    public static function start()
    {
        if (session_status() === PHP_SESSION_NONE) {
            $sessionId = $_COOKIE[session_name()] ?? null;

            if ($sessionId && !preg_match('/^[a-zA-Z0-9,-]{22,250}$/', $sessionId)) {
                // the session ID in the header is invalid, create a new one
                session_id(session_create_id());
            }

            session_start();
        }
    }

    /**
     * @param bool $destroy
     * @param int|null $lifetime
     * @return bool
     */
    public function regenerate(bool $destroy = false, ?int $lifetime = null): bool
    {
        // Cannot regenerate the session ID for non-active sessions.
        if (\PHP_SESSION_ACTIVE !== session_status()) {
            return false;
        }

        if (headers_sent()) {
            return false;
        }

        if (null !== $lifetime && $lifetime != \ini_get('session.cookie_lifetime')) {
            ini_set('session.cookie_lifetime', $lifetime);
            $this->start();
        }

        return session_regenerate_id($destroy);
    }

    /**
     * @param string $key
     *
     * @return bool
     */
    public static function has($key)
    {
        return isset($_SESSION[$key]);
    }

    /**
     * @param string $key
     *
     * @return mixed|null
     */
    public static function get($key)
    {
        if (!self::has($key)) {
            return null;
        }

        if (is_scalar($_SESSION[$key])) {
            $decoded = json_decode($_SESSION[$key], true);

            return $decoded !== null ? $decoded : $_SESSION[$key];
        }

        return $_SESSION[$key];
    }

    /**
     * Removes a specific item from a session array.
     *
     * @param string $key The session key associated with the array.
     * @param mixed $id The identifier of the item to unset within the array.
     * @return void
     */
    public static function unsetItemFromArray($key, $id): void
    {
        $get = Session::get($key);

        if (!is_array($get)) {
            return;
        }

        if (empty($get)) {
            return;
        }

        if (!isset($get[$id])) {
            return;
        }

        unset($get[$id]);
        Session::set($key, $get);
    }

    /**
     * @param string $key
     * @return void
     */
    public static function flush($key)
    {
        unset($_SESSION[$key]);
    }

    /**
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set($key, $value)
    {
        $_SESSION[$key] = json_encode($value);
    }
}
