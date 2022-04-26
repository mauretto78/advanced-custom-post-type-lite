<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Helper\Strings;

class UserMetaShortcode
{
    public function render($atts)
    {
        $uid = $atts['uid'];
        $box = $atts['box'];
        $field = $atts['field'];

        if(!$uid or !$box or !$field){
            return '';
        }

        $key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
        $type = get_user_meta($uid, $key.'_type', true);

        if(!$type){
            return '';
        }

        $field = self::getUserField($type, $uid, $box, $field);

        if($field){
            return $field->render();
        }

        return '';
    }

    /**
     * @param $type
     * @param $uid
     * @param $box
     * @param $field
     *
     * @return null
     */
    private function getUserField($type, $uid, $box, $field)
    {
        $className = 'ACPT_Lite\\Core\\Shortcodes\\UserFields\\'.$type.'Field';

        if(class_exists($className)){
            return new $className($uid, $box, $field);
        }

        return null;
    }
}