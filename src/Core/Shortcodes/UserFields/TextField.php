<?php

namespace ACPT_Lite\Core\Shortcodes\UserFields;

class TextField extends AbstractField
{
    public function render()
    {
        return get_user_meta($this->uid, $this->key, true);
    }
}