<?php

namespace ACPT_Lite\Utils\Wordpress;

/**
 * Assets and labels of the date picker (daterangepicker + moment.js) used by the
 * Date, DateTime, DateRange and Time fields, in the admin and in front-end forms.
 *
 * The picker's labels (month and weekday names, first day of the week, Apply/Cancel)
 * follow the WordPress locale. moment.js keeps its English locale on purpose: the
 * picker writes the input value with moment, and the save path parses it with
 * DateTime::createFromFormat(), which only understands English month/day names.
 */
class DatePicker
{
    const SCRIPT_HANDLE = 'daterangepicker-js';

    /**
     * Enqueue moment.js, daterangepicker and its CSS, with the locale labels.
     */
    public static function enqueueAssets(): void
    {
        wp_enqueue_script('momentjs', plugins_url('acpt-lite/assets/vendor/moment/moment.min.js'), ['jquery'], '2.18.1', true);
        wp_enqueue_script(self::SCRIPT_HANDLE, plugins_url('acpt-lite/assets/vendor/daterangepicker/js/daterangepicker.min.js'), ['jquery', 'momentjs'], '3.1.0', true);
        wp_enqueue_style('daterangepicker-css', plugins_url('acpt-lite/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');

        self::attachLocale();
    }

    /**
     * Print window.acptDatePickerLocale before daterangepicker, once per request.
     */
    public static function attachLocale(): void
    {
        $before = wp_scripts()->get_data(self::SCRIPT_HANDLE, 'before');

        if (is_array($before)) {
            foreach ($before as $code) {
                if (is_string($code) && strpos($code, 'window.acptDatePickerLocale') !== false) {
                    return;
                }
            }
        }

        $json = wp_json_encode(self::locale());

        if (!is_string($json)) {
            return;
        }

        wp_add_inline_script(self::SCRIPT_HANDLE, 'window.acptDatePickerLocale = ' . $json . ';', 'before');
    }

    /**
     * daterangepicker's `locale` option (without `format`, which every field sets).
     *
     * @return array<string, mixed>
     */
    public static function locale(): array
    {
        global $wp_locale;

        $locale = [
            'applyLabel'  => self::label('Apply'),
            'cancelLabel' => self::label('Cancel'),
            'firstDay'    => (int)get_option('start_of_week', 0),
        ];

        if ($wp_locale instanceof \WP_Locale) {
            $daysOfWeek = [];

            // daterangepicker wants Sunday first; firstDay rotates them
            for ($day = 0; $day < 7; $day++) {
                $daysOfWeek[] = $wp_locale->get_weekday_abbrev($wp_locale->get_weekday($day));
            }

            $monthNames = [];

            for ($month = 1; $month <= 12; $month++) {
                $monthNames[] = $wp_locale->get_month_abbrev($wp_locale->get_month($month));
            }

            $locale['daysOfWeek'] = $daysOfWeek;
            $locale['monthNames'] = $monthNames;
            $locale['direction'] = $wp_locale->is_rtl() ? 'rtl' : 'ltr';
        }

        /**
         * Filters the date picker's labels (daterangepicker `locale` option).
         *
         * @param array<string, mixed> $locale
         */
        return apply_filters('acpt/datepicker/locale', $locale);
    }

    /**
     * Label of the "Clear" link next to every date field.
     *
     * @return string
     */
    public static function clearLabel(): string
    {
        return self::label('Clear');
    }

    /**
     * ACPT's own translation, else WordPress core's, else English.
     *
     * @param string $text
     * @return string
     */
    private static function label(string $text): string
    {
        $translation = __($text, ACPT_LITE_PLUGIN_NAME);

        if ($translation !== $text) {
            return $translation;
        }

        // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText
        return __($text);
    }
}
