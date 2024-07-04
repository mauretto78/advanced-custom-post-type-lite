<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;

class SaveOptionPageCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $page;

	/**
	 * SaveOptionPagesCommand constructor.
	 *
	 * @param array $page
	 */
	public function __construct(array $page = [])
	{
		$this->page = $page;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$pageSlugs = OptionPageRepository::getAllSlugs();
		$page = $this->page;

		foreach ($pageSlugs as $index => $pageSlug){
			if($page['menuSlug'] === $pageSlug){
				unset($pageSlugs[$index]);
			}
		}

		$pageModel = OptionPageModel::hydrateFromArray([
			'id' => @$page['id'],
			'parentId' => (isset($page['parentId']) ? $page['parentId'] : null),
			'pageTitle' => @$page['pageTitle'],
			'menuTitle' => @$page['menuTitle'],
			'menuSlug' => @$page['menuSlug'],
			'capability' => @$page['capability'],
			'icon' => (isset($page['icon']) ? $page['icon'] : null),
			'position' => @$page['position'],
			'description' => @$page['description'],
			'sort' => (isset($page['sort']) ? $page['sort'] : OptionPageRepository::count()+1),
		]);

		$pageModel->setMenuSlug(Strings::getTheFirstAvailableName($pageModel->getMenuSlug(), $pageSlugs));
		$pageSlugs = [];

		if(isset($page['children'])){

			$childPosition = @$page['position'];

			foreach ($page['children'] as $childIndex => $child){

				$childPosition = $childPosition + 1;

				$childPageModel = OptionPageModel::hydrateFromArray([
					'id' => @$child['id'],
					'parentId' => $pageModel->getId(),
					'pageTitle' => @$child['pageTitle'],
					'menuTitle' => @$child['menuTitle'],
					'menuSlug' => @$child['menuSlug'],
					'capability' => @$child['capability'],
					'position' => $childPosition,
					'description' => @$child['description'],
					'sort' => (isset($child['sort']) ? $child['sort'] : $childIndex+1),
				]);

				$childPageModel->setMenuSlug(Strings::getTheFirstAvailableName($childPageModel->getMenuSlug(), $pageSlugs));
				$ids[] = $childPageModel->getId();
				$pageSlugs[] = $childPageModel->getMenuSlug();

				$pageModel->addChild($childPageModel);
			}
		}

		OptionPageRepository::save($pageModel);

		return $pageModel->getId();
	}
}