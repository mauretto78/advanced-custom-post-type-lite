<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeMetaCommand;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class WPUtils
{
    /**
     * This function is triggered by save_post_xxxx action
     *
     * @param $postId
     * @param MetaGroupModel[] $metaGroups
     * @param null $WooCommerceLoopIndex
     * @throws \Exception
     */
    public static function handleSavePost($postId, $metaGroups = [], $WooCommerceLoopIndex = null)
    {
        if(!empty($_POST)){
            $data = $_POST;
        } else {
            // bulk edit
            if (isset($_REQUEST[ '_wpnonce' ]) and !wp_verify_nonce( $_REQUEST[ '_wpnonce' ], 'bulk-posts')){
                return;
            }

            $data = $_REQUEST;
        }

        if(!empty($data)){
            $command = new SaveCustomPostTypeMetaCommand($postId, $metaGroups, $data, $WooCommerceLoopIndex);
            $command->execute();
        }
    }

	/**
	 * @param $id
	 *
	 * @return bool
	 */
	public static function postExists($id)
	{
		return (new \WP_Query(['post_type' => 'any', 'p' => $id]))->found_posts > 0;
	}

	/**
	 * @param $tid
	 *
	 * @return bool
	 */
	public static function termExists($tid)
	{
		$term = get_term( $tid );

		return $term instanceof \WP_Term;
	}

	/**
	 * @param $uid
	 *
	 * @return bool
	 */
	public static function userExists($uid)
	{
		global $wpdb;

		$count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $wpdb->users WHERE ID = %d", $uid));

		return $count == 1;
	}

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

    /**
     * This function removes <p></p> and \n from a string
     *
     * @param $value
     * @return string|null
     */
    public static function removeEmptyParagraphs($value)
    {
        if(!is_string($value)){
            return null;
        }

        $value = wpautop($value);
        $value = str_replace("<p></p>","", $value);
        $value = str_replace(PHP_EOL,"", $value);

        return $value;
    }
}