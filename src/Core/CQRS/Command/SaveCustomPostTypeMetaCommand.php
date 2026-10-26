<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Utils\PHP\Request;

class SaveCustomPostTypeMetaCommand extends AbstractSaveMetaCommand implements CommandInterface
{
    /**
     * @var int
     */
    protected int $postId;

    /**
     * @var array<int, mixed>
     */
    protected array $metaGroups;

    /**
     * @var int|null
     */
    protected ?int $WooCommerceLoopIndex = null;

    /**
     * SaveCustomPostTypeMetaCommand constructor.
     * @param int $postId
     * @param Request $request
     * @param array<int, mixed> $metaGroups
     * @param int|null $WooCommerceLoopIndex
     */
    public function __construct(int $postId, Request $request, array $metaGroups = [], ?int $WooCommerceLoopIndex = null)
    {
        parent::__construct($request);
        $this->postId = $postId;
        $this->metaGroups = $metaGroups;
        $this->WooCommerceLoopIndex = $WooCommerceLoopIndex;
    }

    /**
     * @inheritDoc
     * @throws \Exception
     */
    public function execute()
    {
        $fieldEntries = [];

        foreach ($this->metaGroups as $metaGroup) {

            foreach ($metaGroup->getBoxes() as $boxModel) {
                foreach ($boxModel->getFields() as $fieldModel) {
                    if ($this->hasField($fieldModel) && !$this->isBlankBulkEditField($fieldModel)) {
                        $fieldModel->setBelongsToLabel(MetaTypes::CUSTOM_POST_TYPE);
                        $fieldModel->setFindLabel(get_post_type($this->postId));
                        $elementId = $this->postId;

                        $fieldEntries[] = [
                            'field'     => $fieldModel,
                            'elementId' => $elementId,
                            'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                        ];
                    }
                }
            }
        }

        $this->validateAndSaveFields($fieldEntries);
    }

    /**
     * @param mixed $location
     * @return string
     */
    public function addNoticeQueryVar($location): string
    {
        remove_filter('redirect_post_location', array( $this, 'addNoticeQueryVar' ), 99);

        return add_query_arg(['errors' => true], $location);
    }
}
