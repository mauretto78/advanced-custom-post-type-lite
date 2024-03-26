<?php

namespace ACPT_Lite\Constants;

class Operator
{
	const EQUALS = '=';
	const NOT_EQUALS = '!=';
	const LT = '<';
	const GT = '>';
	const LTE = '<=';
	const GTE = '>=';
	const LIKE = 'LIKE';
	const NOT_LIKE = 'NOT_LIKE';
	const IN = 'IN';
	const NOT_IN = 'NOT_IN';
	const NULL = 'NULL';
	const NOT_NULL = 'NOT_NULL';
	const BLANK = 'BLANK';
	const NOT_BLANK = 'NOT_BLANK';
	const CHECKED = 'CHECKED';
	const NOT_CHECKED = 'NOT_CHECKED';

	const ALLOWED_VALUES = [
		self::EQUALS,
		self::NOT_EQUALS,
		self::LT,
		self::GT,
		self::LTE,
		self::GTE,
		self::LIKE,
		self::NOT_LIKE,
		self::IN,
		self::NOT_IN,
		self::NULL,
		self::NOT_NULL,
		self::BLANK,
		self::NOT_BLANK,
		self::CHECKED,
		self::NOT_CHECKED,
	];
}