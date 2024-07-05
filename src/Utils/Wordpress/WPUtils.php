<?php

namespace ACPT_Lite\Utils\Wordpress;

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

	/**
	 * @param string $content
	 * @param int    $id
	 * @param array  $options
	 *
	 * @return false|string
	 */
	public static function renderWpEditor( $content, $id, array $options = array() )
	{
		ob_start();
		wp_editor(wp_unslash($content), $id, $options);

		return ob_get_clean();
	}

	/**
	 * Prevent errors if $value is not a string
	 *
	 * @param $value
	 * @param bool $nl2br
	 *
	 * @return string|null
	 */
	public static function renderShortCode($value, $nl2br = false)
	{
		if(!is_string($value)){
			return null;
		}

		if($nl2br === true){
			$value = nl2br($value);
		}

		return do_shortcode($value);
	}
}