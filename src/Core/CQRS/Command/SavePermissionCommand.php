<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Permission\PermissionModel;
use ACPT_Lite\Core\Repository\PermissionRepository;

class SavePermissionCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SavePermissionCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data)
	{
		$this->data = $data;
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function execute()
	{
		PermissionRepository::deleteByEntityId($this->data['entityId']);

		if(isset($this->data['items']) and is_array($this->data['items'])){
			foreach ($this->data['items'] as $index => $item){
				$permissionModel = new PermissionModel(
					$item['id'],
					$this->data['entityId'],
					$item['userRole'],
					$item['permissions'],
					($index+1)
				);

				PermissionRepository::save($permissionModel);
			}
		}
	}
}