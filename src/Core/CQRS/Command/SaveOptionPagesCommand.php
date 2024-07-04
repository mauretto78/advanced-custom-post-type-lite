<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;

class SaveOptionPagesCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $pages;

	/**
	 * SaveOptionPagesCommand constructor.
	 *
	 * @param array $pages
	 */
	public function __construct(array $pages = [])
	{
		$this->pages = $pages;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$pageSlugs = [];
		$ids = [];

		foreach ($this->pages as $pageIndex => $page ) {

			$pageModel = OptionPageModel::hydrateFromArray([
				'id' => @$page['id'],
				'parentId' => (isset($page['parentId']) ? $page['parentId'] : null),
				'pageTitle' => @$page['pageTitle'],
				'menuTitle' => @$page['menuTitle'],
				'menuSlug' => @$page['menuSlug'],
				'capability' => @$page['capability'],
				'icon' => isset($page['icon']['value']) ? $page['icon']['value'] : $page['icon'],
				'position' => @$page['position'],
				'description' => @$page['description'],
				'sort' => (isset($page['sort']) ? $page['sort'] : $pageIndex+1),
			]);

			$pageModel->setMenuSlug(Strings::getTheFirstAvailableName($pageModel->getMenuSlug(), $pageSlugs));
			$ids[] = $pageModel->getId();
			$pageSlugs[] = $pageModel->getMenuSlug();
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

			OptionPageRepository::save($pageModel);
		}

		// get all ids
		$savedIds = OptionPageRepository::getAllIds();

		foreach ($savedIds as $savedId){
			if(!in_array($savedId, $ids)){
				$orphan = OptionPageRepository::getById($savedId);

				if($orphan){
					MetaRepository::deleteBelongs(MetaTypes::OPTION_PAGE, $orphan->getMenuSlug());
					OptionPageRepository::delete($orphan);
				}
			}
		}

		return $ids;
	}
}