<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Uuid
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Uuid
{
    public const TYPE_1 = 1;
    public const TYPE_4 = 4;
    public const TYPE_7 = 7;

    /**
     * The identifier in its canonic representation.
     */
    protected string $uid;

    /**
     * @var string
     */
    private static string $time = '';

    /**
     * @var array<int, int>
     */
    private static array $rand = [];

    /**
     * @var string
     */
    private static string $seed;

    /**
     * @var array<int, int>
     */
    private static array $seedParts;

    /**
     * @var int
     */
    private static int $seedIndex = 0;

    /**
     * @var string
     */
    private static string $clockSeq;

    /**
     * Uuid constructor.
     *
     * @param int                     $type
     * @param \DateTimeInterface|null $dateTime
     *
     * @throws \Exception
     */
    public function __construct(int $type = self::TYPE_1, ?\DateTimeInterface $dateTime = null)
    {
        switch ($type) {

            default:
            case self::TYPE_1:
                $uid = self::v1($dateTime);
                break;

            case self::TYPE_4:
                $uid = self::v4();
                break;

            case self::TYPE_7:
                $uid = self::v7($dateTime);
                break;
        }

        $this->uid = $uid;
    }

    /**
     * @return string|null
     */
    public function __toString()
    {
        return $this->uid;
    }

    /**
     * @param \DateTimeInterface|null $time
     * @param Uuid|null               $node
     *
     * @return string|null
     * @throws \Exception
     */
    public static function v1(?\DateTimeInterface $time = null, ?Uuid $node = null): ?string
    {
        $uuid = !$time || !$node ? UuidGenerator::uuid_create(1) : '00000000-0000-0000-0000-000000000000';

        if ($time) {
            if ($node) {
                // use clock_seq from the node
                $seq = substr($node->uid, 19, 4);
            } elseif (!$seq = self::$clockSeq ?? '') {
                // generate a static random clock_seq to prevent any collisions with the real one
                $seq = substr($uuid, 19, 4);

                do {
                    self::$clockSeq = \sprintf('%04x', random_int(0, 0x3FFF) | 0x8000);
                } while ($seq === self::$clockSeq);

                $seq = self::$clockSeq;
            }

            $time = BinaryUtil::dateTimeToHex($time);
            $uuid = substr($time, 8).'-'.substr($time, 4, 4).'-1'.substr($time, 1, 3).'-'.$seq.substr($uuid, 23);
        }

        if ($node) {
            $uuid = substr($uuid, 0, 24).substr($node->uid, 24);
        }

        return $uuid;
    }

    /**
     * @return string
     */
    public static function v4()
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );
    }

    /**
     * @param \DateTimeInterface|null $time
     *
     * @return string
     * @throws \Exception
     */
    public static function v7(?\DateTimeInterface $time = null)
    {
        if (null === $mtime = $time) {
            $time = microtime(false);
            $time = substr($time, 11).substr($time, 2, 3);
        } elseif (0 > $time = $time->format('Uv')) {
            throw new \InvalidArgumentException('The timestamp must be positive.');
        }

        if ($time > self::$time || (null !== $mtime && $time !== self::$time)) {
            randomize:
            /** @var array<int, int> $unpacked */
            $unpacked = unpack('S*', isset(self::$seed) ? random_bytes(10) : self::$seed = random_bytes(16));
            self::$rand = $unpacked;
            self::$rand[1] &= 0x03FF;
            self::$time = $time;
        } else {
            // Within the same ms, we increment the rand part by a random 24-bit number.
            // Instead of getting this number from random_bytes(), which is slow, we get
            // it by sha512-hashing self::$seed. This produces 64 bytes of entropy,
            // which we need to split in a list of 24-bit numbers. unpack() first splits
            // them into 16 x 32-bit numbers; we take the first byte of each of these
            // numbers to get 5 extra 24-bit numbers. Then, we consume those numbers
            // one-by-one and run this logic every 21 iterations.
            // self::$rand holds the random part of the UUID, split into 5 x 16-bit
            // numbers for x86 portability. We increment this random part by the next
            // 24-bit number in the self::$seedParts list and decrement self::$seedIndex.

            if (!self::$seedIndex) {
                $s = unpack(\PHP_INT_SIZE >= 8 ? 'L*' : 'l*', self::$seed = hash('sha512', self::$seed, true));
                /** @var array<int, int> $s */
                $s[] = ($s[1] >> 8 & 0xFF0000) | ($s[2] >> 16 & 0xFF00) | ($s[3] >> 24 & 0xFF);
                $s[] = ($s[4] >> 8 & 0xFF0000) | ($s[5] >> 16 & 0xFF00) | ($s[6] >> 24 & 0xFF);
                $s[] = ($s[7] >> 8 & 0xFF0000) | ($s[8] >> 16 & 0xFF00) | ($s[9] >> 24 & 0xFF);
                $s[] = ($s[10] >> 8 & 0xFF0000) | ($s[11] >> 16 & 0xFF00) | ($s[12] >> 24 & 0xFF);
                $s[] = ($s[13] >> 8 & 0xFF0000) | ($s[14] >> 16 & 0xFF00) | ($s[15] >> 24 & 0xFF);
                self::$seedParts = $s;
                self::$seedIndex = 21;
            }

            self::$rand[5] = 0xFFFF & $carry = self::$rand[5] + 1 + (self::$seedParts[self::$seedIndex--] & 0xFFFFFF);
            self::$rand[4] = 0xFFFF & $carry = self::$rand[4] + ($carry >> 16);
            self::$rand[3] = 0xFFFF & $carry = self::$rand[3] + ($carry >> 16);
            self::$rand[2] = 0xFFFF & $carry = self::$rand[2] + ($carry >> 16);
            self::$rand[1] += $carry >> 16;

            if (0xFC00 & self::$rand[1]) {
                if (\PHP_INT_SIZE >= 8 || 10 > \strlen($time = self::$time)) {
                    $time = (string) (1 + (int) $time);
                } elseif ('999999999' === $mtime = substr($time, -9)) {
                    $time = (1 + (int) substr($time, 0, -9)).'000000000';
                } else {
                    $time = substr_replace($time, str_pad(++$mtime, 9, '0', \STR_PAD_LEFT), -9);
                }

                goto randomize;
            }

            $time = self::$time;
        }

        if (\PHP_INT_SIZE >= 8) {
            $time = dechex((int)$time);
        } else {
            $time = bin2hex(BinaryUtil::fromBase($time, BinaryUtil::BASE10));
        }

        return substr_replace(\sprintf(
            '%012s-%04x-%04x-%04x%04x%04x',
            $time,
            0x7000 | (self::$rand[1] << 2) | (self::$rand[2] >> 14),
            0x8000 | (self::$rand[2] & 0x3FFF),
            self::$rand[3],
            self::$rand[4],
            self::$rand[5],
        ), '-', 8, 0);
    }

    /**
     * @param mixed $uuid
     *
     * @return bool
     */
    public static function isV1Valid($uuid): bool
    {
        if ($uuid instanceof self) {
            $uuid = (string) $uuid;
        }

        if (!is_string($uuid)) {
            return false;
        }

        $re = '/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-1[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/m';

        preg_match_all($re, $uuid, $matches, PREG_SET_ORDER, 0);

        return !empty($matches);
    }

    /**
     * @param mixed $uuid
     *
     * @return bool
     */
    public static function isV4Valid($uuid): bool
    {
        if ($uuid instanceof self) {
            $uuid = (string) $uuid;
        }

        if (!is_string($uuid)) {
            return false;
        }

        if (!preg_match('/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i', $uuid)) {
            return false;
        }

        return true;
    }

    /**
     * @param mixed $uuid
     *
     * @return bool
     */
    public static function isV7Valid($uuid): bool
    {
        if ($uuid instanceof self) {
            $uuid = (string) $uuid;
        }
        if (!is_string($uuid)) {
            return false;
        }

        $re = '/^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-7[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/m';
        preg_match_all($re, $uuid, $matches, PREG_SET_ORDER, 0);

        if (empty($matches)) {
            return false;
        }

        try {
            $date =  self::getDateTime($uuid);
            $today = new \DateTime();

            return $date < $today;
        } catch (\Exception $exception) {
            return false;
        }
    }

    /**
     * @param string $uuid
     *
     * @return \DateTimeImmutable
     */
    private static function getDateTime(string $uuid): \DateTimeImmutable
    {
        $time = substr($uuid, 0, 8).substr($uuid, 9, 4);
        $time = \PHP_INT_SIZE >= 8 ? (string) hexdec($time) : BinaryUtil::toBase((string) hex2bin($time), BinaryUtil::BASE10);

        if (4 > \strlen($time)) {
            $time = '000'.$time;
        }

        $result = \DateTimeImmutable::createFromFormat('U.v', substr_replace($time, '.', -3, 0));

        if ($result === false) {
            throw new \RuntimeException('Failed to parse UUID timestamp.');
        }

        return $result;
    }
}
