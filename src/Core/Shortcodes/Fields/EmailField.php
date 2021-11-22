<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

class EmailField extends AbstractField
{
    public function render()
    {
        return '<a href="mailto:'.get_post_meta($this->pid, $this->key, true).'">'.get_post_meta($this->pid, $this->key, true).'</a>';
    }
}