<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\OptionPageRepository;

class DuplicateOptionPageCommand implements CommandInterface
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
		$optionPage = OptionPageRepository::getById($this->id);

		if(empty($optionPage)){
			throw new \Exception("Wrong option page id");
		}

        $newOptionPage = $optionPage->duplicate();

		OptionPageRepository::save($newOptionPage);
	}
}