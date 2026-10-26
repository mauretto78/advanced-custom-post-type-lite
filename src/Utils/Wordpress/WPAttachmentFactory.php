<?php

namespace ACPT_Lite\Utils\Wordpress;

class WPAttachmentFactory
{
    /**
     * Retrieves an attachment object based on the provided value.
     *
     * @param mixed $value Numeric/int attachment ID, non-numeric string URL, or an associative array with 'url'
     *                     and optionally 'attachment_id' keys. Any other type returns an empty WPAttachment.
     * @return WPAttachment The WPAttachment object created from the provided URL or attachment ID.
     */
    public static function create($value): WPAttachment
    {
        if (is_numeric($value)) {
            return WPAttachment::fromId((int)$value);
        }

        if (is_string($value)) {
            return WPAttachment::fromUrl($value);
        }

        if (!is_array($value)) {
            return new WPAttachment();
        }

        if (!isset($value['url'])) {
            return new WPAttachment();
        }

        $url = $value['url'];
        $attachmentId = $value['attachment_id'] ?? null;

        if (!empty($attachmentId)) {
            return WPAttachment::fromId($attachmentId);
        }

        return WPAttachment::fromUrl($url);
    }
}
