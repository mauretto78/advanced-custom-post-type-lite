<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

/**
 * Internal link picker of the URL field ("Enable internal link picker" advanced option, #1442).
 *
 * Reuses WordPress core's link dialog (wplink): the dialog writes an <a> tag into a textarea,
 * so a hidden textarea is printed next to it and _admin_url_picker.js reads href and text back.
 * Core prints the dialog only on classic-editor screens: it's printed here everywhere a URL
 * field with the option renders (block editor, terms, users, option pages, CCT records).
 */
class LinkPicker
{
    const ADVANCED_OPTION = 'link_picker';
    const TEXTAREA_ID = 'acpt-link-picker-textarea';

    /**
     * @var bool
     */
    private static bool $required = false;

    /**
     * Does this field, or a field nested in it (Repeater, Flexible, Clone), use the picker?
     * Rows added later with AJAX need the dialog already on the page.
     *
     * @param MetaFieldModel $field
     * @param int $depth
     *
     * @return bool
     */
    public static function isUsedBy(MetaFieldModel $field, int $depth = 0): bool
    {
        if ($depth > 10) {
            return false;
        }

        foreach ($field->getChildren() as $child) {
            if (self::isUsedBy($child, $depth + 1)) {
                return true;
            }
        }

        foreach ($field->getBlocks() as $block) {
            foreach ($block->getFields() as $blockField) {
                if (self::isUsedBy($blockField, $depth + 1)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Enqueue core's link dialog and print its markup once in the footer.
     */
    public static function enqueue(): void
    {
        if (self::$required || !is_admin()) {
            return;
        }

        self::$required = true;

        wp_enqueue_script('wplink');
        wp_enqueue_style('editor-buttons');

        // the dialog's markup must be in the page before wplink.js runs (it binds on DOM ready)
        add_action('admin_footer', [self::class, 'printDialog'], 1);
    }

    /**
     * @return bool
     */
    public static function isEnqueued(): bool
    {
        return self::$required;
    }

    /**
     * Prints the dialog (core's own run-once guard covers the classic editor printing it too)
     * and the textarea the dialog writes into.
     */
    public static function printDialog(): void
    {
        if (!class_exists('_WP_Editors', false)) {
            require_once ABSPATH . WPINC . '/class-wp-editor.php';
        }

        \_WP_Editors::wp_link_dialog();

        echo '<textarea id="'.self::TEXTAREA_ID.'" class="hidden" aria-hidden="true" tabindex="-1"></textarea>';
    }

    /**
     * For tests.
     */
    public static function reset(): void
    {
        self::$required = false;
        remove_action('admin_footer', [self::class, 'printDialog'], 1);
    }
}
