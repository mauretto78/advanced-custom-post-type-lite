<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\TaxonomyRepository;

class DeleteTaxonomyCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $taxonomy;

	/**
	 * DeleteTaxonomyCommand constructor.
	 *
	 * @param $taxonomy
	 */
	public function __construct($taxonomy)
	{
		$this->taxonomy = $taxonomy;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		TaxonomyRepository::delete($this->taxonomy);
		unregister_taxonomy($this->taxonomy);
	}
}