<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Core\CQRS\Command\SaveCustomPostTypeMetaCommand;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

class WPUtils
{
    /**
     * This function is triggered by save_post_xxxx action
     *
     * @param int $postId
     * @param string $postType
     * @param MetaGroupModel[] $metaGroups
     * @param int|null $WooCommerceLoopIndex
     * @throws \Exception
     */
    public static function handleSavePost(int $postId, string $postType, array $metaGroups = [], ?int $WooCommerceLoopIndex = null): void
    {
        $command = new SaveCustomPostTypeMetaCommand($postId, ACPT_Lite_Plugin::getRequest(), $metaGroups, $WooCommerceLoopIndex);
        $command->execute();

        // Invalid cache
        Posts::invalidPostsByTypeQueryCache($postType);
        Posts::invalidCache();

        if ($postType === "attachment") {
            $attachment = WPAttachment::fromId($postId);

            WPAttachment::invalidCache($attachment->getId());
            WPAttachment::invalidCache($attachment->getSrc());
        }
    }

    /**
     * @param string|int $id
     * @return bool
     */
    public static function postExists($id): bool
    {
        return (new \WP_Query(['post_type' => 'any', 'p' => $id]))->found_posts > 0;
    }

    /**
     * @param int $tid
     * @return bool
     */
    public static function termExists(int $tid): bool
    {
        $term = get_term($tid);

        return $term instanceof \WP_Term;
    }

    /**
     * @param string|int $uid
     * @return bool
     */
    public static function userExists($uid): bool
    {
        global $wpdb;

        $count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $wpdb->users WHERE ID = %d", $uid));

        return $count == 1;
    }

    /**
     * Prevent errors if $value is not a string
     *
     * @param string $value
     * @param bool $nl2br
     * @return string
     */
    public static function renderShortCode(string $value, bool $nl2br = false): string
    {
        if ($nl2br === true) {
            $value = nl2br($value);
        }

        return do_shortcode($value);
    }

    /**
     * This function removes <p></p> and \n from a string
     *
     * @param string $value
     * @return string|null
     */
    public static function removeEmptyParagraphs(string $value): ?string
    {
        $value = wpautop($value);
        $value = str_replace("<p></p>", "", $value);
        $value = str_replace(PHP_EOL, "", $value);

        return $value;
    }

    /**
     * @return string
     */
    public static function logo(): string
    {
        $siteName = get_bloginfo('name');
        $siteUrl = get_bloginfo('url');

        if (has_custom_logo()) {
            $imageUrl = wp_get_attachment_image_url(
                get_theme_mod('custom_logo'),
                'full'
            );

            return '<a href="'.esc_url($siteUrl).'"><img class="logo" src="' . ($imageUrl) . '" alt="' . $siteName . '"></a>';
        }

        $imageUrl = get_site_icon_url(512);

        if (!empty($imageUrl)) {
            return '<a href="'.esc_url($siteUrl).'"><img class="logo" src="' . ($imageUrl) . '" alt="' . $siteName . '"></a>';
        }

        return "<h1><a href='".esc_url($siteUrl)."'>{$siteName}</a></h1>";
    }
}
