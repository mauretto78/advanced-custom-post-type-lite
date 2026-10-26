<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\MetaRepository;

class DeleteMetaGroupCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $id;

    /**
     * DeleteMetaGroupCommand constructor.
     *
     * @param string $id
     */
    public function __construct(string $id)
    {
        $this->id = $id;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute(): void
    {
        MetaRepository::deleteMetaGroup($this->id);
    }
}
