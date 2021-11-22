<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\MetaBoxFieldModel;

class EmailField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-envelope';
        $field = '<input type="hidden" name="'. $this->getIdName().'_type" value="'.MetaBoxFieldModel::EMAIL_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.$this->getIdName().'" name="'. $this->getIdName().'" type="email" class="acpt-admin-meta-field-input" value="'.$this->getDefaultValue().'">';

        echo $this->renderField($icon, $field);
    }
}