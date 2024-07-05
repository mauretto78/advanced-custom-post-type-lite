<?php

namespace ACPT_Lite\Utils\PHP;

class Code
{
    /**
     * @param string $html
     *
     * @return string
     */
    public static function htmlToPhp($html)
    {
        $html = self::convertWordPressTags($html);
	    $html = self::convertWooCommerceTags($html);
	    $html = self::convertThemeTags($html);
	    $html = self::convertACPTTags($html);
	    $html = self::convertACPTLoopTags($html);

	    return $html;
    }

    /**
     * @param string $html
     *
     * @return string
     */
    private static function convertWordPressTags($html)
    {
	    $html = str_replace('{{wp_term_name}}', '[wp_term_name]', $html);
        $html = str_replace('{{wp_term_description}}', '[wp_term_description]', $html);
        $html = str_replace('{{wp_title}}', '[wp_title]', $html);
        $html = str_replace('{{wp_content}}', '[wp_content]', $html);
        $html = str_replace('{{wp_excerpt}}', '[wp_excerpt]', $html);
        $html = str_replace('{{wp_author}}', '[wp_author]', $html);
        $html = str_replace('{{wp_date}}', '[wp_date]', $html);
        $html = str_replace('{{wp_thumbnail}}', '[wp_thumbnail]', $html);
        $html = str_replace('{{wp_permalink}}', '[wp_permalink]', $html);
        $html = str_replace('{{wp_taxonomy}}', '<?php do_action("acpt_taxonomy_links"); ?>', $html);
        $html = str_replace('{{wp_navigation_links}}', '<?php do_action("acpt_prev_next_links"); ?>', $html);
        $html = str_replace('{{acpt_breadcrumbs}}', '<?php do_action("acpt_breadcrumb"); ?>', $html);

        preg_match_all('/{{wp_date format[^}}]*}}/', $html, $dateFormats);

        if(!empty($dateFormats[0])){
            foreach ($dateFormats[0] as $index => $dateFormat){
                preg_match('/format=\"[a-zA-Z0-9\-\/\.\s+]+\"/', $dateFormat, $format);

                if(!empty($format[0])){
                    $html = str_replace($dateFormat, '[wp_date '. $format[0].']', $html);
                }
            }
        }

        preg_match_all('/{{wp_thumbnail format[^}}]*}}/', $html, $thumbnailFormats);

        if(!empty($thumbnailFormats[0])){
            foreach ($thumbnailFormats[0] as $index => $thumbnailFormat){
                preg_match('/format=\"[a-zA-Z0-9\-\/\.\s+]+\"/', $thumbnailFormat, $format);

                if(!empty($format[0])){
                    $html = str_replace($thumbnailFormat, '[wp_thumbnail '. $format[0].']', $html);
                }
            }
        }

        preg_match_all('/{{wp_permalink[^}}]*}}/', $html, $permalinks);

        if(!empty($permalinks[0])){
            foreach ($permalinks[0] as $index => $permalink){

            	$permalinkShortcode = '[wp_permalink';

                preg_match('/anchor=\"[a-zA-Z0-9\-\/\.\s+]+\"/', $permalink, $anchor);

                if(!empty($anchor[0])){
	                $permalinkShortcode .= ' ' . $anchor[0];
                }

                preg_match('/target=\"[a-zA-Z0-9_\-\/\.\s+]+\"/', $permalink, $target);

                if(!empty($target[0])){
	                $permalinkShortcode .= ' ' . $target[0];
                }

	            $permalinkShortcode .= ']';

                $html = str_replace($permalink, $permalinkShortcode, $html);
            }
        }

        preg_match_all('/{{acpt_breadcrumb[^}}]*}}/', $html, $breadcrumbs);

        if(!empty($breadcrumbs[0])){
            foreach ($breadcrumbs[0] as $index => $breadcrumb){
                preg_match('/separator=\"[a-zA-Z0-9;&\-\/.\s+]+\"/', $breadcrumb, $separator);

                if(!empty($separator[0])){
                    $html = str_replace($breadcrumb, '<?php do_action("acpt_breadcrumb", "'.str_replace(['separator="', '"'], '', $separator[0]).'"); ?>', $html);
                }
            }
        }

        return $html;
    }

	/**
	 * @param string $html
	 *
	 * @return string
	 */
    private static function convertACPTLoopTags($html)
    {
    	$tags = [
    		'acpt-loop',
    		'acpt-tax-loop',
    		'acpt-field-loop',
    		'acpt-block-loop',
	    ];

    	foreach ($tags as $tag){
		    preg_match_all('/<'.$tag.'[^>]*>/', $html, $loops);

		    if(!empty($loops[0])) {
			    foreach ( $loops[ 0 ] as $index => $loop ) {
			    	$newTag = str_replace('-','_', $tag);
				    $shortcode = str_replace('<'.$tag, '['.$newTag, $loop);
				    $shortcode = str_replace('>', ']', $shortcode);

				    $html = str_replace($loop, $shortcode, $html);
				    $html = str_replace('</'.$tag.'>', '[/'.$newTag.']', $html);
			    }
		    }
	    }

	    return $html;
    }

    /**
     * @param string $html
     *
     * @return string
     */
    private static function convertWooCommerceTags( $html)
    {
        $html = str_replace('{{wc_breadcrumb}}', "<?php add_action('woocommerce_before_main_content', 'woocommerce_breadcrumb'); ?>", $html);
        $html = str_replace('{{wc_sale_flash}}', "<?php add_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash'); ?>", $html);
        $html = str_replace('{{wc_product_images}}', "<?php add_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images'); ?>", $html);
        $html = str_replace('{{wc_product_thumbnails}}', "<?php add_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_thumbnails'); ?>", $html);
        $html = str_replace('{{wc_product_sku}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_sku'); ?>", $html);
        $html = str_replace('{{wc_product_title}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_title'); ?>", $html);
        $html = str_replace('{{wc_product_rating}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_rating'); ?>", $html);
        $html = str_replace('{{wc_product_price}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_price'); ?>", $html);
        $html = str_replace('{{wc_product_excerpt}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_excerpt'); ?>", $html);
        $html = str_replace('{{wc_add_to_cart}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart'); ?>", $html);
        $html = str_replace('{{wc_sharing}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_sharing'); ?>", $html);
        $html = str_replace('{{wc_product_meta}}', "<?php add_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta'); ?>", $html);
        $html = str_replace('{{wc_product_data_tabs}}', "<?php add_action('woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs'); ?>", $html);
        $html = str_replace('{{wc_product_upsell}}', "<?php add_action('woocommerce_after_single_product_summary', 'woocommerce_upsell_display'); ?>", $html);
        $html = str_replace('{{wc_product_related}}', "<?php add_action('woocommerce_after_single_product_summary', 'woocommerce_output_related_products'); ?>", $html);
        $html = str_replace('<wc-product-summary>', '<?php while ( have_posts() ) : the_post(); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_title\', 5 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_rating\', 10 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_price\', 10 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_excerpt\', 20 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_add_to_cart\', 30 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_meta\', 40 , 0); remove_action( \'woocommerce_single_product_summary\', \'woocommerce_template_single_sharing\', 50 , 0); ?>', $html);
        $html = str_replace('</wc-product-summary>', '<?php do_action( \'woocommerce_single_product_summary\' ); endwhile; ?>', $html);
        $html = str_replace('<wp-before-main-content>', '<?php while ( have_posts() ) : the_post(); remove_action( \'woocommerce_before_single_product_summary\', \'woocommerce_show_product_sale_flash\', 10 , 0); remove_action( \'woocommerce_before_single_product_summary\', \'woocommerce_show_product_images\', 20 , 0); remove_action( \'woocommerce_before_single_product_summary\', \'woocommerce_show_product_thumbnails\', 10 , 0); ?>', $html);
        $html = str_replace('</wp-before-main-content>', '<?php do_action( \'woocommerce_before_single_product_summary\' ); endwhile; ?>', $html);
        $html = str_replace('<wc-before-product-summary>','<?php remove_action( \'woocommerce_before_main_content\', \'woocommerce_breadcrumb\', 20, 0 ); ?>', $html);
        $html = str_replace('</wc-before-product-summary>','<?php do_action( \'woocommerce_before_main_content\' ); ?>', $html);
        $html = str_replace('<wc-after-product-summary>','<?php while ( have_posts() ) : the_post(); remove_action( \'woocommerce_after_single_product_summary\', \'woocommerce_output_product_data_tabs\', 10 , 0); remove_action( \'woocommerce_after_single_product_summary\', \'woocommerce_upsell_display\', 15 , 0); remove_action( \'woocommerce_after_single_product_summary\', \'woocommerce_output_related_products\', 20 , 0); ?>', $html);
        $html = str_replace('</wc-after-product-summary>','<?php do_action( \'woocommerce_after_single_product_summary\' ); endwhile; ?>', $html);

        return $html;
    }

    /**
     * @param string $html
     *
     * @return string
     */
    private static function convertThemeTags($html)
    {
        $html = str_replace('{{header}}', "<?php get_header(); ?>", $html);
        $html = str_replace('{{footer}}', "<?php get_footer(); ?>", $html);

        preg_match_all('/{{template_part[^}}]*}}/', $html, $templateParts);

        if(!empty($templateParts[0])){
            foreach ($templateParts[0] as $index => $templatePart){
                $html = str_replace($templatePart, "<?php dynamic_sidebar('".str_replace(['{{template_part="', '"}}'],'', $templatePart)."'); ?>", $html);
            }
        }

        preg_match_all('/{{header[^}}]*}}/', $html, $headers);

        if(!empty($headers[0])){
            foreach ($headers[0] as $index => $header){
                $html = str_replace($header, "<?php get_header('".str_replace(['{{header name="', '"}}'],'', $header)."'); ?>", $html);
            }
        }

        preg_match_all('/{{footer[^}}]*}}/', $html, $footers);

        if(!empty($footers[0])){
            foreach ($footers[0] as $index => $footer){
                $html = str_replace($footer, "<?php get_footer('".str_replace(['{{footer name="', '"}}'],'', $footer)."'); ?>", $html);
            }
        }

        return $html;
    }

    /**
     * @param string $html
     *
     * @return string
     */
    private static function convertACPTTags($html)
    {
        preg_match_all('/{{acpt[^}}]*}}/', $html, $acptTags);

        if(!empty($acptTags[0])){
            foreach ($acptTags[0] as $index => $acptTag){
                $html = str_replace($acptTag, "[".str_replace(['{{', '}}'],'', $acptTag)."]", $html);
            }
        }

        return $html;
    }

    public static function phpToHtml($php)
    {
        // @TODO to be implemented
    }
}

