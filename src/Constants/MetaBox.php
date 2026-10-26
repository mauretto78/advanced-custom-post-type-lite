<?php

namespace ACPT_Lite\Constants;

/**
 * @see https://developer.wordpress.org/reference/functions/add_meta_box/
 */
class MetaBox
{
    // context (default is 'advanced')
    public const CONTEXT_NORMAL = 'normal';
    public const CONTEXT_SIDE = 'side';
    public const CONTEXT_ADVANCED = 'advanced';

    // priority (default is 'default')
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_CORE = 'core';
    public const PRIORITY_DEFAULT = 'default';
    public const PRIORITY_LOW = 'low';
}
