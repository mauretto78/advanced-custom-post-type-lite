<?php

namespace ACPT_Lite\Utils;

class WPUtils
{
    /**
     * This function replaces locate_template function
     * in order to fix undefined constants issue
     *
     * @see https://developer.wordpress.org/reference/functions/locate_template/
     *
     * @param $template_names
     * @param bool $load
     * @param bool $require_once
     * @param array $args
     * @return string
     */
    public static function locateTemplate( $template_names, $load = false, $require_once = true, $args = array() )
    {
        $located = '';
        foreach ( (array) $template_names as $template_name ) {
            if ( ! $template_name ) {
                continue;
            }
            if ( file_exists( get_stylesheet_directory() . '/' . $template_name ) ) {
                $located = get_stylesheet_directory() . '/' . $template_name;
                break;
            } elseif ( file_exists( get_template_directory() . '/' . $template_name ) ) {
                $located = get_template_directory() . '/' . $template_name;
                break;
            } elseif ( file_exists( ABSPATH . WPINC . '/theme-compat/' . $template_name ) ) {
                $located = ABSPATH . WPINC . '/theme-compat/' . $template_name;
                break;
            }
        }

        if ( $load && '' !== $located ) {
            load_template( $located, $require_once, $args );
        }

        return $located;
    }
}