<?php

/**
 * @see https://github.com/symfony/polyfill-uuid/blob/1.x/Uuid.php
 */

namespace ACPT_Lite\Core\Helper;

use ACPT_Lite\Utils\PHP\Arrays;

class UuidGenerator
{
    public const UUID_VARIANT_NCS = 0;
    public const UUID_VARIANT_DCE = 1;
    public const UUID_VARIANT_MICROSOFT = 2;
    public const UUID_VARIANT_OTHER = 3;
    public const UUID_TYPE_DEFAULT = 0;
    public const UUID_TYPE_TIME = 1;
    public const UUID_TYPE_MD5 = 3;
    public const UUID_TYPE_DCE = 4; // Deprecated alias
    public const UUID_TYPE_NAME = 1; // Deprecated alias
    public const UUID_TYPE_RANDOM = 4;
    public const UUID_TYPE_SHA1 = 5;
    public const UUID_TYPE_NULL = -1;
    public const UUID_TYPE_INVALID = -42;

    // https://tools.ietf.org/html/rfc4122#section-4.1.4
    // 0x01b21dd213814000 is the number of 100-ns intervals between the
    // UUID epoch 1582-10-15 00:00:00 and the Unix epoch 1970-01-01 00:00:00.
    public const TIME_OFFSET_INT = 0x01B21DD213814000;
    public const TIME_OFFSET_BIN = "\x01\xb2\x1d\xd2\x13\x81\x40\x00";
    public const TIME_OFFSET_COM = "\xfe\x4d\xe2\x2d\xec\x7e\xc0\x00";

    /**
     * @param int $uuid_type
     * @return string|null
     */
    public static function uuid_create(int $uuid_type = self::UUID_TYPE_DEFAULT): ?string
    {
        switch ((int) $uuid_type) {
            case self::UUID_TYPE_NAME:
            case self::UUID_TYPE_TIME:
                return self::uuid_generate_time();
            case self::UUID_TYPE_DCE:
            case self::UUID_TYPE_RANDOM:
            case self::UUID_TYPE_DEFAULT:
                return self::uuid_generate_random();
            default:
                trigger_error(sprintf("Unknown/invalid UUID type '%d' requested, using default type instead", $uuid_type), \E_USER_WARNING);

                return self::uuid_generate_random();
        }
    }

    /**
     * @param mixed $uuid_ns
     * @param mixed $name
     * @return string|false|null
     */
    public static function uuid_generate_md5($uuid_ns, $name)
    {
        if (!\is_string($uuid_ns = self::toString($uuid_ns))) {
            trigger_error(sprintf('uuid_generate_md5() expects parameter 1 to be string, %s given', \gettype($uuid_ns)), \E_USER_WARNING);

            return null;
        }

        if (!\is_string($name = self::toString($name))) {
            trigger_error(sprintf('uuid_generate_md5() expects parameter 2 to be string, %s given', \gettype($name)), \E_USER_WARNING);

            return null;
        }

        if (!self::isValid($uuid_ns)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_generate_md5(): Argument #1 ($uuid_ns) UUID expected');
        }

        $hash = md5(hex2bin(str_replace('-', '', $uuid_ns)).$name);

        return sprintf(
            '%08s-%04s-3%03s-%04x-%012s',
            // 32 bits for "time_low"
            substr($hash, 0, 8),
            // 16 bits for "time_mid"
            substr($hash, 8, 4),
            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 3
            substr($hash, 13, 3),
            // 16 bits:
            // * 8 bits for "clk_seq_hi_res",
            // * 8 bits for "clk_seq_low",
            hexdec((string) substr($hash, 16, 4)) & 0x3FFF | 0x8000,
            // 48 bits for "node"
            substr($hash, 20, 12)
        );
    }

    /**
     * @param mixed $uuid_ns
     * @param mixed $name
     * @return string|false|null
     */
    public static function uuid_generate_sha1($uuid_ns, $name)
    {
        if (!\is_string($uuid_ns = self::toString($uuid_ns))) {
            trigger_error(sprintf('uuid_generate_sha1() expects parameter 1 to be string, %s given', \gettype($uuid_ns)), \E_USER_WARNING);

            return null;
        }

        if (!\is_string($name = self::toString($name))) {
            trigger_error(sprintf('uuid_generate_sha1() expects parameter 2 to be string, %s given', \gettype($name)), \E_USER_WARNING);

            return null;
        }

        if (!self::isValid($uuid_ns)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_generate_sha1(): Argument #1 ($uuid_ns) UUID expected');
        }

        $hash = sha1(hex2bin(str_replace('-', '', $uuid_ns)).$name);

        return sprintf(
            '%08s-%04s-5%03s-%04x-%012s',
            // 32 bits for "time_low"
            substr($hash, 0, 8),
            // 16 bits for "time_mid"
            substr($hash, 8, 4),
            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 5
            substr($hash, 13, 3),
            // 16 bits:
            // * 8 bits for "clk_seq_hi_res",
            // * 8 bits for "clk_seq_low",
            // WARNING: On old libuuid version, there is a bug. 0x0fff is used instead of 0x3fff
            // See https://github.com/karelzak/util-linux/commit/d6ddf07d31dfdc894eb8e7e6842aa856342c526e
            hexdec((string) substr($hash, 16, 4)) & 0x3FFF | 0x8000,
            // 48 bits for "node"
            substr($hash, 20, 12)
        );
    }

    /**
     * @param mixed $uuid
     * @return bool|null
     */
    public static function uuid_is_valid($uuid): ?bool
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_is_valid() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        return self::isValid($uuid);
    }

    /**
     * @param mixed $uuid1
     * @param mixed $uuid2
     * @return int|false|null
     */
    public static function uuid_compare($uuid1, $uuid2)
    {
        if (!\is_string($uuid1 = self::toString($uuid1))) {
            trigger_error(sprintf('uuid_compare() expects parameter 1 to be string, %s given', \gettype($uuid1)), \E_USER_WARNING);

            return null;
        }

        if (!\is_string($uuid2 = self::toString($uuid2))) {
            trigger_error(sprintf('uuid_compare() expects parameter 2 to be string, %s given', \gettype($uuid2)), \E_USER_WARNING);

            return null;
        }

        if (!self::isValid($uuid1)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_compare(): Argument #1 ($uuid1) UUID expected');
        }

        if (!self::isValid($uuid2)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_compare(): Argument #2 ($uuid2) UUID expected');
        }

        return strcasecmp($uuid1, $uuid2);
    }

    /**
     * @param mixed $uuid
     * @return bool|null
     */
    public static function uuid_is_null($uuid): ?bool
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_is_null() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }
        if (80000 <= \PHP_VERSION_ID && !self::isValid($uuid)) {
            throw new \InvalidArgumentException('uuid_is_null(): Argument #1 ($uuid) UUID expected');
        }

        return '00000000-0000-0000-0000-000000000000' === $uuid;
    }

    /**
     * @param mixed $uuid
     * @return int|false|null
     */
    public static function uuid_type($uuid)
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_type() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        if ('00000000-0000-0000-0000-000000000000' === $uuid) {
            return self::UUID_TYPE_NULL;
        }

        if (null === $parsed = self::parse($uuid)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_type(): Argument #1 ($uuid) UUID expected');
        }

        return $parsed['version'];
    }

    /**
     * @param mixed $uuid
     * @return int|false|null
     */
    public static function uuid_variant($uuid)
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_variant() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        if ('00000000-0000-0000-0000-000000000000' === $uuid) {
            return self::UUID_TYPE_NULL;
        }

        if (null === $parsed = self::parse($uuid)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_variant(): Argument #1 ($uuid) UUID expected');
        }

        if (($parsed['clock_seq'] & 0x8000) === 0) {
            return self::UUID_VARIANT_NCS;
        }
        if (($parsed['clock_seq'] & 0x4000) === 0) {
            return self::UUID_VARIANT_DCE;
        }
        if (($parsed['clock_seq'] & 0x2000) === 0) {
            return self::UUID_VARIANT_MICROSOFT;
        }

        return self::UUID_VARIANT_OTHER;
    }

    /**
     * @param mixed $uuid
     * @return int|false|null
     */
    public static function uuid_time($uuid)
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_time() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        $parsed = self::parse($uuid);

        if (self::UUID_TYPE_TIME !== ($parsed['version'] ?? null)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_time(): Argument #1 ($uuid) UUID DCE TIME expected');
        }

        if (\PHP_INT_SIZE >= 8) {
            return intdiv((int) (hexdec($parsed['time']) - self::TIME_OFFSET_INT), 10000000);
        }

        $time = str_pad((string) hex2bin($parsed['time']), 8, "\0", \STR_PAD_LEFT);
        $time = self::binaryAdd($time, self::TIME_OFFSET_BIN);
        $time[0] = $time[0] & "\x7F";

        return (int) substr(self::toDecimal($time), 0, -7);
    }

    /**
     * @param mixed $uuid
     * @return string|false|null
     */
    public static function uuid_mac($uuid)
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_mac() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        $parsed = self::parse($uuid);

        if (self::UUID_TYPE_TIME !== ($parsed['version'] ?? null)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_mac(): Argument #1 ($uuid) UUID DCE TIME expected');
        }

        return strtr($parsed['node'], 'ABCDEF', 'abcdef');
    }

    /**
     * @param mixed $uuid
     * @return string|false|null
     */
    public static function uuid_parse($uuid)
    {
        if (!\is_string($uuid = self::toString($uuid))) {
            trigger_error(sprintf('uuid_parse() expects parameter 1 to be string, %s given', \gettype($uuid)), \E_USER_WARNING);

            return null;
        }

        if (!self::isValid($uuid)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_parse(): Argument #1 ($uuid) UUID expected');
        }

        return hex2bin(str_replace('-', '', $uuid));
    }

    /**
     * @param mixed $bytes
     * @return string|false|null
     */
    public static function uuid_unparse($bytes)
    {
        if (!\is_string($bytes = self::toString($bytes))) {
            trigger_error(sprintf('uuid_unparse() expects parameter 1 to be string, %s given', \gettype($bytes)), \E_USER_WARNING);

            return null;
        }

        if (16 !== \strlen($bytes)) {
            if (80000 > \PHP_VERSION_ID) {
                return false;
            }

            throw new \InvalidArgumentException('uuid_unparse(): Argument #1 ($uuid) UUID expected');
        }

        $uuid = bin2hex($bytes);
        $uuid = substr_replace($uuid, '-', 8, 0);
        $uuid = substr_replace($uuid, '-', 13, 0);
        $uuid = substr_replace($uuid, '-', 18, 0);

        return substr_replace($uuid, '-', 23, 0);
    }

    private static function uuid_generate_random(): string
    {
        $uuid = bin2hex(random_bytes(16));

        return sprintf(
            '%08s-%04s-4%03s-%04x-%012s',
            // 32 bits for "time_low"
            substr($uuid, 0, 8),
            // 16 bits for "time_mid"
            substr($uuid, 8, 4),
            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            substr($uuid, 13, 3),
            // 16 bits:
            // * 8 bits for "clk_seq_hi_res",
            // * 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            hexdec(substr($uuid, 16, 4)) & 0x3FFF | 0x8000,
            // 48 bits for "node"
            substr($uuid, 20, 12)
        );
    }

    /**
     * @see http://tools.ietf.org/html/rfc4122#section-4.2.2
     */
    private static function uuid_generate_time(): string
    {
        $time = microtime(false);
        $time = substr($time, 11).substr($time, 2, 7);

        if (\PHP_INT_SIZE >= 8) {
            $time = str_pad(dechex((int) $time + self::TIME_OFFSET_INT), 16, '0', \STR_PAD_LEFT);
        } else {
            $time = str_pad(self::toBinary($time), 8, "\0", \STR_PAD_LEFT);
            $time = self::binaryAdd($time, self::TIME_OFFSET_BIN);
            $time = bin2hex($time);
        }

        // https://tools.ietf.org/html/rfc4122#section-4.1.5
        // We are using a random data for the sake of simplicity: since we are
        // not able to get a super precise timeOfDay as a unique sequence
        $clockSeq = random_int(0, 0x3FFF);

        static $node;
        if (null === $node) {
            if (\function_exists('apcu_fetch')) {
                $node = apcu_fetch('__symfony_uuid_node');
                if (false === $node) {
                    $node = sprintf(
                        '%06x%06x',
                        random_int(0, 0xFFFFFF) | 0x010000,
                        random_int(0, 0xFFFFFF)
                    );
                    apcu_store('__symfony_uuid_node', $node);
                }
            } else {
                $node = sprintf(
                    '%06x%06x',
                    random_int(0, 0xFFFFFF) | 0x010000,
                    random_int(0, 0xFFFFFF)
                );
            }
        }

        return sprintf(
            '%08s-%04s-1%03s-%04x-%012s',
            // 32 bits for "time_low"
            substr($time, -8),

            // 16 bits for "time_mid"
            substr($time, -12, 4),

            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 1
            substr($time, -15, 3),

            // 16 bits:
            // * 8 bits for "clk_seq_hi_res",
            // * 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            $clockSeq | 0x8000,

            // 48 bits for "node"
            $node
        );
    }

    private static function isValid(string $uuid): bool
    {
        return (bool) preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $uuid);
    }

    /**
     * @return array{time: string, version: int, clock_seq: int, node: string}|null
     */
    private static function parse(string $uuid): ?array
    {
        if (!preg_match('{^(?<time_low>[0-9a-f]{8})-(?<time_mid>[0-9a-f]{4})-(?<version>[0-9a-f])(?<time_hi>[0-9a-f]{3})-(?<clock_seq>[0-9a-f]{4})-(?<node>[0-9a-f]{12})$}Di', $uuid, $matches)) {
            return null;
        }

        return [
                'time' => '0'.$matches['time_hi'].$matches['time_mid'].$matches['time_low'],
                'version' => (int) hexdec($matches['version']),
                'clock_seq' => (int) hexdec($matches['clock_seq']),
                'node' => $matches['node'],
        ];
    }

    /**
     * @param mixed $v
     * @return mixed
     */
    private static function toString($v)
    {
        if (\is_string($v) || null === $v || (\is_object($v) ? method_exists($v, '__toString') : \is_scalar($v))) {
            return (string) $v;
        }

        return $v;
    }

    /**
     * Converts a decimal digit string to a binary string.
     * Note: $digits is reused internally as an array during computation.
     *
     * @param string $digits Decimal digit string
     */
    private static function toBinary($digits): string
    {
        $bytes = '';
        $count = \strlen($digits);

        while ($count) {
            $quotient = [];
            $remainder = 0;

            for ($i = 0; $i !== $count; ++$i) {
                $carry = (int) ($digits[$i] ?? 0) + $remainder * 10;
                $digit = $carry >> 8;
                $remainder = $carry & 0xFF;

                if ($digit || $quotient) {
                    $quotient[] = $digit;
                }
            }

            $bytes = \chr($remainder).$bytes;
            $count = Arrays::count($digits = $quotient);
        }

        return $bytes;
    }

    private static function toDecimal(string $bytes): string
    {
        $digits = '';
        $bytes = array_values(unpack('C*', $bytes) ?: []);

        while ($count = Arrays::count($bytes)) {
            $quotient = [];
            $remainder = 0;

            for ($i = 0; $i !== $count; ++$i) {
                $carry = $bytes[$i] + ($remainder << 8);
                $digit = (int) ($carry / 10);
                $remainder = $carry % 10;

                if ($digit || $quotient) {
                    $quotient[] = $digit;
                }
            }

            $digits = $remainder.$digits;
            $bytes = $quotient;
        }

        return $digits;
    }

    /**
     * Performs a binary addition of two 8-character strings, treating each character as an 8-bit value.
     *
     * @param string $a The first 8-character binary string.
     * @param string $b The second 8-character binary string.
     * @return string The resulting 8-character binary string after addition.
     */
    private static function binaryAdd(string $a, string $b): string
    {
        $sum = 0;
        for ($i = 7; 0 <= $i; --$i) {
            $sum += \ord($a[$i]) + \ord($b[$i]);
            $a[$i] = \chr($sum & 0xFF);
            $sum >>= 8;
        }

        return $a;
    }
}
