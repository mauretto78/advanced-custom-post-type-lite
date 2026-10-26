<?php

namespace ACPT_Lite\Core\Helper;

class Id
{
    public const UUID_V1  = 'uuid_v1';
    public const UUID_V4  = 'uuid_v4';
    public const UUID_V7  = 'uuid_v7';
    public const ULID     = 'ulid';
    public const AUTO_INC = 'auto_inc';
    public const RANDOM   = 'random';

    /**
     * @param string $strategy
     *
     * @return string
     */
    public static function formatStrategy($strategy = self::UUID_V1)
    {
        switch ($strategy) {
            default:
            case self::UUID_V1:
                return "UUID(v1)";

            case self::UUID_V4:
                return "UUID(v4)";

            case self::UUID_V7:
                return "UUID(v7)";

            case self::ULID:
                return "ULID";

            case self::AUTO_INC:
                return "AUTO_INCREMENT";

            case self::RANDOM:
                return "RANDOM";
        }
    }

    /**
     * Check if value is valid
     *
     * @param $value
     * @param $strategy
     *
     * @return bool
     */
    /**
     * @param mixed $value
     */
    public static function isValid($value, string $strategy): bool
    {
        switch ($strategy) {
            default:
            case self::UUID_V1:
                return Uuid::isV1Valid($value);

            case self::UUID_V4:
                return Uuid::isV4Valid($value);

            case self::UUID_V7:
                return Uuid::isV7Valid($value);

            case self::ULID:
                return Ulid::isValid($value);

            case self::AUTO_INC:
                return is_numeric($value);

            case self::RANDOM:
                return strlen((string)$value) === 11 && is_numeric($value);
        }
    }

    /**
     * @param string                  $strategy
     * @param int|null                $index
     * @param \DateTimeInterface|null $dateTime
     *
     * @return int|string|null
     * @throws \Exception
     */
    public static function generate($strategy = self::UUID_V1, $index = null, ?\DateTimeInterface $dateTime = null)
    {
        switch ($strategy) {
            default:
            case self::UUID_V1:
                return Uuid::v1($dateTime ?? new \DateTime());

            case self::UUID_V4:
                return Uuid::v4();

            case self::UUID_V7:
                return Uuid::v7($dateTime ?? new \DateTime());

            case self::ULID:
                return Ulid::generate($dateTime ?? new \DateTime());

            case self::AUTO_INC:
                return $index ? ($index+1) : 1;

            case self::RANDOM:
                try {
                    return random_int(11111111111, 99999999999);
                } catch (\Exception $exception) {
                    return mt_rand(11111111111, 99999999999);
                }
        }
    }
}
