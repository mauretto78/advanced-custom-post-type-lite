<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class EmailField extends AbstractField
{
    public function render()
    {
	    return '<a href="mailto:'.$this->fetchMeta($this->getKey()).'">'.$this->fetchMeta($this->getKey()).'</a>';
    }
}