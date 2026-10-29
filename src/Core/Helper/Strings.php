<?php

namespace ACPT_Lite\Core\Helper;

use ACPT_Lite\Utils\Data\Normalizer;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\JSON;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

/**
 * Strings
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Strings
{
    /**
     * Only null and '' are "nothing to escape". empty() also matched "0", so a
     * saved 0 was escaped to null and rendered as an empty value (#1354, #1335).
     *
     * @param string|null $string
     *
     * @return bool
     */
    private static function isNullOrEmpty(?string $string): bool
    {
        return $string === null || $string === '';
    }

    /**
     * This function prevents warnings from formatting.php
     * if the string is empty.
     *
     * A non-scalar (e.g. the array default left behind when a Phone field is
     * changed to Text) cannot be printed in an attribute: it escapes to null
     * instead of fataling the whole screen (#1403).
     *
     * @param mixed $string
     *
     * @return string|null
     */
    public static function esc_attr($string = null): ?string
    {
        if ($string !== null && !is_scalar($string)) {
            return null;
        }

        $string = $string === null ? null : (string)$string;

        if (self::isNullOrEmpty($string)) {
            return null;
        }

        return esc_attr($string);
    }

    /**
     * Character length as the browser counts it: an accented letter is one character,
     * not two UTF-8 bytes, and a textarea's CRLF line break counts once (#1439).
     *
     * @param string $string
     *
     * @return int
     */
    public static function length(string $string): int
    {
        return mb_strlen(str_replace("\r\n", "\n", $string), 'UTF-8');
    }

    /**
     * @param string|null $string
     * @return string|null
     */
    public static function htmlspecialchars(?string $string = null): ?string
    {
        if (self::isNullOrEmpty($string)) {
            return null;
        }

        return htmlspecialchars($string);
    }

    /**
     * @param string|null $string
     *
     * @return string|null
     */
    public static function escapeForJSON(?string $string = null): ?string
    {
        if (self::isNullOrEmpty($string)) {
            return null;
        }

        return str_replace('\"', '\\\\\\\\\"', $string);
    }

    /**
     * @param string|null $string
     *
     * @return bool
     */
    public static function exists(?string $string = null): bool
    {
        return !empty($string);
    }

    /**
     * @param string $string
     * @return bool
     */
    public static function isBase64(string $string): bool
    {
        // Check if there are valid base64 characters
        if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $string)) {
            return false;
        }

        // Decode the string in strict mode and check the results
        $decoded = base64_decode($string, true);

        if (false === $decoded) {
            return false;
        }

        // Encode the string again
        if (base64_encode($decoded) != $string) {
            return false;
        }

        return true;
    }

    /**
     * @param string $hexCode
     * @return bool
     */
    public static function isHexadecimalString(string $hexCode): bool
    {
        return preg_match('/^#[a-f0-9]{6}$/i', $hexCode) == 1;
    }

    /**
     * @param bool $bool
     * @return string
     */
    public static function trueOfFalse(bool $bool): string
    {
        if ($bool === true) {
            return 'true';
        }

        return 'false';
    }

    /**
     * @param string $base64
     * @return bool
     */
    public static function isValidBase64Image($base64): bool
    {
        // remove data:image/png,base64, string if present
        $base64 = str_replace("data:image/png;base64,", "", $base64);

        if (!Strings::isBase64($base64)) {
            return false;
        }

        $img = imagecreatefromstring(base64_decode($base64));

        if (!$img) {
            return false;
        }

        imagepng($img, 'tmp.png');
        $info = getimagesize('tmp.png');

        unlink('tmp.png');

        if ($info === false) {
            return false;
        }

        return ($info[0] > 0 && $info[1] > 0 && $info['mime']);
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toDBFormat(string $string): string
    {
        return strtolower(str_replace(' ', '_', $string));
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toHumanReadableFormat(string $string): string
    {
        $string = strtolower($string);
        $string = str_replace('_', ' ', $string);
        $string = ucwords($string);

        return $string;
    }

    /**
     * @param string $name
     * @param array<string> $arrayOfNames
     *
     * @return string
     */
    public static function getTheFirstAvailableName(string $name, array $arrayOfNames = []): string
    {
        if (!in_array($name, $arrayOfNames)) {
            return $name;
        }

        $newName = Strings::getUniqueName($name);

        return self::getTheFirstAvailableName($newName, $arrayOfNames);
    }

    /**
     * This function appends _{x} to a string.
     *
     * Example: house   ---> house_1
     *          house_1 ---> house_2
     *
     * @param string $string
     *
     * @return string
     */
    public static function getUniqueName(string $string): string
    {
        $a = explode("_", $string);
        $end = (int)end($a);

        if (($end > 0) && Arrays::count($a)>1) {
            array_pop($a);
        }

        $name = implode('_', $a);

        $return = $name;
        $return .= '_'.($end+1);

        return $return;
    }

    /**
     * @param string $needle
     * @param string|null $haystack
     *
     * @return bool
     */
    public static function contains(string $needle, ?string $haystack = null): bool
    {
        // if php 8 use str_contains
        if (function_exists('str_contains')) {
            return str_contains($haystack, $needle);
        }

        if (empty($haystack)) {
            return false;
        }

        return strpos($haystack, $needle) !== false;
    }

    /**
     * @param string $string
     *
     * @return bool
     */
    public static function containsHtml(string $string): bool
    {
        return preg_match("/<[^<]+>/", $string, $m) != 0;
    }

    /**
     * @param string $css
     *
     * @return string
     */
    public static function minifyCss(string $css): string
    {
        $css = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $css);
        $css = preg_replace('/\s{2,}/', ' ', $css);
        $css = preg_replace('/\s*([:;{}])\s*/', '$1', $css);
        $css = preg_replace('/;}/', '}', $css);

        return $css;
    }

    /**
     * @param string $html
     * @return string
     */
    public static function minifyHtml(string $html): string
    {
        // 1. Remove carriage returns and tabs
        $search = array("\r", "\t");
        $minifiedHtml = str_replace($search, '', $html);

        // 2. Replace multiple newlines/spaces with a single newline
        // This targets the literal '\n' and actual newline characters
        $minifiedHtml = preg_replace('/(\n)+/', "\n", $minifiedHtml);

        // 3. Remove spaces between escaped tags
        // Targets the space between '&gt;' and '&lt;'
        $minifiedHtml = preg_replace('/&gt;\s+&lt;/', '&gt;&lt;', $minifiedHtml);

        // 4. Collapse multiple spaces into one
        $minifiedHtml = preg_replace('/\s+/', ' ', $minifiedHtml);

        return trim($minifiedHtml);
    }

    /**
     * @param int  $maxlength
     * @param bool $moreEntropy
     *
     * @return string
     */
    public static function randomString(int $maxlength = 12, bool $moreEntropy = false): string
    {
        $_pwd = md5(uniqid('', true));

        // we want more characters not only [0-9a-f]
        if ($moreEntropy) {
            $_pwd = base64_encode($_pwd);
        }

        // exclude last 2 char2 because they can be == sign
        $pwd = substr($_pwd, 0, 6) . substr($_pwd, -8, 6);
        $pwd = substr($pwd, 0, $maxlength);

        if ($maxlength > 12) {
            while (strlen($pwd) < $maxlength) {
                $pwd .= self::randomString();
            }

            $pwd = substr($pwd, 0, $maxlength);
        }

        return $pwd;
    }

    /**
     * @param string $string_name
     * @param int $rand_no
     *
     * @return string
     */
    public static function generateUsername(string $string_name, int $rand_no = 200): string
    {
        $username_parts = array_filter(explode(" ", strtolower($string_name)));
        $username_parts = array_slice($username_parts, 0, 2);

        $part1 = (!empty($username_parts[0])) ? substr($username_parts[0], 0, 8) : "";
        $part2 = (!empty($username_parts[1])) ? substr($username_parts[1], 0, 5) : "";
        $part3 = ($rand_no) ? rand(0, $rand_no) : "";

        $username = $part1. str_shuffle($part2). $part3;

        return str_replace(" ", "_", $username);
    }

    /**
     * @param string $string
     * @return string
     */
    public static function removeDashes(string $string): string
    {
        return strtolower(str_replace("-", "_", $string));
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toSnakeCase(string $string): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $string));
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function toCamelCase(string $string): string
    {
        $str = str_replace('-', '', ucwords($string, '-'));
        $str = str_replace('_', '', ucwords($str, '_'));
        $str = str_replace(' ', '', ucwords($str, ' '));

        return $str;
    }

    /**
     * SQL Like operator in PHP.
     * Returns TRUE if match else FALSE.
     * @param string $pattern
     * @param string $subject
     * @return bool
     */
    public static function likeMatch(string $pattern, string $subject): bool
    {
        $pattern = str_replace('%', '.*', preg_quote($pattern, '/'));
        return (bool) preg_match("/^{$pattern}$/i", $subject);
    }

    /**
     * @param array<mixed, mixed> $strings
     *
     * @return string
     */
    public static function convertKeyValueArrayToString(array $strings): string
    {
        $return = '';

        foreach ($strings as $key => $value) {
            if (is_array($value)) {
                if (is_numeric($key)) {
                    $return .= self::convertKeyValueArrayToString($value) . PHP_EOL;
                } else {
                    $return .= '        \''.$key.'\' => ['. PHP_EOL;
                    $return .= self::convertKeyValueArrayToString($value);
                    $return .= '        ],' . PHP_EOL;
                }
            }

            if (is_string($value)) {
                if (is_numeric($key)) {
                    $return .= '           \''.addslashes($value).'\',' . PHP_EOL;
                } else {
                    $return .= '           \''.$key.'\' => \''.addslashes($value).'\',' . PHP_EOL;
                }
            }

            if (is_bool($value)) {
                $value = ($value === true) ? 'true' : 'false';

                if (is_numeric($key)) {
                    $return .= '           '.$value.',' . PHP_EOL;
                } else {
                    $return .= '           \''.$key.'\' => '.$value.',' . PHP_EOL;
                }
            }

            if ($value === null) {
                if (is_numeric($key)) {
                    $return .= '           null,' . PHP_EOL;
                } else {
                    $return .= '           \''.$key.'\' => null,' . PHP_EOL;
                }
            }
        }

        return $return;
    }

    /**
     * @param string $string
     *
     * @return bool
     */
    public static function alphanumericallyValid(string $string): bool
    {
        $regex = '/^[0-9a-zA-Z_-]+$/iu';

        preg_match_all($regex, $string, $matches);

        return !empty($matches[0]);
    }

    /**
     * @param string|null $string
     *
     * @return bool
     */
    public static function isJson(?string $string = null): bool
    {
        if (empty($string)) {
            return false;
        }

        $result = json_decode($string);

        // Checks if the error is 0 AND the result is an object or array
        return json_last_error() === JSON_ERROR_NONE && (is_object($result) || is_array($result));
    }

    /**
     * @param string|null $string
     *
     * @return bool
     */
    public static function isUrl(?string $string = null): bool
    {
        if (empty($string)) {
            return false;
        }

        return (filter_var($string, FILTER_VALIDATE_URL) ? true : false);
    }

    /**
     * @param string $value
     * @return float|int
     */
    public static function convertStringToIntOfFloat(string $value)
    {
        if (!is_numeric($value)) {
            return 0;
        }

        return (strpos($value, '.') !== false) ? (float)$value : (int)$value;
    }

    /**
     * @param string|int $number
     *
     * @return float|int
     */
    public static function convertStringToNumber($number)
    {
        if (is_numeric($number)) {
            if (self::contains('.', (string)$number) || self::contains(',', (string)$number)) {
                return floatval($number);
            }

            return (int)$number;
        }

        return 0;
    }

    /**
     * @param string|int $value
     *
     * @return string|null
     */
    public static function renderRatingAsString($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if (!is_numeric($value)) {
            return null;
        }

        $ratings = [
            10 => '5/5',
            9 => '4.5/5',
            8 => '4/5',
            7 => '3.5/5',
            6 => '3/5',
            5 => '2.5/5',
            4 => '2/5',
            3 => '1.5/5',
            2 => '1/5',
            1 => '0.5/5',
        ];

        if (!isset($ratings[$value])) {
            return null;
        }

        return $ratings[$value];
    }

    /**
     * @param string|int $value
     * @param int $size
     *
     * @return string|null
     */
    public static function renderStars($value, int $size = 24): ?string
    {
        if (!is_numeric($value)) {
            return null;
        }

        $starsMap = [];
        $halfStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="M10 1L7 7l-6 .75l4.13 4.62L4 19l6-3l6 3l-1.12-6.63L19 7.75L13 7zm0 2.24l2.34 4.69l4.65.58l-3.18 3.56l.87 5.15L10 14.88V3.24z"/></svg>';
        $fullStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="m10 1l3 6l6 .75l-4.12 4.62L16 19l-6-3l-6 3l1.13-6.63L1 7.75L7 7z"/></svg>';
        $emptyStar = '<svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 20 20"><path fill="currentColor" d="M10 1L7 7l-6 .75l4.13 4.62L4 19l6-3l6 3l-1.12-6.63L19 7.75L13 7zm0 2.24l2.34 4.69l4.65.58l-3.18 3.56l.87 5.15L10 14.88l-4.68 2.34l.87-5.15l-3.18-3.56l4.65-.58z"/></svg>';

        switch ($value) {
            case 10:
                $starsMap = ['full','full','full','full','full'];
                break;

            case 9:
                $starsMap = ['full','full','full','full','half'];
                break;

            case 8:
                $starsMap = ['full','full','full','full', 'empty'];
                break;

            case 7:
                $starsMap = ['full','full','full','half', 'empty'];
                break;

            case 6:
                $starsMap = ['full','full','full', 'empty', 'empty'];
                break;

            case 5:
                $starsMap = ['full','full','half', 'empty', 'empty'];
                break;

            case 4:
                $starsMap = ['full','full', 'empty', 'empty', 'empty'];
                break;

            case 3:
                $starsMap = ['full','half', 'empty', 'empty', 'empty'];
                break;

            case 2:
                $starsMap = ['full', 'empty', 'empty', 'empty', 'empty'];
                break;

            case 1:
                $starsMap = ['half', 'empty', 'empty', 'empty', 'empty'];
                break;
        }

        if (empty($starsMap)) {
            return null;
        }

        $render = '';

        foreach ($starsMap as $value) {
            if ($value === 'full') {
                $render .= $fullStar;
            } elseif ($value === 'empty') {
                $render .= $emptyStar;
            } elseif ($value === 'half') {
                $render .= $halfStar;
            }
        }

        return $render;
    }

    /**
     * @param string $a
     * @param string $b
     *
     * @return array<string>
     */
    public static function matches(string $a, string $b): array
    {
        $value = trim($a);
        $value = preg_replace('/\s+/', '', $value);
        $value = explode(',', $value);

        $value2 = trim($b);
        $value2 = preg_replace('/\s+/', '', $value2);
        $value2 = explode(',', $value2);

        return array_intersect($value2, $value);
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function formatForInStatement(string $string): string
    {
        $array = explode(",", $string);

        foreach ($array as $i => $el) {
            $array[$i] = trim($el);
        }

        return "'" . implode("','", $array) . "'";
    }

    /**
     * @return string
     */
    public static function generateRandomId(): string
    {
        return 'id_'.rand(111111, 999999);
    }

    /**
     * @param int $size
     *
     * @return string
     */
    public static function bytesToHumanReadable(int $size): string
    {
        if ($size < 1024) {
            return "{$size} bytes";
        }

        if ($size < 1048576) {
            $size_kb = round($size/1024);

            return "{$size_kb} KB";
        }

        $size_mb = round($size/1048576, 1);

        return "{$size_mb} MB";
    }

    /**
     * @param string|null $from
     *
     * @return int|null
     */
    public static function convertToBytes(?string $from = null): ?int
    {
        if (empty($from)) {
            return 0;
        }

        try {
            return (int)preg_replace_callback('/^\s*(\d+)\s*(?:([kmgt]?)b?)?\s*$/i', function ($m) {
                switch (strtolower($m[2] ?? '')) {
                    case 't':
                    case 'g':
                    case 'm':
                    case 'k':
                        $m[1] *= 1024;
                        break;
                }

                return $m[1];
            }, $from);
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * @param string $str
     * @param string $substr
     *
     * @return bool
     */
    public static function startsWith(string $str, string $substr): bool
    {
        return substr($str, 0, strlen($substr)) === $substr;
    }

    /**
     * @param string $str
     * @param string $substr
     *
     * @return bool
     */
    public static function endsWith(string $str, string $substr): bool
    {
        return strrpos($str, $substr) === strlen($str) - strlen($substr);
    }

    /**
     * This function adds _$b to $a.
     *
     * If $a ends with _s, like this example:
     *
     * $a = access_private_s
     * $b = movie
     *
     * returns access_private_movie_s
     *
     * @param string $a
     * @param string $b
     *
     * @return string
     */
    public static function pluralize(string $a, string $b): string
    {
        if (self::endsWith($a, "_s")) {
            $a = substr($a, 0, -2) . '';

            return $a."_".$b."_s";
        }

        return $a."_".$b;
    }

    /**
     * @param string $string
     *
     * @return string
     */
    public static function removeAllExtraSpaces(string $string): string
    {
        return preg_replace('/\s+/', ' ', $string);
    }

    /**
     * This function extract children nodes (with attributes) from an HTML string
     *
     * @param string $string
     * @param string $tag
     * @return array<string, mixed> |null
     */
    public static function extractNodesFromTag(string $string, string $tag): ?array
    {
        if (empty($string)) {
            return [];
        }

        $nodes = [];

        $dom = new \DOMDocument();
        $dom->loadXml($string);

        if ($dom->getElementsByTagName($tag)->length !== 1) {
            return null;
        }

        $node = $dom->getElementsByTagName($tag)->item(0);

        foreach ($node->childNodes as $child) {
            if (!($child instanceof \DOMElement)) {
                continue;
            }

            $attrs = [];

            foreach ($child->attributes as $attr) {
                $name = $attr->nodeName;
                $value = $attr->nodeValue;
                $attrs[$name] = $value;
            }

            $nodes[$child->tagName] = $attrs;
        }

        return $nodes;
    }

    /**
     * @param string $val1
     * @param string $val2
     * @param string $compare
     *
     * @return bool
     */
    public static function comparison(string $val1, string $val2, string $compare = "="): bool
    {
        $allowedOperators = [
            "=",
            "!=",
            ">",
            ">=",
            "<",
            "<=",
            "LIKE",
            "NOT LIKE",
            "IN",
            "NOT IN",
            "BETWEEN",
            "NOT BETWEEN",
            "REGEXP",
            "NOT REGEXP",
        ];

        if (!in_array($compare, $allowedOperators)) {
            $compare = "=";
        }

        switch ($compare) {

            default:
            case "=":
                return $val1 == $val2;

            case "!=":
                return $val1 != $val2;

            case ">":
                return $val1 > $val2;

            case ">=":
                return $val1 >= $val2;

            case "<":
                return $val1 < $val2;

            case "<=":
                return $val1 <= $val2;

            case "LIKE":
                return Strings::contains($val1, $val2);

            case "NOT LIKE":
                return !Strings::contains($val1, $val2);

            case "IN":
                $array = Strings::commaSeparatedValuesToArray($val2);

                return in_array($val1, $array);

            case "NOT IN":
                $array = Strings::commaSeparatedValuesToArray($val2);

                return !in_array($val1, $array);

            case "BETWEEN":
                $limits = Strings::commaSeparatedValuesToArray($val2);

                if (Arrays::count($limits) !== 2) {
                    return false;
                }

                return $val1 >= $limits[0] && $val1 <= $limits[1];

            case "NOT BETWEEN":
                $limits = Strings::commaSeparatedValuesToArray($val2);

                if (Arrays::count($limits) !== 2) {
                    return false;
                }

                return !($val1 >= $limits[0] && $val1 <= $limits[1]);

            case "REGEXP":
                $regex = $val2;
                $pattern = "/$regex/i";

                return preg_match($pattern, $val1) == 1;

            case "NOT REGEXP":
                $regex = $val2;
                $pattern = "/$regex/i";

                return preg_match($pattern, $val1) != 1;
        }
    }

    /**
     * @param string $values
     *
     * @return array<string>
     */
    public static function commaSeparatedValuesToArray(string $values): array
    {
        $exploded = explode(",", $values);

        return array_map('trim', $exploded);
    }

    /**
     * This function converts anything into a string.
     *
     * The array keys are preserved.
     *
     * @param mixed $value
     *
     * @return string
     */
    public static function convertAnyValueToString($value): string
    {
        if (is_numeric($value)) {
            return (string)$value;
        }

        if (is_bool($value)) {
            return $value ? "1" : "0";
        }

        if (is_array($value)) {
            $string = self::convertKeyValueArrayToString($value);
            $string = trim($string);
            $string = preg_replace('/\s+/', ' ', $string);
            $string = rtrim($string, ",");

            return $string;
        }

        if (is_object($value)) {
            $value = Normalizer::objectToArray($value);

            return self::convertAnyValueToString($value);
        }

        return (string)$value;
    }

    /**
     * This function converts anything into a string.
     *
     * The array keys are NOT preserved (only the values are extracted).
     *
     * @param mixed $input
     *
     * @return string
     */
    public static function intoString($input): string
    {
        if (is_numeric($input)) {
            return (string)$input;
        }

        if (is_bool($input)) {
            return $input ? "1" : "0";
        }

        if ($input instanceof WPAttachment) {
            if ($input->isEmpty()) {
                return "";
            }

            return $input->getHref();
        }

        if (is_array($input)) {
            $strings = [];

            foreach ($input as $item) {
                $strings[] = self::intoString($item);
            }

            return implode(", ", $strings);
        }

        if (is_object($input)) {
            $input = Normalizer::objectToArray($input);

            return self::intoString($input);
        }

        return (string)$input;
    }

    /**
     * Converts a letter to its corresponding index in the alphabet.
     *
     * @param string $letter The letter to convert. Must be a single alphabetic character.
     * @param bool $zeroBased Determines if the index should be adjusted for zero-based indexing. Defaults to true.
     *
     * @return int The index of the letter in the alphabet, adjusted based on the zero-based flag.
     */
    public static function lettersToIndex(string $letter, bool $zeroBased = false): int
    {
        $letter = strtolower($letter);
        $index = ord($letter) - 96;

        if ($zeroBased) {
            $index++;
        }

        return $index;
    }

    /**
     * @param int  $n
     * @param bool $zeroBased
     *
     * @return string
     */
    public static function indexToLetters(int $n, bool $zeroBased = true): string
    {
        if ($zeroBased) {
            $n++;
        }
        if ($n < 1) {
            throw new \InvalidArgumentException('Index must be >= ' . ($zeroBased ? 0 : 1));
        }

        $out = '';

        while ($n > 0) {
            $n--; // shift to 0..25
            $out = chr(($n % 26) + 65) . $out; // 65 = 'A'
            $n = function_exists('intdiv') ? intdiv($n, 26) : (int) floor($n / 26);
        }

        return $out;
    }

    /**
     * This functions transforms this expression
     *
     * A1:C1
     *
     * into this:
     *
     * [A1,B1,C1]
     *
     * @param string $range
     *
     * @return array<string>
     */
    public static function splitRange(string $range): array
    {
        [$start_cell, $end_cell] = explode(':', $range);
        if (!preg_match('/^([a-zA-Z]+)(\d+)$/', $start_cell, $start) || !preg_match('/^([a-zA-Z]+)(\d+)$/', $end_cell, $end)) {
            return array();
        }
        $cells = [];

        for ($c = $start[1]; str_pad($c, strlen($end[1]), " ", STR_PAD_LEFT) <= $end[1]; $c++) {
            for ($r = $start[2]; $r <= $end[2]; $r++) {
                $cells[] = "$c$r";
            }
        }

        return $cells;
    }

    /**
     * @param string $string
     * @return string|null
     */
    public static function compressHtml(string $string): ?string
    {
        if (empty($string)) {
            return null;
        }

        return self::minifyHtml(htmlentities($string));
    }

    /**
     * Replaces occurrences of a specified character within quoted sections of a string.
     *
     * @param string $str The input string where the replacement is to be performed.
     * @param string $char The character to replace within quoted sections of the string.
     * @param string $repl The replacement string or character to use in place of the specified character.
     *
     * @return string The modified string with the specified replacements done within quoted sections.
     */
    public static function replaceCharacterWithinQuotes(string $str, string $char, string $repl): string
    {
        if (strpos($str, $char) === false) {
            return $str ;
        }

        $placeholder = chr(7) ;
        $inSingleQuote = false ;
        $inDoubleQuotes = false ;
        $inBackquotes = false ;

        for ($p = 0 ; $p < strlen($str) ; $p++) {
            switch ($str[$p]) {
                case "'": if (! $inDoubleQuotes && ! $inBackquotes) {
                    $inSingleQuote = ! $inSingleQuote ;
                } break ;
                case '"': if (! $inSingleQuote && ! $inBackquotes) {
                    $inDoubleQuotes = ! $inDoubleQuotes ;
                } break ;
                case '`': if (! $inSingleQuote && ! $inDoubleQuotes) {
                    $inBackquotes  = ! $inBackquotes ;
                } break ;
                case '\\': $p++ ;
                    break ;
                case $char: if ($inSingleQuote || $inDoubleQuotes || $inBackquotes) {
                    $str[$p] = $placeholder ;
                } break ;
            }
        }

        return str_replace($placeholder, $repl, $str) ;
    }

    /**
     * Converts a given text into a URL-friendly slug.
     *
     * @param string $text The text to be converted into a slug.
     * @param string $divider The character to use as the word divider in the slug. Defaults to '-'.
     * @return string A URL-friendly slug generated from the input text.
     */
    public static function slugify(string$text, string $divider = '-'): string
    {
        // replace non letter or digits by divider
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text) ?: $text;

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, $divider);

        // remove duplicate divider
        $text = preg_replace('~-+~', $divider, $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        }

        return $text;
    }

    /**
     * Checks if the given string contains encoded HTML entities.
     *
     * @param string $string The string to be checked for encoded HTML entities.
     * @return bool True if the string contains encoded HTML entities, otherwise false.
     */
    public static function isEncoded(string $string): bool
    {
        // Matches named entities (&amp;), decimal (&#123;), or hex (&#x123;)
        return preg_match('/&(#?[a-zA-Z0-9]+);/', $string) === 1;
    }

    /**
     * Convert all newline types to HTML <br> tags
     *
     * @param string $content
     * @return string
     */
    public static function convertNewlinesToBr(string $content): string
    {
        if (!$content) {
            return $content;
        }

        // Convert all newline types to <br> tags
        // Handle CRLF first, then CR, then LF to avoid double processing
        $content = str_replace("\r\n", "<br>", $content);
        $content = str_replace("\r", "<br>", $content);
        $content = str_replace("\n", "<br>", $content);

        return $content;
    }

    /**
     * Handles escaping and unescaping of slashes in input values, with special
     * handling for JSON strings to prevent corruption during processing.
     *
     * @param mixed $value The input value to process, which can be a string,
     *                     array, or other data type.
     * @return string The processed value with appropriate escaping or unescaping
     *               applied based on its type and content.
     */
    /**
     * @param mixed $value
     * @return array<mixed>|string  string for scalar/JSON inputs; the original array for array inputs
     *                (WordPress meta functions serialize arrays natively — casting to string
     *                would produce the literal "Array" and corrupt the stored value).
     */
    public static function treatSlashes($value)
    {
        // 1. Always remove WordPress magic quotes first.
        $value = wp_unslash($value);

        // 2. Arrays are serialized by WordPress meta functions (update_post_meta etc.)
        //    natively via maybe_serialize().  Casting to string here would yield the
        //    literal "Array" and corrupt the saved value.
        if (is_array($value)) {
            return $value;
        }

        // 3. For JSON strings, add wp_slash() to compensate the internal
        //    wp_unslash() that update_post_meta / update_term_meta /
        //    update_user_meta / update_comment_meta apply before saving.
        //    Without this extra slash layer, JSON escape sequences like
        //    \" would be stripped and the stored value would be corrupt.
        if (is_string($value) && JSON::isValid($value)) {
            return wp_slash($value);
        }

        return (string)$value;
    }

    /**
     * Hashes a given password using the specified algorithm.
     *
     * @param string $password The plaintext password to be hashed.
     * @param string $algo The hashing algorithm to use. Defaults to PASSWORD_DEFAULT.
     *                     Supported values include PASSWORD_DEFAULT, PASSWORD_BCRYPT, PASSWORD_ARGON2I, and PASSWORD_ARGON2ID.
     * @return string The hashed password.
     */
    public static function hashPassword(string $password, string $algo = PASSWORD_DEFAULT): string
    {
        switch ($algo) {
            default:
            case "PASSWORD_DEFAULT":
                return password_hash($password, PASSWORD_DEFAULT);

            case "PASSWORD_BCRYPT":
                return password_hash($password, PASSWORD_BCRYPT);

            case "PASSWORD_ARGON2I":
                return password_hash($password, PASSWORD_ARGON2I);

            case "PASSWORD_ARGON2ID":
                return password_hash($password, PASSWORD_ARGON2ID);
        }
    }
}
