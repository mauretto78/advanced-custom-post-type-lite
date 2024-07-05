<?php

namespace ACPT_Lite\Constants;

class MetaTypes
{
    const META = 'meta';
    const CUSTOM_POST_TYPE = 'customPostType';
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
		    self::META => 'Meta',
		    self::CUSTOM_POST_TYPE => 'CPT',
		    self::TAXONOMY => 'TAX',
		    self::USER => 'USER',
	    ];

    	if(!isset($map[$value])){
    		return null;
	    }

    	return $map[$value];
    }
}