<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\CustomPostTypeRepository;

class RegeneratePostLabelsCommand implements CommandInterface
{
    /**
     * @var
     */
    private string $postType;

    /**
     * RegeneratePostLabelsCommand constructor.
     * @param string $postType
     */
    public function __construct(string $postType)
    {
        $this->postType = $postType;
    }

    /**
     * @return array|mixed
     * @throws \Exception
     */
    public function execute()
    {
        $customPostTypeModel = CustomPostTypeRepository::get([
            'postType' => $this->postType,
        ]);

        if(empty($customPostTypeModel)){
            throw new \Exception("Post type not found");
        }

        $customPostTypeModel = $customPostTypeModel[0];
        $labels = $customPostTypeModel->defaultLabels();
        $customPostTypeModel->setLabels($labels);

        CustomPostTypeRepository::save($customPostTypeModel);
    }
}