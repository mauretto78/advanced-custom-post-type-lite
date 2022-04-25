<?php

namespace ACPT_Lite\Core\Shortcodes\UserFields;

use ACPT_Lite\Core\Helper\Strings;

abstract class AbstractField
{
    /**
     * @var int
     */
    protected $uid;

    /**
     * @var string
     */
    protected $box;

    /**
     * @var string
     */
    protected $field;

    /**
     * @var string
     */
    protected $key;

    /**
     * AbstractField constructor.
     *
     * @param $uid
     * @param $box
     * @param $field
     */
    public function __construct($uid, $box, $field)
    {
        $this->uid = $uid;
        $this->box = $box;
        $this->field = $field;
        $this->key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
    }

    abstract public function render();
}