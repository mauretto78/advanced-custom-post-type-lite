<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\DatasetRepository;

class DeleteDatasetCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $id;

	/**
	 * DeleteFormCommand constructor.
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
		DatasetRepository::delete($this->id);
	}
}