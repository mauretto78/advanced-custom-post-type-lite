<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\TaxonomyRepository;

class AssocTaxonomyToCustomPostTypeCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $postId;

	/**
	 * @var string
	 */
	private $taxonomyId;

	/**
	 * @var bool
	 */
	private bool $checked;

	/**
	 * AssocTaxonomyToCustomPostTypeCommand constructor.
	 *
	 * @param $postId
	 * @param $taxonomyId
	 * @param bool $checked
	 */
	public function __construct($postId, $taxonomyId, $checked = true)
	{
		$this->postId = $postId;
		$this->taxonomyId = $taxonomyId;
		$this->checked = $checked;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		if($this->checked){
			TaxonomyRepository::assocToPostType($this->postId, $this->taxonomyId);
		} else {
			TaxonomyRepository::removeAssocPost($this->postId, $this->taxonomyId);
		}
	}
}