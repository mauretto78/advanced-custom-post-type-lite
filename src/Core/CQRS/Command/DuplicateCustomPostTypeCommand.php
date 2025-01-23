<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class DuplicateCustomPostTypeCommand implements CommandInterface
{
    /**
     * @var string
     */
    private $postType;

    /**
     * DeleteCustomPostTypeCommand constructor.
     *
     * @param $postType
     */
    public function __construct($postType)
    {
        $this->postType = $postType;
    }

    /**
     * @return mixed|void
     * @throws \Exception
     */
    public function execute()
    {
        $postType = CustomPostTypeRepository::get([
            'postType' => $this->postType
        ]);

        if(empty($postType)){
            throw new \Exception("Post type not found");
        }

        $postTypeModel = $postType[0];
        $newPostTypeModel = $postTypeModel->duplicate();

        CustomPostTypeRepository::save($newPostTypeModel);

        foreach ($newPostTypeModel->getTaxonomies() as $taxonomyModel){
            TaxonomyRepository::assocToPostType($newPostTypeModel->getId(), $taxonomyModel->getId());
        }
    }
}