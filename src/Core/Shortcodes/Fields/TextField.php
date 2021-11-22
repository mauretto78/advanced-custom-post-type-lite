<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class TextField extends AbstractField
{
    public function render()
    {
        return get_post_meta($this->pid, $this->key, true);
    }
}