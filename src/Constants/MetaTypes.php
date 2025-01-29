<?php

namespace ACPT_Lite\Constants;

class MetaTypes
{
    const COMMENT = 'comment';
    const MEDIA = 'media';
    const META = 'meta';
    const CUSTOM_POST_TYPE = 'customPostType';
    const OPTION_PAGE = 'optionPage';
    const TAXONOMY = 'taxonomy';
    const USER = 'user';

	/**
	 * @param $value
	 *
	 * @return string|null
	 */
    public static function label($value)
    {
    	$map = [
		    self::COMMENT => 'Comment',
		    self::MEDIA => 'Media',
		    self::META => 'Meta',
		    self::CUSTOM_POST_TYPE => 'CPT',
		    self::OPTION_PAGE => 'OP',
		    self::TAXONOMY => 'TAX',
		    self::USER => 'USER',
	    ];

    	if(!isset($map[$value])){
    		return null;
	    }

    	return $map[$value];
    }
}