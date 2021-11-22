<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Shortcodes\Fields\AbstractField;

class PostMetaShortcode
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
        $width = isset ($atts['width'] ) ? $atts['width'] : null;
        $height = isset ($atts['height'] ) ? $atts['height'] : null;
        $target = isset ($atts['target'] ) ? $atts['target'] : null;
        $dateFormat = isset ($atts['date-format'] ) ? $atts['date-format'] : null;
        $elements = isset ($atts['elements'] ) ? $atts['elements'] : null;

        $key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
        $type = get_post_meta($pid, $key.'_type', true);

        if(get_post_meta($pid, $key, true) === ''){
            return '';
        }

        $field = self::getCustomPostTypeField($type, $pid, $box, $field, $width, $height, $target, $dateFormat, $elements);

        return  $field->render();
    }

    /**
     * @param string $type
     * @param int    $pid
     * @param string $box
     * @param string $field
     * @param string $width
     * @param string $height
     * @param string $target
     * @param string $dateFormat
     *
     * @return AbstractField
     */
    private function getCustomPostTypeField($type, $pid, $box, $field, $width, $height, $target, $dateFormat, $elements)
    {
        $className = 'ACPT_Lite\\Core\\Shortcodes\\Fields\\'.$type.'Field';

        return new $className($pid, $box, $field, $width, $height, $target, $dateFormat, $elements);
    }
}
