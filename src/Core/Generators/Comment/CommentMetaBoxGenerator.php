<?php

namespace ACPT_Lite\Core\Generators\Comment;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;

class CommentMetaBoxGenerator extends AbstractGenerator
{
    /**
     * @var MetaBoxModel
     */
    private MetaBoxModel $boxModel;

    /**
     * CommentMetaBoxGenerator constructor.
     *
     * @param MetaBoxModel $boxModel
     */
    public function __construct(MetaBoxModel $boxModel)
    {
        $this->boxModel = $boxModel;
    }

    /**
     * Attach this box to front-end form
     *
     * @return void
     */
    public function generate(): void
    {
        add_filter('comment_form_field_comment', function ($html) {
            $html .= '<div class="acpt-comment-fields-wrapper">';

            foreach (array_reverse($this->boxModel->getFields()) as $metaField) {
                $generator = new CommentMetaFieldGenerator($metaField);
                $field = $generator->render();

                if ($field !== null) {
                    $html .= $field;
                }
            }

            $html .= '</div>';

            return $html;
        }, 999, 1);
    }
}
