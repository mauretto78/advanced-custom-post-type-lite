<?php

/**
 * @see https://github.com/symfony/uid/blob/7.3/Ulid.php
 */

namespace ACPT_Lite\Core\Helper;

class Ulid
{
    protected const NIL = '00000000000000000000000000';
    protected const MAX = '7ZZZZZZZZZZZZZZZZZZZZZZZZZ';

    /**
     * @var string
     */
    private static string $time = '';

    /**
     * @var array<int, int>
     */
    private static array $rand = [];

    /**
     * @param string $ulid
     *
     * @return bool
     */
    public static function isValid(string $ulid): bool
    {
        if (26 !== \strlen($ulid)) {
            return false;
        }

        if (26 !== strspn($ulid, '0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz')) {
            return false;
        }

        return $ulid[0] <= '7';
    }

    /**
     * @param \DateTimeInterface|null $time
     *
     * @return string
     * @throws \Exception
     */
    public static function generate(?\DateTimeInterface $time = null): string
    {
        if (null === $mtime = $time) {
            $time = microtime(false);
            $time = substr($time, 11).substr($time, 2, 3);
        } elseif (0 > $time = $time->format('Uv')) {
            throw new \InvalidArgumentException('The timestamp must be positive.');
        }

        if ($time > self::$time || (null !== $mtime && $time !== self::$time)) {
            randomize:
            /** @var array<int, int> $r */
            $r = unpack('n*', random_bytes(10));
            $r[1] |= ($r[5] <<= 4) & 0xF0000;
            $r[2] |= ($r[5] <<= 4) & 0xF0000;
            $r[3] |= ($r[5] <<= 4) & 0xF0000;
            $r[4] |= ($r[5] <<= 4) & 0xF0000;
            unset($r[5]);
            self::$rand = $r;
            self::$time = $time;
        } elseif ([1 => 0xFFFFF, 0xFFFFF, 0xFFFFF, 0xFFFFF] === self::$rand) {
            if (\PHP_INT_SIZE >= 8 || 10 > \strlen($time = self::$time)) {
                $time = (string) (1 + (int) $time);
            } elseif ('999999999' === $mtime = substr($time, -9)) {
                $time = (1 + (int) substr($time, 0, -9)).'000000000';
            } else {
                $time = substr_replace($time, str_pad(++$mtime, 9, '0', \STR_PAD_LEFT), -9);
            }

            goto randomize;
        } else {
            for ($i = 4; $i > 0 && 0xFFFFF === self::$rand[$i]; --$i) {
                self::$rand[$i] = 0;
            }

            ++self::$rand[$i];
            $time = self::$time;
        }

        if (\PHP_INT_SIZE >= 8) {
            $time = base_convert($time, 10, 32);
        } else {
            $time = str_pad(bin2hex(BinaryUtil::fromBase($time, BinaryUtil::BASE10)), 12, '0', \STR_PAD_LEFT);
            $time = \sprintf(
                '%s%04s%04s',
                base_convert(substr($time, 0, 2), 16, 32),
                base_convert(substr($time, 2, 5), 16, 32),
                base_convert(substr($time, 7, 5), 16, 32)
            );
        }

        return strtr(\sprintf(
            '%010s%04s%04s%04s%04s',
            $time,
            base_convert((string)self::$rand[1], 10, 32),
            base_convert((string)self::$rand[2], 10, 32),
            base_convert((string)self::$rand[3], 10, 32),
            base_convert((string)self::$rand[4], 10, 32)
        ), 'abcdefghijklmnopqrstuv', 'ABCDEFGHJKMNPQRSTVWXYZ');
    }
}
