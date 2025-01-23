<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\DatasetRepository;

class DuplicateDatasetCommand implements CommandInterface
{
    /**
     * @var string
     */
    private $id;

    /**
     * DuplicateDatasetCommand constructor.
     * @param $id
     */
    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed|void
     * @throws \Exception
     */
    public function execute()
    {
        $datasetModel = DatasetRepository::getById($this->id);

        if(empty($datasetModel)){
            throw new \Exception("Dataset not found");
        }

        $newDatasetModel = $datasetModel->duplicate();

        DatasetRepository::save($newDatasetModel);
    }
}