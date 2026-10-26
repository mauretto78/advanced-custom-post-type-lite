<?php

namespace ACPT_Lite\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CommentMetaFieldGenerator extends AbstractGenerator
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $fieldModel;

    /**
     * @var mixed
     */
    private $commentId;

    /**
     * AttachmentMetaFieldGenerator constructor.
     *
     * @param MetaFieldModel $fieldModel
     * @param int|null       $commentId
     */
    public function __construct(MetaFieldModel $fieldModel, ?int $commentId = null)
    {
        $this->fieldModel = $fieldModel;
        $this->commentId = $commentId;
    }

    /**
     * @param string $for
     *
     * @return string|null
     */
    public function render($for = "frontEnd")
    {
        $field = $this->getCommentMetaField();

        if ($field) {
            $render = $field->render();

            if ($for === "backEnd") {
                return $render;
            }

            return preg_replace('/width: \d+\%\;|width: \d+\%/', '', $render);
        }

        return null;
    }

    /**
     * @return AbstractField|null
     */
    public function getCommentMetaField()
    {
        $notAllowed = [];

        if (in_array($this->fieldModel->getType(), $notAllowed)) {
            return null;
        }

        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$this->fieldModel->getType().'Field';
        $commentId = $this->commentId ? $this->commentId : 0;

        if (class_exists($className)) {
            /** @var AbstractField $instance */
            $instance = new $className($this->fieldModel, MetaTypes::COMMENT, $commentId);

            return $instance;
        }

        return null;
    }
}
