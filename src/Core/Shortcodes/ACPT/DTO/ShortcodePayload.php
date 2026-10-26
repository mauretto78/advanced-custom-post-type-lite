<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT\DTO;

class ShortcodePayload
{
    public string $box = '';
    public string $field = '';
    public string $belongsTo = '';

    /**
     * @var string|int|null
     */
    public $id = null;

    public ?string $find = null;
    public ?string $width = null;
    public ?string $height = null;
    public ?string $target = null;
    public ?string $phoneFormat = null;
    public ?string $dateFormat = null;
    public ?string $timeFormat = null;
    public ?string $elements = null;
    public bool $preview = false;
    public ?string $parent = null;
    public ?string $index = null;
    public ?string $blockName = null;
    public ?string $blockIndex = null;
    public ?string $render = null;
    public ?string $list = null;
    public ?string $classes = null;
    public ?string $separator = null;
    public ?string $adminView = null;
    public ?string $sort = null;
    public bool $isProductAttr = false;
    public ?string $productAttrId = null;
}
