<?php

namespace ACPT_Lite\Core\Generators\TaxonomyFields;

use ACPT_Lite\Core\Generators\Contracts\MetaFieldInterface;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxFieldModel;

class TextField extends AbstractTaxonomyField implements MetaFieldInterface
{
    public function render()
    {
        $icon = 'bx:bx-text';
        $field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.TaxonomyMetaBoxFieldModel::TEXT_TYPE.'">';
        $field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" value="'.esc_attr($this->getDefaultValue()).'" type="text" class="regular-text"';
	    $field .= '>';

        echo $this->renderField($icon, $field);
    }
}