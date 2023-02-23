<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class SelectField extends AbstractField
{
    public function render()
    {
	    return $this->fetchMeta($this->getKey());
    }
}