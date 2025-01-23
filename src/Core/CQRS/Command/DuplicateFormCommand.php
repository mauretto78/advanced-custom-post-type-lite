<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\FormRepository;

class DuplicateFormCommand implements CommandInterface
{
    /**
     * @var string
     */
    private $id;

    /**
     * DuplicateFormCommand constructor.
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
        $formModel = FormRepository::getById($this->id);

        if(empty($formModel)){
            throw new \Exception("Form not found");
        }

        $newDatasetModel = $formModel->duplicate();

        FormRepository::save($newDatasetModel);
    }
}