<?php

namespace ACPT_Lite\Utils\Data;

class WooCommerceNormalizer
{
    /**
     * @param $postId
     *
     * @return array
     */
    public static function objectToArray($postId, $related = true)
    {
        $WooCommerceProduct = new \WC_Product($postId);

        $galleryImages = [];
        $attachment_ids = $WooCommerceProduct->get_gallery_image_ids();
        foreach( $attachment_ids as $attachmentId ){
            $galleryImages[] = wp_get_attachment_url( $attachmentId );
        }

        $upSells = [];
        $crossSells = [];

        if($related){
            foreach( $WooCommerceProduct->get_upsell_ids() as $upsellId ){
                $upSells[] = self::objectToArray($upsellId, false);
            }

            foreach( $WooCommerceProduct->get_cross_sell_ids() as $crossSellId ){
                $crossSells[] = self::objectToArray($crossSellId, false);
            }
        }

        return [
                'sku' => $WooCommerceProduct->get_sku(),
                'image_id' => $WooCommerceProduct->get_image_id(),
                'image' => $WooCommerceProduct->get_image(),
                'image_url' => wp_get_attachment_url( $WooCommerceProduct->get_image_id() ),
                'gallery_image_ids' => $WooCommerceProduct->get_gallery_image_ids(),
                'gallery_images' => $galleryImages,
                'price' => $WooCommerceProduct->get_price(),
                'price_html' => $WooCommerceProduct->get_price_html(),
                'title' => $WooCommerceProduct->get_title(),
                'rating' => $WooCommerceProduct->get_average_rating(),
                'attributes' => $WooCommerceProduct->get_attributes(),
                'meta' => $WooCommerceProduct->get_meta_data(),
                'upsell_ids' => $WooCommerceProduct->get_upsell_ids(),
                'upsells' => $upSells,
                'cross_sell_ids' => $WooCommerceProduct->get_cross_sell_ids(),
                'cross_sells' => $crossSells,
        ];
    }
}