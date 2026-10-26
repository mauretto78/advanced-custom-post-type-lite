<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\Logic;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class CustomPostTypeMetaGroupsGenerator
{
    /**
     * @var MetaGroupModel[]
     */
    private array $metaGroupModels = [];

    /**
     * @var string|null
     */
    private ?string $postType = null;

    /**
     * CustomPostTypeMetaGroupsGenerator constructor.
     *
     * @param string|null $postType
     * @param MetaGroupModel[] $metaGroupModels
     */
    public function __construct(?string $postType, array $metaGroupModels)
    {
        $this->metaGroupModels = $metaGroupModels;
        $this->postType = $postType;
    }

    /**
     * @param bool $render
     * @return MetaGroupModel[]
     * @throws \Exception
     */
    public function generate(bool $render = true): array
    {
        $groups = [];

        foreach ($this->metaGroupModels as $metaGroupModel) {
            $cptBelongs = [];
            $otherAndConditions = false;
            $allowedConditions = [
                MetaTypes::MEDIA,
                MetaTypes::CUSTOM_POST_TYPE,
                BelongsTo::PARENT_POST_ID,
                BelongsTo::POST_ID,
                BelongsTo::POST_TEMPLATE,
                BelongsTo::POST_TAX,
                BelongsTo::POST_CAT,
            ];

            foreach ($metaGroupModel->getBelongs() as $index => $belong) {

                // allow only cpt belongs
                if (in_array($belong->getBelongsTo(), $allowedConditions)) {
                    $cptBelongs[] = $belong;
                } else {
                    if ($belong->getLogic() === Logic::AND) {
                        $otherAndConditions = true;
                    }

                    if (isset($metaGroupModel->getBelongs()[$index-1]) && $metaGroupModel->getBelongs()[$index-1]->getLogic() === Logic::AND) {
                        $otherAndConditions = true;
                    }
                }
            }

            if ($otherAndConditions === false) {
                $groups[] = $metaGroupModel;

                if ($render && $this->postType !== 'attachment') {
                    $generator = new CustomPostTypeMetaGroupGenerator($metaGroupModel, $this->postType);
                    $generator->render();
                }
            }

            $this->renderForAttachments();
        }

        return $groups;
    }

    /**
     * Render meta fields for attachments
     *
     * @return void
     * @throws \Exception
     */
    private function renderForAttachments(): void
    {
        add_filter("attachment_fields_to_edit", function ($formFields, $post) {
            $postId = $post->ID;
            $meta_groups = MetaRepository::get([]);

            foreach ($meta_groups as $meta_group) {
                if ($meta_group->isVisible([
                    'post_id' => $postId
                ])) {
                    foreach ($meta_group->getBoxes() as $meta_box_model) {
                        foreach ($meta_box_model->getFields() as $fieldModel) {
                            $fieldGenerator = CustomPostTypeMetaBoxFieldGenerator::generate($fieldModel, $postId);

                            $formFields[$fieldModel->getDbName()] = array(
                                "label" => $fieldModel->getLabelOrName(),
                                "input" => "html",
                                "value" => get_post_meta($postId, $fieldModel->getDbName(), true),
                                "html" => $fieldGenerator->render()
                            );
                        }
                    }
                }
            }

            return $formFields;
        }, 10, 2);

        add_filter('attachment_fields_to_save', function ($post, $attachment) {
            $postId = $post['post_ID'] ?? $post['ID'];

            if (!empty($postId)) {
                $metaGroups = MetaRepository::get([]);
                $metaGroups = array_filter($metaGroups, function (MetaGroupModel $metaGroup) use ($postId) {
                    return $metaGroup->isVisible([
                            'post_id' => $postId
                    ]);
                });

                WPUtils::handleSavePost((int)$postId, 'attachment', $metaGroups);
            }

            return $post;
        }, 10, 2);
    }
}
