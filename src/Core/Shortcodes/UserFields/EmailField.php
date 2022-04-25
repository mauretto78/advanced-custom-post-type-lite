<?php

namespace ACPT_Lite\Core\Shortcodes\UserFields;

class EmailField extends AbstractField
{
    public function render()
    {
        return '<a href="mailto:'.get_user_meta($this->uid, $this->key, true).'">'.get_user_meta($this->uid, $this->key, true).'</a>';
    }
}