<?php

namespace ACPT_Lite\Core\Generators\UserFields;

use ACPT_Lite\Core\Models\UserMetaFieldModel;
use ACPT_Lite\Core\Models\UserMetaFieldOptionModel;

class SelectField extends AbstractField implements UserMetaFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-select-multiple';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.UserMetaFieldModel::SELECT_TYPE.'">';
        $field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="select2 regular-text">';
        $field .= '<option value="">--Select--</option>';

        /** @var UserMetaFieldOptionModel $option */
        foreach ($this->options as $option){
            $selected = ($option->getValue() === $this->getDefaultValue()) ? 'selected="selected"' : '';
            $field .= '<option '.$selected.' value="'.esc_attr($option->getValue()).'">'.esc_html($option->getLabel()).'</option>';
        }

        $field .= '</select>';

        echo $this->renderField($icon, $field);
    }
}