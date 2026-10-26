<?php

namespace ACPT_Lite\Utils\Wordpress;

class Translator
{
    /**
     * Translate a name from the main ACPT .pot file
     *
     * @param string $name
     * @param array<string, mixed> $args
     * @return string
     */
    public static function translate(string $name, array $args = []): string
    {
        if ($name !== __($name, ACPT_LITE_PLUGIN_NAME)) {
            $translation = __($name, ACPT_LITE_PLUGIN_NAME);
        } else {
            $translation = __(ucfirst($name), ACPT_LITE_PLUGIN_NAME);
        }

        if (!empty($args)) {
            foreach ($args as $key => $arg) {
                $translation = str_replace("{{".$key."}}", $arg, $translation);
            }
        }

        return $translation;
    }

    /**
     * Translate a string from an external plugin
     *
     * @param string|null $string
     * @return string
     */
    public static function translateString(?string $string = null): string
    {
        if (empty($string)) {
            return '';
        }

        return $string;
    }
}
