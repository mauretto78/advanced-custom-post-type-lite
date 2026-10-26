<?php

namespace ACPT_Lite\Constants;

class Operator
{
    public const EQUALS = '=';
    public const NOT_EQUALS = '!=';
    public const LT = '<';
    public const GT = '>';
    public const LTE = '<=';
    public const GTE = '>=';
    public const LIKE = 'LIKE';
    public const NOT_LIKE = 'NOT_LIKE';
    public const IN = 'IN';
    public const NOT_IN = 'NOT_IN';
    public const NULL = 'NULL';
    public const NOT_NULL = 'NOT_NULL';
    public const BLANK = 'BLANK';
    public const NOT_BLANK = 'NOT_BLANK';
    public const CHECKED = 'CHECKED';
    public const NOT_CHECKED = 'NOT_CHECKED';

    public const ALLOWED_VALUES = [
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
