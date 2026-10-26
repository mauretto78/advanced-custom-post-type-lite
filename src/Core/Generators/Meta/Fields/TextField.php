<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextField extends AbstractField
{
    public function render()
    {
        $cssClass = 'regular-text acpt-admin-meta-field-input';

        if ($this->hasErrors()) {
            $cssClass .= ' has-errors';
        }

        if ($this->isChild()) {
            if ($this->isLeadingField()) {
                $cssClass .= ' acpt-leading-field';
            }

            $field = '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TEXT_TYPE.'">';
            $field .= '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
            $text = '<input '.$this->required().' id="'.Strings::esc_attr($this->getIdName()).'[value]" name="'. Strings::esc_attr($this->getIdName()).'[value]" value="'.Strings::esc_attr($this->getDefaultValue()).'" type="text" class="'.$cssClass.'"';
        } else {
            $field = '<input type="hidden" name="'. Strings::esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXT_TYPE.'">';
            $text = '<input '.$this->required().' id="'.Strings::esc_attr($this->getIdName()).'" name="'. Strings::esc_attr($this->getIdName()).'" type="text" class="'.$cssClass.'" value="'.Strings::esc_attr($this->getDefaultValue()).'"';
        }

        $min = $this->getAdvancedOption('min');
        $max = $this->getAdvancedOption('max');
        $pattern = $this->getAdvancedOption('pattern');

        $text .= $this->appendPatternMaxlengthAndMinlength($max, $min, $pattern);
        $text .= $this->appendDataValidateAndLogicAttributes();
        $text .= '>';

        $field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $text);

        return $this->renderField($field);
    }
}
