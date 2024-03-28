<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Shortcodes\DTO\ShortcodePayload;
use ACPT_Lite\Constants\MetaTypes;

class TaxonomyMetaShortcode extends AbstractACPTShortcode
{
    public function render($atts)
    {
        if(!isset($atts['box']) or !isset($atts['field'])){
            return '';
        }

        $tid = isset($atts['tid']) ? $atts['tid'] : null;

        if($tid === null){
            $queriedObject = get_queried_object();

            if(!$queriedObject instanceof \WP_Term){
                return null;
            }

            $tid = $queriedObject->term_id;
        }

        $taxonomyObject = get_term($tid);
        $taxonomy = $taxonomyObject->taxonomy;

        $box = $atts['box'];
        $field = $atts['field'];
        $preview = (isset($atts['preview']) and $atts['preview'] === 'true') ? true : false;

        $key = Strings::toDBFormat($box).'_'.Strings::toDBFormat($field);
        $type = get_term_meta($tid, $key.'_type', true);
        $data = get_term_meta($tid, $key, true);

        if($data === null or $data === ''){
            return '';
        }

        if(!empty($type)){
            $payload = new ShortcodePayload();
            $payload->id = $tid;
            $payload->box = $box;
            $payload->field = $field;
            $payload->belongsTo = MetaTypes::TAXONOMY;
            $payload->find = $taxonomy;
            $payload->preview = $preview;

            $field = self::getField($type, $payload);

            return $field->render();
        }

        return null;
    }
}

