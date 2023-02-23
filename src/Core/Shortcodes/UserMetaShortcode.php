<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Shortcodes\DTO\ShortcodePayload;
use ACPT_Lite\Costants\MetaTypes;

class UserMetaShortcode extends AbstractACPTShortcode
{
    public function render($atts)
    {
        $uid = $atts['uid'];
        $box = $atts['box'];
        $field = $atts['field'];
	    $preview = (isset($atts['preview']) and $atts['preview'] === 'true') ? true : false;

        if(!$uid or !$box or !$field){
            return '';
        }

        $key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
        $type = get_user_meta($uid, $key.'_type', true);

        if(!$type){
            return '';
        }

        $payload = new ShortcodePayload();
        $payload->id = $uid;
        $payload->box = $box;
        $payload->field = $field;
        $payload->belongsTo = MetaTypes::USER;
        $payload->preview = $preview;

        $field = self::getField($type, $payload);

        return $field->render();
    }
}