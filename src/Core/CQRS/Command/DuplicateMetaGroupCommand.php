<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\MetaRepository;

class DuplicateMetaGroupCommand implements CommandInterface
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
        $group = MetaRepository::get([
            'id' => $this->id
        ]);

        if (empty($group)) {
            throw new \Exception("Meta group not found");
        }

        $groupModel = $group[0];
        $newGroupModel = $groupModel->duplicate();

        MetaRepository::saveMetaGroup($newGroupModel);
    }
}
