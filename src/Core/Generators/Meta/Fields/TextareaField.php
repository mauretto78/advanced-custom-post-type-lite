<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class TextareaField extends AbstractField
{
    /**
     * @inheritDoc
     */
    public function render()
    {
        $cssClass = 'regular-text acpt-admin-meta-field-input';

        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TEXTAREA_TYPE.'">';
        $field .= '<textarea '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" class="'.$cssClass.'" rows="8" cols="50"';

        $field .= '>';
        $field .= esc_attr($this->getDefaultValue()).'</textarea>';

        return $this->renderField($field);
    }
}
