<?php

namespace ACPT_Lite\Core\Generators\Fields;

use ACPT_Lite\Core\Models\MetaBoxFieldModel;

class SelectField extends AbstractField implements CustomPostTypeFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-select-multiple';
        $field = '<input type="hidden" name="'. $this->getIdName().'_type" value="'.MetaBoxFieldModel::SELECT_TYPE.'">';
        $field .= '<select '.$this->required().' id="'.$this->getIdName().'" name="'. $this->getIdName().'" class="select2 acpt-admin-meta-field-input">';
        $field .= '<option value="">--Seleziona--</option>';

        foreach ($this->options as $option){
            $selected = ($option['value'] === $this->getDefaultValue()) ? 'selected="selected"' : '';
            $field .= '<option '.$selected.' value="'.$option['value'].'">'.$option['label'].'</option>';
        }

        $field .= '</select>';

        echo $this->renderField($icon, $field);
    }
}