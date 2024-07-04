<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class TaxonomyMetaShortcode extends AbstractACPTShortcode
{
	/**
	 * @param $atts
	 *
	 * @return mixed|string|null
	 * @throws \Exception
	 */
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

	    if($tid === null){
	    	return null;
	    }

        $taxonomyObject = get_term($tid);
        $taxonomy = $taxonomyObject->taxonomy;

	    return $this->renderShortcode($tid, MetaTypes::TAXONOMY, $taxonomy, $atts);
    }
}

