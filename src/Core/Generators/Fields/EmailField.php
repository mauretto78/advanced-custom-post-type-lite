<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\MetaBoxFieldModel;

class EmailField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-envelope';
        $field = '<input type="hidden" name="'. esc_html($this->getIdName()).'_type" value="'.MetaBoxFieldModel::EMAIL_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.esc_html($this->getIdName()).'" name="'. esc_html($this->getIdName()).'" type="email" class="acpt-admin-meta-field-input" value="'.esc_html($this->getDefaultValue()).'">';

        echo $this->renderField($icon, $field);
    }
}