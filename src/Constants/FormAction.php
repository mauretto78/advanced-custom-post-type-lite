<?php

namespace ACPT_Lite\Constants;

class FormAction
{
	const EMAIL = 'EMAIL';
	const PHP = 'PHP';
	const AJAX = 'AJAX';
	const CUSTOM = 'CUSTOM';
	const FILL_META = 'FILL_META';

	const ALLOWED_VALUES = [
		self::EMAIL,
		self::PHP,
		self::AJAX,
		self::CUSTOM,
		self::FILL_META,
	];
}