<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\CustomPostTypeMetaBoxFieldModel;

class EmailField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-envelope';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="' . CustomPostTypeMetaBoxFieldModel::EMAIL_TYPE . '">';
        $field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="email" class="acpt-admin-meta-field-input" value="'.esc_attr($this->getDefaultValue()).'">';

        echo $this->renderField($icon, $field);
    }
}