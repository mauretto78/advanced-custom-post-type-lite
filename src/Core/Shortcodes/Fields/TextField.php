<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class TextField extends AbstractField
{
    public function render()
    {
	    return do_shortcode($this->fetchMeta($this->getKey()));
    }
}