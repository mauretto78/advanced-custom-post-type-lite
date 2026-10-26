<?php

namespace ACPT_Lite\Core\Shortcodes\ACPT;

use ACPT_Lite\Constants\MetaTypes;

class TaxonomyMetaShortcode extends AbstractACPTShortcode
{
    /**
     * @param array<string, mixed> $atts
     * @param string|null $content
     * @param string $tag
     * @return string
     * @throws \Exception
     */
    public function render(array $atts, ?string $content = null, string $tag = ''): string
    {
        if (!isset($atts['box']) || !isset($atts['field'])) {
            return '';
        }

        $tid = isset($atts['tid']) ? $atts['tid'] : null;

        if ($tid === null) {
            $queriedObject = get_queried_object();

            if (!$queriedObject instanceof \WP_Term) {
                return '';
            }

            $tid = $queriedObject->term_id;
        }

        $taxonomyObject = get_term($tid);

        if (!$taxonomyObject instanceof \WP_Term) {
            return '';
        }

        $taxonomy = $taxonomyObject->taxonomy;

        return $this->renderShortcode($tid, MetaTypes::TAXONOMY, $taxonomy, $atts) ?? '';
    }
}
