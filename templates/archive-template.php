<?php
/**
 * The Template for displaying archive custom post type page
 *
 * This template can be overridden by copying it to yourtheme/archive-{custom-post-type-slug}.php.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/templates
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */

defined( 'ABSPATH' ) || exit;

global $post;

get_header( $post->post_type );
do_action( 'acpt_before_main_content' );
do_action( 'acpt_archive_loop' );
do_action( 'acpt_after_main_content' );
get_footer( $post->post_type );
