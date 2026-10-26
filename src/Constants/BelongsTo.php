<?php

namespace ACPT_Lite\Constants;

class BelongsTo
{
    public const PARENT_POST_ID = 'PARENT_POST_ID';
    public const POST_ID = 'POST_ID';
    public const POST_CAT = 'POST_CAT';
    public const POST_TAX = 'POST_TAX';
    public const POST_TEMPLATE = 'POST_TEMPLATE';
    public const POST_FORMAT = 'POST_FORMAT';
    public const TERM_ID = 'TERM_ID';
    public const USER_ID = 'USER_ID';

    public const ALLOWED_FORMATS = [
        self::PARENT_POST_ID,
        self::POST_ID,
        self::POST_CAT,
        self::POST_TAX,
        self::POST_TEMPLATE,
        self::POST_FORMAT,
        self::TERM_ID,
        self::USER_ID,
        MetaTypes::COMMENT,
        MetaTypes::CUSTOM_POST_TYPE,
        MetaTypes::TAXONOMY,
        MetaTypes::MEDIA,
        MetaTypes::USER,
    ];
}
