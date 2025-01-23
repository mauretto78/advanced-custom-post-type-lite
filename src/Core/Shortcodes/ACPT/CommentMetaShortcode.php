<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class CommentMetaShortcode extends AbstractACPTShortcode
{
    public function render($atts)
    {
        $cid = $atts['cid'];
        $box = $atts['box'];
        $field = $atts['field'];

        if(!$cid or !$box or !$field){
            return '';
        }

	    return $this->renderShortcode($cid, MetaTypes::COMMENT, null, $atts);
    }
}