<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\DateNormalizer;
use ACPT_Lite\Utils\Wordpress\Translator;

/**
 * Renders a single date picker input.
 *
 * Storage: always Y-m-d (ISO 8601).
 * Display: controlled by the `date_format` advancedOption.
 *
 * The `_format` shadow field is no longer persisted — the picker
 * receives the display format via data-format and converts on
 * the JS side before submitting. The save command normalises
 * the submitted value back to Y-m-d via DateNormalizer::toDate().
 */
class DateField extends AbstractField
{
    public function render(): string
    {
        $this->enqueueAssets();

        $min           = $this->getAdvancedOption('min')         ?? null;
        $max           = $this->getAdvancedOption('max')         ?? null;
        $displayFormat = $this->getAdvancedOption('date_format') ?? get_option('date_format') ?? 'Y-m-d';
        $momentFormat  = DateNormalizer::toMomentFormat($displayFormat);
        $defaultValue  = $this->defaultDisplayDate($displayFormat);
        $cssClass      = 'acpt-datepicker acpt-admin-meta-field-input';

        if ($this->hasErrors()) {
            $cssClass .= ' has-errors';
        }

        if ($this->isChild()) {
            if ($this->isLeadingField()) {
                $cssClass .= ' acpt-leading-field';
            }

            $field  = '<input type="hidden" name="' . Strings::esc_attr($this->getIdName()) . '[type]" value="' . MetaFieldModel::DATE_TYPE . '">';
            $field .= '<input type="hidden" name="' . Strings::esc_attr($this->getIdName()) . '[original_name]" value="' . $this->metaField->getName() . '">';
            $date   = '<input autocomplete="off" ' . $this->required() . ' id="' . Strings::esc_attr($this->getIdName()) . '[value]" name="' . Strings::esc_attr($this->getIdName()) . '[value]" value="' . $defaultValue . '" type="text" class="' . $cssClass . '"';
        } else {
            $field  = '<input type="hidden" name="' . Strings::esc_attr($this->getIdName()) . '_type" value="' . MetaFieldModel::DATE_TYPE . '">';
            $date   = '<input autocomplete="off" ' . $this->required() . ' id="' . Strings::esc_attr($this->getIdName()) . '" name="' . Strings::esc_attr($this->getIdName()) . '" type="text" class="' . $cssClass . '" value="' . $defaultValue . '"';
        }

        if ($min) {
            $date .= ' data-min-date="' . DateNormalizer::formatDate($min, $displayFormat) . '"';
        }

        if ($max) {
            $date .= ' data-max-date="' . DateNormalizer::formatDate($max, $displayFormat) . '"';
        }

        $date .= ' data-format="' . $momentFormat . '"';
        $date .= ' data-canonical-format="Y-m-d"';
        $date .= $this->appendDataValidateAndLogicAttributes();
        $date .= '>';

        $field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $date);
        $field .= '<a href="#" data-target-id="' . Strings::esc_attr($this->getIdName()) . '" class="acpt-datepicker-clear">' . Translator::translate("Clear") . '</a>';

        return $this->renderField($field);
    }

    /**
     * Returns the stored canonical date (Y-m-d) re-formatted for display.
     * Falls back to the raw default value when the stored value is not canonical.
     */
    private function defaultDisplayDate(string $displayFormat): ?string
    {
        try {
            $raw = $this->getDefaultValue();

            if (empty($raw)) {
                return null;
            }

            // Canonical stored value — format for display
            $formatted = DateNormalizer::formatDate($raw, $displayFormat);

            if ($formatted !== null) {
                return Strings::esc_attr($formatted);
            }

            // Fallback: try to parse whatever is stored and normalise
            $canonical = DateNormalizer::toDate($raw);

            if ($canonical !== null) {
                return Strings::esc_attr(DateNormalizer::formatDate($canonical, $displayFormat));
            }

            return null;
        } catch (\Exception $e) {
            do_action('acpt/error', $e);
            return null;
        }
    }

    private function enqueueAssets(): void
    {
        wp_enqueue_script('momentjs', plugins_url('acpt-lite/assets/vendor/moment/moment.min.js'), [], '2.18.1', true);
        wp_enqueue_script('daterangepicker-js', plugins_url('acpt-lite/assets/vendor/daterangepicker/js/daterangepicker.min.js'), [], '3.1.0', true);
        wp_enqueue_style('daterangepicker-css', plugins_url('acpt-lite/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');
    }
}
