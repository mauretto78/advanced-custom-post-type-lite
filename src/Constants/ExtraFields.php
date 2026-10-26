<?php

namespace ACPT_Lite\Constants;

class ExtraFields
{
    public const ATTACHMENT_ID = 'attachment_id';
    public const CITY = 'city';
    public const COUNTRY = 'country';
    public const CURRENCY = 'currency';
    public const DIAL = 'dial';
    public const FORMAT = 'format';
    public const FORGED_BY = 'forged_by';
    public const ID = 'id';
    public const LABEL = 'label';
    public const LAT = 'lat';
    public const LENGTH = 'length';
    public const LNG = 'lng';
    public const BARCODE_VALUE = 'barcode_value';
    public const QR_CODE_VALUE = 'qr_code_value';
    public const TYPE = 'type';
    public const WEIGHT = 'weight';

    public const ALLOWED_VALUES = [
        self::ATTACHMENT_ID,
        self::BARCODE_VALUE,
        self::CITY,
        self::COUNTRY,
        self::CURRENCY,
        self::DIAL,
        self::FORMAT,
        self::FORGED_BY,
        self::ID,
        self::LAT,
        self::LABEL,
        self::LENGTH,
        self::LNG,
        self::QR_CODE_VALUE,
        self::TYPE,
        self::WEIGHT,
    ];
}
