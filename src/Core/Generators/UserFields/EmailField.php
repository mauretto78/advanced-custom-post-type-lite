<?php

namespace ACPT_Lite\Core\Generators\UserFields;

use ACPT_Lite\Core\Models\MetaField\MetaBoxFieldOptionModel;

class EmailField extends AbstractField implements UserMetaFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-envelope';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaBoxFieldOptionModel::EMAIL_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" value="'.esc_attr($this->getDefaultValue()).'" type="email" class="regular-text" />';

        echo $this->renderField($icon, $field);
    }
}