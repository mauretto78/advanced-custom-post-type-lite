<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

class CopyOptionPageCommand
{
	/**
	 * @var string
	 */
	private $targetPageId;

	/**
	 * @var string
	 */
	private $pageId;

	/**
	 * @var bool
	 */
	private $deletePage;

	public function __construct($data)
	{
		$validationRules = [
			'targetPageId' => [
				'required' => true,
				'type' => 'string',
			],
			'pageId' => [
				'required' => true,
				'type' => 'string',
			],
			'deletePage' => [
				'required' => false,
				'type' => 'boolean',
			],
		];

		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate($validationRules, $data)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}

		$this->targetPageId = $data['targetPageId'];
		$this->pageId       = $data['pageId'];
		$this->deletePage   = $data['deletePage'] ? $data['deletePage'] : false;
	}
	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$targetPage = OptionPageRepository::getById($this->targetPageId);
		$page = OptionPageRepository::getById($this->pageId);

		if($targetPage === null){
			throw new \Exception("Parent page not found");
		}

		if($page === null){
			throw new \Exception("Target page not found");
		}

		// don't copy first level pages
		if($page->hasChildren()){
			return;
		}

		$newPage = $page->duplicate();
		$newPage->changeParentId($this->targetPageId);
		$targetPage->addChild($newPage);

		OptionPageRepository::save($targetPage);

		if($this->deletePage){
			OptionPageRepository::delete($page);
		}
	}

}