<?php

namespace ACPT_Lite\Constants;

class MetaTypes
{
    public const COMMENT = 'comment';
    public const MEDIA = 'media';
    public const META = 'meta';
    public const FIELDS = 'fields';
    public const CUSTOM_POST_TYPE = 'customPostType';
    public const TAXONOMY = 'taxonomy';
    public const USER = 'user';

    /**
     * @param string $value
     *
     * @return string|null
     */
    public static function label(string $value): ?string
    {
        $map = [
            self::COMMENT => 'Comment',
            self::MEDIA => 'Media',
            self::META => 'Meta',
            self::FIELDS => 'Fields',
            self::CUSTOM_POST_TYPE => 'CPT',
            self::TAXONOMY => 'TAX',
            self::USER => 'USER',
        ];

        if (!isset($map[$value])) {
            return null;
        }

        return $map[$value];
    }
}
