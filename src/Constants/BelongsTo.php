<?php

namespace ACPT_Lite\Constants;

class BelongsTo
{
	const PARENT_POST_ID = 'PARENT_POST_ID';
	const POST_ID = 'POST_ID';
	const POST_CAT = 'POST_CAT';
	const POST_TAX = 'POST_TAX';
	const POST_TEMPLATE = 'POST_TEMPLATE';
	const TERM_ID = 'TERM_ID';
	const USER_ID = 'USER_ID';

	const ALLOWED_FORMATS = [
		self::PARENT_POST_ID,
		self::POST_ID,
		self::POST_CAT,
		self::POST_TAX,
		self::POST_TEMPLATE,
		self::TERM_ID,
		self::USER_ID,
		MetaTypes::COMMENT,
		MetaTypes::CUSTOM_POST_TYPE,
		MetaTypes::TAXONOMY,
		MetaTypes::MEDIA,
		MetaTypes::OPTION_PAGE,
		MetaTypes::USER,
	];
}