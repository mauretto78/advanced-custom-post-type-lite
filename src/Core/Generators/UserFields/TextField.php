<?php

namespace ACPT_Lite\Core\Generators\UserFields;

use ACPT_Lite\Core\Models\User\UserMetaBoxFieldModel;

class TextField extends AbstractField implements UserMetaFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-text';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.UserMetaBoxFieldModel::TEXT_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" value="'.esc_attr($this->getDefaultValue()).'" type="text" class="regular-text" />';

        echo $this->renderField($icon, $field);
    }
}