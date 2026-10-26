<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Query\FetchMetaGroupsQuery;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\PHP\Request;

class SaveTaxonomyMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
    /**
     * @var int
     */
    protected int $termId;

    /**
     * SaveTaxonomyMetaCommand constructor.
     *
     * @param int $termId
     * @param Request $request
     */
    public function __construct(int $termId, Request $request)
    {
        parent::__construct($request);
        $this->termId = $termId;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $termId = $this->termId;
        $taxonomyObject = get_term($termId);

        if ($taxonomyObject instanceof \WP_Error) {
            throw new \Exception("Term not found: ". $taxonomyObject->get_error_message());
        }

        $taxonomy = $taxonomyObject->taxonomy;

        $taxonomyMetaGroups = (new FetchMetaGroupsQuery([
            'belongsTo' => MetaTypes::TAXONOMY,
            'find' => $taxonomy,
            'clonedFields' => true,
            'cct' => true,
        ]))->execute();

        $termMetaGroups = (new FetchMetaGroupsQuery([
            'belongsTo' => BelongsTo::TERM_ID,
            'find' => $termId,
            'clonedFields' => true,
            'cct' => true,
        ]))->execute();

        /** @var MetaGroupModel[] $metaGroups */
        $metaGroups = array_merge($taxonomyMetaGroups, $termMetaGroups);

        $fieldEntries = [];

        foreach ($metaGroups as $metaGroup) {

            foreach ($metaGroup->getBoxes() as $metaBoxModel) {
                foreach ($metaBoxModel->getFields() as $fieldModel) {
                    if ($this->hasField($fieldModel)) {
                        $fieldModel->setBelongsToLabel(MetaTypes::TAXONOMY);
                        $fieldModel->setFindLabel($taxonomy);
                        $elementId = $this->termId;

                        $fieldEntries[] = [
                            'field'     => $fieldModel,
                            'elementId' => $elementId,
                            'belongsTo' => MetaTypes::TAXONOMY,
                        ];
                    }
                }
            }
        }

        $this->validateAndSaveFields($fieldEntries);
    }
}
