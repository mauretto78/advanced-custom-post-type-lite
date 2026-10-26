<?php

namespace ACPT_Lite\Utils\PHP;

class Sluggify
{
    /**
     * Sanitize a string
     *
     * @param string $string
     * @param int    $maxLength
     *
     * @return string
     */
    public static function slug(string $string, int $maxLength = 0): string
    {
        $result = '';

        $result = strtolower($string);
        $result = ltrim($result);
        $result = rtrim($result);
        $result = str_replace(' ', '-', $result);
        $result = preg_replace('/[^a-z0-9_\-]/', '', $result);

        if ($maxLength > 0) {
            $result = substr($result, 0, $maxLength);
        }

        if (empty($result)) {
            return 'n-a';
        }

        if (class_exists(\Transliterator::class)) {
            $result = \Transliterator::create('Any-Latin; Latin-ASCII')->transliterate($result);
        }

        if ($result === false) {
            return 'n-a';
        }

        return $result;
    }
}
