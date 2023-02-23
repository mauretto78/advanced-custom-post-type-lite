<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Shortcodes\DTO\ShortcodePayload;
use ACPT_Lite\Core\Shortcodes\Fields\AbstractField;
use ACPT_Lite\Costants\MetaTypes;

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

        $pid = isset($atts['pid']) ? $atts['pid'] : $post->ID;
        $box = $atts['box'];
        $field = $atts['field'];
	    $preview = (isset($atts['preview']) and $atts['preview'] === 'true') ? true : false;

        $key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
        $type = get_post_meta($pid, $key.'_type', true);

        if(get_post_meta($pid, $key, true) === ''){
            return '';
        }

	    $payload = new ShortcodePayload();
	    $payload->id = $pid;
	    $payload->box = $box;
	    $payload->field = $field;
	    $payload->belongsTo = MetaTypes::CUSTOM_POST_TYPE;
	    $payload->find = get_post_type($pid);
	    $payload->preview = $preview;

	    $field = self::getField($type, $payload);

	    return $field->render();
    }
}
