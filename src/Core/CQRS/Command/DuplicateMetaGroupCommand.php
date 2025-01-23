<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\MetaRepository;

class DuplicateMetaGroupCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $id;

	/**
	 * DeleteMetaGroupCommand constructor.
	 *
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
	    $group = MetaRepository::get([
	        'id' => $this->id
        ]);

        if(empty($group)){
            throw new \Exception("Meta group not found");
        }

        $groupModel = $group[0];
        $newGroupModel = $groupModel->duplicate();

        MetaRepository::saveMetaGroup($newGroupModel);
	}
}