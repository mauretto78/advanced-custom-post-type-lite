<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\MetaBoxFieldModel;

class TextField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-text';
        $field = '<input type="hidden" name="'. esc_html($this->getIdName()).'_type" value="'.MetaBoxFieldModel::TEXT_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.esc_html($this->getIdName()).'" name="'. esc_html($this->getIdName()).'" type="text" class="acpt-admin-meta-field-input" value="'.esc_html($this->getDefaultValue()).'">';

        echo $this->renderField($icon, $field);
    }
}