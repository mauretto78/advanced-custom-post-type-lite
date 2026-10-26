<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextareaField extends AbstractField
{
    /**
     * @inheritDoc
     */
    public function render()
    {
        $min = $this->getAdvancedOption('min');
        $max = $this->getAdvancedOption('max');
        $cols = $this->getAdvancedOption('cols') ? ceil($this->getAdvancedOption('cols')) : 50;
        $rows = $this->getAdvancedOption('rows') ? ceil($this->getAdvancedOption('rows')) : 8;
        $value = $this->getDefaultValue();
        $cssClass = 'regular-text acpt-textarea acpt-admin-meta-field-input';

        if ($this->isLeadingField()) {
            $cssClass .= ' acpt-leading-field';
        }

        if ($this->isChild()) {
            $field = '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
            $field .= '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
            $textarea = '<textarea '.$this->required().' id="'.Strings::esc_attr($this->getIdName()).'[value]" name="'. Strings::esc_attr($this->getIdName()).'[value]" class="'.$cssClass.'" rows="'.$rows.'" cols="'.$cols.'"';
        } else {
            $field = '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
            $textarea = '<textarea '.$this->required().' id="'.Strings::esc_attr($this->getIdName()).'" name="'. Strings::esc_attr($this->getIdName()).'" class="'.$cssClass.'" rows="'.$rows.'" cols="'.$cols.'"';
        }

        $textarea .= $this->appendPatternMaxlengthAndMinlength($max, $min);
        $textarea .= $this->appendDataValidateAndLogicAttributes();
        $textarea .= '>';

        $textarea .= Strings::esc_attr($value).'</textarea>';
        $textarea .= $this->characterCounter($value, $max, $min);

        $field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $textarea);

        return $this->renderField($field);
    }

    /**
     * @param mixed $value
     * @param mixed $max
     * @param mixed $min
     * @return string|null
     */
    private function characterCounter($value = null, $max = null, $min = null)
    {
        if (empty($max) && empty($min)) {
            return null;
        }

        $css = '';
        $strLen = (!empty($value)) ? strlen($value) : 0;

        if ((!empty($max) && $strLen >= $max) || $strLen < $min) {
            $css = 'danger';
        } elseif (!empty($max) && $strLen >= $max-5) {
            $css = 'warning';
        }

        return '<div data-min="'.$min.'" data-max="'.$max.'" class="acpt-textarea-ch-counter"><span class="count '.$css.'">'.(!empty($value && is_string($value)) ? strlen($value) : 0).'</span>/<span class="max">'.($max ? $max : "∞").'</span></div>';
    }
}
