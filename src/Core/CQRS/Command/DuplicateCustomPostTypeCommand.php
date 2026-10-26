<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class DuplicateCustomPostTypeCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $postType;

    /**
     * DeleteCustomPostTypeCommand constructor.
     *
     * @param string $postType
     */
    public function __construct(string $postType)
    {
        $this->postType = $postType;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        $postType = CustomPostTypeRepository::get([
            'postType' => $this->postType
        ]);

        if (empty($postType)) {
            throw new \Exception("Post type not found");
        }

        $postTypeModel = $postType[0];
        $newPostTypeModel = $postTypeModel->duplicate();

        CustomPostTypeRepository::save($newPostTypeModel);

        foreach ($newPostTypeModel->getTaxonomies() as $taxonomyModel) {
            TaxonomyRepository::assocToPostType($newPostTypeModel->getId(), $taxonomyModel->getId());
        }
    }
}
