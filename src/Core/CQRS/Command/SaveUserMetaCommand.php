<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Request;

class SaveUserMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
    /**
     * @var int
     */
    protected int $userId;

    /**
     * @var MetaGroupModel[]
     */
    protected array $metaGroups;

    /**
     * SaveUserMetaCommand constructor.
     *
     * @param int $userId
     * @param Request $request
     * @param array<int, MetaGroupModel> $metaGroups
     */
    public function __construct(int $userId, Request $request, array $metaGroups = [])
    {
        parent::__construct($request);
        $this->userId     = $userId;
        $this->metaGroups = $metaGroups;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $user_id = $this->userId;

        if (!current_user_can('edit_user', $user_id)) {
            return;
        }

        $fieldEntries = [];

        foreach ($this->metaGroups as $metaGroup) {

            foreach ($metaGroup->getBoxes() as $boxModel) {
                foreach ($boxModel->getFields() as $fieldModel) {
                    if ($this->hasField($fieldModel)) {
                        $fieldModel->setBelongsToLabel(MetaTypes::USER);
                        $elementId = $this->userId;

                        $fieldEntries[] = [
                            'field'     => $fieldModel,
                            'elementId' => $elementId,
                            'belongsTo' => MetaTypes::USER,
                        ];
                    }
                }
            }
        }

        $this->validateAndSaveFields($fieldEntries);
    }
}
