<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class CommentMetaShortcode extends AbstractACPTShortcode
{
    /**
     * @param array<string, mixed> $atts
     * @param string|null $content
     * @param string $tag
     * @return string
     */
    public function render(array $atts, ?string $content = null, string $tag = ''): string
    {
        $cid = $atts['cid'];
        $box = $atts['box'];
        $field = $atts['field'];

        if (!$cid || !$box || !$field) {
            return '';
        }

        return $this->renderShortcode($cid, MetaTypes::COMMENT, null, $atts) ?? '';
    }
}
