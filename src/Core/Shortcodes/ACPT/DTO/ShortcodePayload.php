<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT_Lite\DTO;

class ShortcodePayload
{
	public $box;
	public $field;
	public $belongsTo;
	public $id;
	public $find = null;
    public $width = null;
    public $height = null;
    public $target = null;
    public $dateFormat = null;
    public $timeFormat = null;
    public $elements = null;
    public $preview = false;
    public $parent = null;
    public $index = null;
    public $blockName = null;
    public $blockIndex = null;
    public $render = null;
    public $list = null;
    public $classes = null;
    public $separator = null;
    public $adminView = null;
}
