<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Helper\Strings;

class Date
{
    /**
     * This function convert any date string to a DateTime object
     * (NOT IN USE)
     *
     * @param string $date
     *
     * @return \DateTime|null
     */
    public static function objectFromString(string $date)
    {
        try {
            $formats = self::formats($date);
            $timeFormats = $formats['timeFormats'];
            $dateFormats = $formats['dateFormats'];

            foreach ($dateFormats as $format) {
                $dateTime = \DateTime::createFromFormat($format, $date);

                if ($dateTime instanceof \DateTime && $dateTime->format($format) === $date) {
                    return $dateTime;
                }

                foreach ($timeFormats as $timeFormat) {
                    $completeFormat = $format . " " . $timeFormat;
                    $dateTime = \DateTime::createFromFormat($completeFormat, $date);

                    if ($dateTime instanceof \DateTime && $dateTime->format($completeFormat) === $date) {
                        return $dateTime;
                    }
                }
            }

            foreach ($timeFormats as $timeFormat) {
                $completeFormat = $timeFormat;
                $dateTime = \DateTime::createFromFormat($completeFormat, $date);

                if ($dateTime instanceof \DateTime && $dateTime->format($completeFormat) === $date) {
                    return $dateTime;
                }
            }
        } catch (\Exception $exception) {
            return null;
        }

        return null;
    }

    /**
     * @param string $string
     *
     * @return array<mixed>
     */
    private static function formats($string)
    {
        $timeFormats = [];
        $dateFormats = [];

        if (Strings::contains("/", $string)) {
            $dateFormats = [
                "d/m/y",
                "d/m/Y",
                "m/d/y",
                "m/d/Y",
            ];
        } elseif (Strings::contains(".", $string)) {
            $dateFormats = [
                "d.m.y",
                "d.m.Y",
            ];
        } elseif (Strings::contains("-", $string)) {
            $dateFormats = [
                "Y-m-d",
                "y-m-d",
                "d-M-y",
                "d-M-Y",
            ];
        } elseif (Strings::contains(",", $string)) {
            $dateFormats = [
                "F j, Y",
                "j F, Y",
            ];
        } elseif (Strings::contains(" ", $string) && !Strings::contains(":", $string)) {
            $dateFormats = [
                "d M y",
                "d M Y",
            ];
        }

        if (Strings::contains(":", $string)) {
            $timeFormats = [
                "H:i:s",
                "H:i",
                "g:i a",
                "g:i A",
            ];
        }

        return [
            'dateFormats' => $dateFormats,
            'timeFormats' => $timeFormats,
        ];
    }

    /**
     * @param string $format
     *
     * @return string
     */
    public static function convertTimeFormatForJS($format)
    {
        // Use strtr for atomic replacement — prevents G→H being re-processed by the H→HH rule.
        return strtr($format, [
            'G' => 'H',   // 24h without leading zero → Moment H
            'H' => 'HH',  // 24h with leading zero   → Moment HH
            'g' => 'hh',  // 12h                     → Moment hh
            'i' => 'mm',
            's' => 'ss',
        ]);
    }

    /**
     * @param string $format
     *
     * @return string
     */
    public static function convertDateFormatForJS($format): string
    {
        // Use strtr for atomic replacement — prevents cascading substitutions.
        // PHP 'T' (timezone abbreviation) has no Moment equivalent and is intentionally omitted.
        return strtr($format, [
            'd' => 'DD',
            'j' => 'DD',
            'M' => 'MMM',
            'm' => 'MM',
            'F' => 'MMMM',
            'Y' => 'YYYY',
            'y' => 'YY',
        ]);
    }

    /**
     * @param string $format
     *
     * @return bool
     */
    public static function isDateFormatValid($format): bool
    {
        try {
            $dateTime = new \DateTime();
            $check = \DateTime::createFromFormat($format, $dateTime->format($format));

            return $check !== false;
        } catch (\Exception $exception) {
            return false;
        }
    }

    /**
     * @param string $format
     * @param mixed $value
     *
     * @return string|null
     */
    public static function format($format, $value)
    {
        if (!self::isDateFormatValid($format)) {
            return ($value instanceof \DateTime) ? $value->format("Y-m-d H:i:s") : $value;
        }

        if ($value instanceof \DateTime) {
            return date_i18n($format, $value->getTimestamp());
        }

        if (!is_string($value)) {
            return null;
        }

        $timestamp = strtotime($value);

        if ($timestamp === false) {
            return null;
        }

        return date_i18n($format, $timestamp);
    }
}
