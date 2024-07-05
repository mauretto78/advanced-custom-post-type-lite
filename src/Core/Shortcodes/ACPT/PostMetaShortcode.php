<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class PostMetaShortcode extends AbstractACPTShortcode
{
    /**
     * @param array $atts
     *
     * @return string
     * @throws \Exception
     */
    public function render($atts)
    {
        global $post;

        if(!isset($atts['box']) or !isset($atts['field'])){
            return '';
        }

        if(!isset($atts['pid']) and $post === null){
            return '';
        }

        $pid = isset($atts['pid']) ? $atts['pid'] : $post->ID;

        if($post === null){
            $post = get_post((int)$pid);
        }

        if($post === null){
            return '';
        }

	    $postType = $post->post_type;

	    return $this->renderShortcode($pid, MetaTypes::CUSTOM_POST_TYPE, $postType, $atts);
    }
}
