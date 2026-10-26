<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Request;

class SaveCommentMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
    /**
     * @var int
     */
    protected int $commentId;

    /**
     * @var MetaGroupModel[]
     */
    protected array $metaGroups;

    /**
     * SaveCommentMetaCommand constructor.
     *
     * @param int $commentId
     * @param Request $request
     * @param array<int, mixed> $metaGroups
     */
    public function __construct(int $commentId, Request $request, array $metaGroups = [])
    {
        parent::__construct($request);
        $this->commentId  = $commentId;
        $this->metaGroups = $metaGroups;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $fieldEntries = [];

        foreach ($this->metaGroups as $metaGroup) {
            foreach ($metaGroup->getBoxes() as $boxModel) {
                foreach ($boxModel->getFields() as $fieldModel) {
                    if ($this->hasField($fieldModel)) {
                        $fieldModel->setBelongsToLabel(MetaTypes::COMMENT);
                        $elementId = $this->commentId;

                        $fieldEntries[] = [
                            'field'     => $fieldModel,
                            'elementId' => $elementId,
                            'belongsTo' => MetaTypes::COMMENT,
                        ];
                    }
                }
            }
        }

        $this->validateAndSaveFields($fieldEntries);
    }
}
