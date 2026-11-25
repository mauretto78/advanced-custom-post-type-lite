<?php

namespace ACPT_Lite\Utils\PHP;

/**
 * Normalises user-facing date/time strings to canonical storage formats.
 *
 * All CCT (and new meta) values are stored in ISO formats:
 *   DATE       → Y-m-d
 *   DATE_TIME  → Y-m-d H:i:s
 *   TIME       → H:i:s
 *
 * The display format (chosen by the user in advancedOptions) is only used
 * by the UI layer — it is never persisted alongside the value.
 *
 * Usage:
 *   $canonical = DateNormalizer::toDate('28/10/1990');          // '1990-10-28'
 *   $display   = DateNormalizer::format('1990-10-28', 'd/m/Y'); // '28/10/1990'
 */
class DateNormalizer
{
    /**
     * All PHP date formats supported in the date picker options,
     * ordered so the canonical format is tried first (fast path).
     */
    private const DATE_FORMATS = [
        'Y-m-d',
        'y-m-d',
        'F j, Y',
        'j F, Y',
        'd-M-y',
        'd-M-Y',
        'd M y',
        'd M Y',
        'd/m/y',
        'd/m/Y',
        'm/d/y',
        'm/d/Y',
        'd.m.y',
        'd.m.Y',
    ];

    /**
     * All PHP time formats supported in the time picker options.
     */
    private const TIME_FORMATS = [
        'H:i:s',
        'H:i',
        'g:i a',
        'g:i A',
    ];

    // ── Parse to canonical ────────────────────────────────────────────────────

    /**
     * Parses any supported date string and returns it in Y-m-d.
     * Returns null when no supported format matches.
     *
     * @param string      $value         The date string to normalise.
     * @param string|null $knownFormat   If the format is known (e.g. from advancedOptions),
     *                                   pass it here to skip the format-detection loop.
     */
    public static function toDate(string $value, ?string $knownFormat = null): ?string
    {
        $dt = self::parseDate($value, $knownFormat);
        return $dt !== null ? $dt->format('Y-m-d') : null;
    }

    /**
     * Parses any supported date+time string and returns it in Y-m-d\TH:i:s (ISO 8601).
     * The $combinedFormat parameter accepts a combined PHP format string
     * such as 'Y-m-d H:i:s' or 'd/m/Y H:i'.
     *
     * Canonical output uses the T separator so it satisfies the JSON Schema
     * "date-time" format (RFC 3339). MySQL DATETIME columns accept the T separator
     * on insert and normalise to Y-m-d H:i:s internally; use formatDateTime() to
     * display values read back from the DB.
     */
    public static function toDateTime(string $value, ?string $knownFormat = null): ?string
    {
        if ($knownFormat !== null) {
            $dt = \DateTime::createFromFormat(self::resetUnparsed($knownFormat), $value) ?: null;
            return $dt !== null ? $dt->format('Y-m-d\TH:i:s') : null;
        }

        // Fast path: ISO 8601 / RFC 3339 inputs (from JS date pickers or API clients)
        foreach (['Y-m-d\TH:i:sP', 'Y-m-d\TH:i:sO', 'Y-m-d\TH:i:s'] as $fmt) {
            $dt = \DateTime::createFromFormat($fmt, $value) ?: null;
            if ($dt !== null) {
                return $dt->format('Y-m-d\TH:i:s');
            }
        }

        // Try all combinations of date + time formats
        foreach (self::DATE_FORMATS as $dateFmt) {
            foreach (self::TIME_FORMATS as $timeFmt) {
                $dt = \DateTime::createFromFormat("{$dateFmt} {$timeFmt}", $value) ?: null;
                if ($dt !== null) {
                    return $dt->format('Y-m-d\TH:i:s');
                }
            }
        }

        return null;
    }

    /**
     * Parses any supported time string and returns it in H:i:s.
     */
    public static function toTime(string $value, ?string $knownFormat = null): ?string
    {
        if ($knownFormat !== null) {
            $dt = \DateTime::createFromFormat(self::resetUnparsed($knownFormat), $value) ?: null;
            return $dt !== null ? $dt->format('H:i:s') : null;
        }

        foreach (self::TIME_FORMATS as $fmt) {
            $dt = \DateTime::createFromFormat($fmt, $value) ?: null;
            if ($dt !== null) {
                return $dt->format('H:i:s');
            }
        }

        return null;
    }

    /**
     * Parses a daterangepicker string (e.g. "25.06.2026 - 20.07.2026") into a
     * canonical date-range array, or null when either half cannot be parsed.
     *
     * The separator is the fixed literal " - " that daterangepicker always emits.
     *
     * @param string      $value
     * @param string|null $knownFormat  Optional PHP date format hint for both halves.
     * @return array{from: string, to: string}|null
     */
    public static function toDateRange(string $value, ?string $knownFormat = null): ?array
    {
        $parts = explode(' - ', $value, 2);

        if (count($parts) !== 2) {
            return null;
        }

        $from = self::toDate(trim($parts[0]), $knownFormat);
        $to   = self::toDate(trim($parts[1]), $knownFormat);

        if ($from === null || $to === null) {
            return null;
        }

        return ['from' => $from, 'to' => $to];
    }

    // ── Format for display ────────────────────────────────────────────────────

    /**
     * Formats a canonical date (Y-m-d) into the desired display format.
     * Returns null when the canonical value cannot be parsed.
     */
    public static function formatDate(string $canonicalDate, string $displayFormat): ?string
    {
        $dt = \DateTime::createFromFormat('Y-m-d', $canonicalDate) ?: null;
        return $dt !== null ? $dt->format($displayFormat) : null;
    }

    /**
     * Formats a canonical datetime into the desired display format.
     * Accepts both ISO 8601 T-format (Y-m-d\TH:i:s, as written by toDateTime())
     * and MySQL space-format (Y-m-d H:i:s, as returned by DATETIME column reads).
     */
    public static function formatDateTime(string $canonicalDateTime, string $displayFormat): ?string
    {
        $dt = \DateTime::createFromFormat('Y-m-d\TH:i:s', $canonicalDateTime)
           ?: \DateTime::createFromFormat('Y-m-d H:i:s', $canonicalDateTime)
           ?: null;
        return $dt !== null ? $dt->format($displayFormat) : null;
    }

    /**
     * Formats a canonical time (H:i:s) into the desired display format.
     */
    public static function formatTime(string $canonicalTime, string $displayFormat): ?string
    {
        $dt = \DateTime::createFromFormat('H:i:s', $canonicalTime) ?: null;
        return $dt !== null ? $dt->format($displayFormat) : null;
    }

    // ── JS format conversion ──────────────────────────────────────────────────

    /**
     * Converts a PHP date format string to the equivalent moment.js token string
     * for use with daterangepicker's `locale.format` option.
     *
     * Covers the PHP tokens a WordPress date/time format commonly uses. Backslash-escaped
     * characters (e.g. "j \d\e F \d\e Y" on Spanish sites) and letters that are not PHP
     * tokens become moment literals ("[d]"), never tokens (#1473).
     */
    public static function toMomentFormat(string $phpFormat): string
    {
        return self::convertPhpFormatToMoment($phpFormat, [
            'Y' => 'YYYY',
            'y' => 'YY',
            'F' => 'MMMM',  // July
            'M' => 'MMM',   // Jul
            'n' => 'M',     // 7
            'm' => 'MM',
            'd' => 'DD',
            'j' => 'D',
            'D' => 'ddd',   // Mon
            'l' => 'dddd',  // Monday
            'N' => 'E',
            'w' => 'd',
            'H' => 'HH',
            'G' => 'H',
            'h' => 'hh',
            'g' => 'h',
            'i' => 'mm',
            's' => 'ss',
            'a' => 'a',
            'A' => 'A',
        ]);
    }

    /**
     * Converts a PHP date format to moment.js with the given token map.
     *
     * - "\x" (PHP escape) becomes the moment literal "[x]";
     * - "S" (English ordinal suffix) right after a day token becomes moment's "Do";
     * - any other letter missing from the map is emitted as a literal, because moment
     *   would read it as a token (e.g. "e" is moment's day of week);
     * - everything else (spaces, punctuation) is copied as is.
     *
     * @param string                $phpFormat
     * @param array<string, string> $map PHP token => moment token
     *
     * @return string
     */
    public static function convertPhpFormatToMoment(string $phpFormat, array $map): string
    {
        $result = '';
        $len    = strlen($phpFormat);

        for ($i = 0; $i < $len; $i++) {
            $char = $phpFormat[$i];

            if ($char === '\\') {
                $i++;

                if ($i < $len) {
                    $result .= self::momentLiteral($phpFormat[$i]);
                }

                continue;
            }

            if (($char === 'j' || $char === 'd') && ($phpFormat[$i + 1] ?? '') === 'S') {
                $result .= 'Do';
                $i++;
                continue;
            }

            if (isset($map[$char])) {
                $result .= $map[$char];
                continue;
            }

            $result .= ctype_alpha($char) ? self::momentLiteral($char) : $char;
        }

        return $result;
    }

    /**
     * @param string $char
     *
     * @return string
     */
    private static function momentLiteral(string $char): string
    {
        // moment has no way to escape a bracket inside a literal: leave it as is
        return ($char === '[' || $char === ']') ? $char : '[' . $char . ']';
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Prefix a known format with "!" so the parts it doesn't contain are reset
     * (to 1970-01-01 00:00:00) instead of taken from the current time. A year-only
     * format such as "Y" then gives a stable January 1, not today's month and day,
     * which would change on every save (#1423).
     */
    private static function resetUnparsed(string $format): string
    {
        return ($format !== '' && $format[0] === '!') ? $format : '!' . $format;
    }

    private static function parseDate(string $value, ?string $knownFormat): ?\DateTime
    {
        if ($knownFormat !== null) {
            return \DateTime::createFromFormat(self::resetUnparsed($knownFormat), $value) ?: null;
        }

        foreach (self::DATE_FORMATS as $fmt) {
            $dt = \DateTime::createFromFormat($fmt, $value) ?: null;
            if ($dt !== null) {
                return $dt;
            }
        }

        return null;
    }
}
