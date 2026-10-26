<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Utils\Wordpress\WPAttachment;

class Image
{
    /**
     * @param WPAttachment $attachment
     * @param int $width
     * @param int $height
     *
     * @return string
     */
    public static function resize(WPAttachment $attachment, int $width, int $height): string
    {
        try {
            $image = wp_get_image_editor($attachment->getPath());

            if ($image instanceof \WP_Error) {
                return $attachment->getSrc();
            }

            $image->resize($width, $height, true);
            $image->save();

            $pathInfo = pathinfo($attachment->getSrc());

            if (!isset($pathInfo['extension'])) {
                return $attachment->getSrc();
            }

            if (!isset($pathInfo['dirname'])) {
                return $attachment->getSrc();
            }

            // $pathInfo['dirname'] comes from getSrc(), a URL -- always join with a literal
            // forward slash, never a filesystem-path separator constant (backslash on Windows).
            return $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '-'.$width.'x'.$height.'.' . $pathInfo['extension'];
        } catch (\Exception $exception) {
            return $attachment->getSrc();
        }
    }
}
