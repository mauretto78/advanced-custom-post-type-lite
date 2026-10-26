<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class AfterAndBeforeFieldGenerator extends AbstractGenerator
{
    /**
     * @param MetaFieldModel $metaField
     * @param string $html
     * @param string|null $style
     *
     * @return string
     */
    public function generate(MetaFieldModel $metaField, string $html, ?string $style = null): string
    {
        if (!$metaField->canHaveAfterAndBefore()) {
            return $html;
        }

        $after = $metaField->getAdvancedOption('after');
        $before = $metaField->getAdvancedOption('before');

        if (empty($after) && empty($before)) {
            return $html;
        }

        $return = '<div class="acpt-before-and-after-wrapper" style="'.$style.'">';

        if (!empty($before)) {
            $return .= "<div class='before'>".Strings::htmlspecialchars($before)."</div>";
        }

        $return .= $html;

        if (!empty($after)) {
            $return .= "<div class='after'>".Strings::htmlspecialchars($after)."</div>";
        }

        $return .= '</div>';

        return $return;
    }
}
