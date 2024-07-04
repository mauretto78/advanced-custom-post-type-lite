<?php

class ACPT_Divi_Assets
{
    /**
     * Force load Gallery module assets.
     *
     * @param array $list        Modules list.
     *
     * @return array Filtered modules list.
     */
    public static function enqueue_assets( $list )
    {
        array_push( $list, 'et_pb_gallery' );

        return $list;
    }

    public static function add_required_slugs( $list, $all_content ) {

	    // @TODO to be implemented

	    return $list;
    }
}