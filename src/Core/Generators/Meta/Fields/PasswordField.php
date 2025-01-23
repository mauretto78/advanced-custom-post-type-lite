<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class PasswordField extends AbstractField
{
    public function render()
    {
        $cssClass = 'regular-text acpt-admin-meta-field-input';

        if($this->hasErrors()){
            $cssClass .= ' has-errors';
        }

        if($this->isChild() or $this->isNestedInABlock()){

            if($this->isLeadingField()){
                $cssClass .= ' acpt-leading-field';
            }

            $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::PASSWORD_TYPE.'">';
            $field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
            $text = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" type="password" class="'.$cssClass.'"';
        } else {
            $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::PASSWORD_TYPE.'">';
            $text = '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="password" class="'.$cssClass.'"';
        }

        $text .= $this->appendDataValidateAndLogicAttributes();
        $text .= '>';

        $field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, $text);

        return $this->renderField($field);
    }
}