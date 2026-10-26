<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class AttachmentMetaShortcode extends AbstractACPTShortcode
{
    /**
     * @param array<string, mixed> $atts
     * @param string|null $content
     * @param string $tag
     * @return string
     * @throws \Exception
     */
    public function render(array $atts, ?string $content = null, string $tag = ''): string
    {
        if (!isset($atts['box']) || !isset($atts['field'])) {
            return '';
        }

        if (!isset($atts['pid'])) {
            return '';
        }

        $pid = $atts['pid'];
        $postType = 'attachment';

        return $this->renderShortcode($pid, MetaTypes::MEDIA, $postType, $atts) ?? '';
    }
}
