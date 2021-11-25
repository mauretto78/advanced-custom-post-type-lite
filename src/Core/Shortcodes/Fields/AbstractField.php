<?php

namespace ACPT_Lite\Core\Shortcodes\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Includes\ACPT_Lite_Loader;

abstract class AbstractField
{
    /**
     * @var int
     */
    protected $pid;

    /**
     * @var string
     */
    protected $box;

    /**
     * @var string
     */
    protected $field;

    /**
     * @var ?string
     */
    protected $width;

    /**
     * @var ?string
     */
    protected $height;

    /**
     * @var ?string
     */
    protected $target;

    /**
     * @var ?string
     */
    protected $dateFormat;

    /**
     * @var ?int
     */
    protected $elements;

    /**
     * @var string
     */
    protected $key;

    /**
     * AbstractField constructor.
     *
     * @param        $pid
     * @param        $box
     * @param        $field
     * @param null   $width
     * @param null   $height
     * @param null   $target
     * @param null   $dateFormat
     * @param null   $elements
     */
    public function __construct($pid, $box, $field, $width = null, $height = null, $target = null, $dateFormat = null, $elements = null)
    {
        $this->pid = $pid;
        $this->box = $box;
        $this->field = $field;
        $this->width = $width;
        $this->height = $height;
        $this->target = $target;
        $this->dateFormat = $dateFormat;
        $this->elements = $elements;
        $this->key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
    }

    abstract public function render();
}