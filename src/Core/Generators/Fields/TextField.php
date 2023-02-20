<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\CustomPostTypeMetaBoxFieldModel;

class TextField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-text';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="' . CustomPostTypeMetaBoxFieldModel::TEXT_TYPE . '">';
        $field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="text" class="acpt-admin-meta-field-input" value="'.esc_attr($this->getDefaultValue()).'">';

        echo $this->renderField($icon, $field);
    }
}