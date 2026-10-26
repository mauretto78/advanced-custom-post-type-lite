<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class UserMetaShortcode extends AbstractACPTShortcode
{
    /**
     * @param array<string, mixed> $atts
     * @param string|null $content
     * @param string $tag
     * @return string
     */
    public function render(array $atts, ?string $content = null, string $tag = ''): string
    {
        $uid = $atts['uid'];
        $box = $atts['box'];
        $field = $atts['field'];

        if (!$uid || !$box || !$field) {
            return '';
        }

        $uid = isset($atts['uid']) ? $atts['uid'] : get_current_user_id();

        if (!$uid) {
            return '';
        }

        return $this->renderShortcode($uid, MetaTypes::USER, null, $atts) ?? '';
    }
}
