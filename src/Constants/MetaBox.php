<?php

namespace ACPT_Lite\Constants;

/**
 * @see https://developer.wordpress.org/reference/functions/add_meta_box/
 */
class MetaBox
{
	// context (default is 'advanced')
	const CONTEXT_NORMAL = 'normal';
	const CONTEXT_SIDE = 'side';
	const CONTEXT_ADVANCED = 'advanced';

	// priority (default is 'default')
	const PRIORITY_HIGH = 'high';
	const PRIORITY_CORE = 'core';
	const PRIORITY_DEFAULT = 'default';
	const PRIORITY_LOW = 'low';
}