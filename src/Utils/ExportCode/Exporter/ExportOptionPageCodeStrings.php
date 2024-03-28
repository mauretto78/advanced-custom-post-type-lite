<?php

namespace ACPT_Lite\Utils\ExportCode\Exporter;

use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Utils\ExportCode\DTO\ExportCodeStringsDto;

class ExportOptionPageCodeStrings extends AbstractExportCodeStrings
{
	/**
	 * @param $find
	 *
	 * @return ExportCodeStringsDto
	 * @throws \Exception
	 */
	public function export( $find )
	{
		/** @var OptionPageModel $pageModel */
		$pageModel = @OptionPageRepository::getByMenuSlug($find);

		if(!$pageModel){
			throw new \Exception($find . ' is not a valid option page');
		}

		$parentPageModel = null;
		if($pageModel->getParentId()){
			$parentPageModel = @OptionPageRepository::getById($pageModel->getParentId());
		}

		// WORDPRESS code
		if($pageModel->getParentId()){
			$wordpressCode = '<?php
add_submenu_page(
	\''.$parentPageModel->getMenuSlug().'\',
	\''.$pageModel->getPageTitle().'\',
	\''.$pageModel->getMenuTitle().'\',
	\''.$pageModel->getCapability().'\',
	\''.$pageModel->getMenuSlug().'\',
	function () {
		// write your own code here
	},
	'.$pageModel->getPosition().'
);
';
		} else {
			$wordpressCode = '<?php
add_menu_page(
	\''.$pageModel->getPageTitle().'\',
	\''.$pageModel->getMenuTitle().'\',
	\''.$pageModel->getCapability().'\',
	\''.$pageModel->getMenuSlug().'\',
	function () {
		// write your own code here
	},
	\''.$pageModel->renderIcon().'\',
	'.$pageModel->getPosition().'
);
';
		}

		// ACPT code
		if($pageModel->getParentId()){
			$acptCode = '<?php
register_acpt_option_page([
	\'menu_slug\' => \''.$pageModel->getMenuSlug().'\',
	\'page_title\' => \''.$pageModel->getPageTitle().'\',
	\'menu_title\' => \''.$pageModel->getMenuTitle().'\',
	\'parent\' => \''.$parentPageModel->getMenuSlug().'\',
	\'capability\' => \''.$pageModel->getCapability().'\',
	\'description\' => '.$this->renderDescription($pageModel) . ',
	\'position\' => '.$pageModel->getPosition().',
]);
';
		} else {
			$acptCode = '<?php
register_acpt_option_page([
	\'menu_slug\' => \''.$pageModel->getMenuSlug().'\',
	\'page_title\' => \''.$pageModel->getPageTitle().'\',
	\'menu_title\' => \''.$pageModel->getMenuTitle().'\',
	\'icon\' => \'admin-appearance\',
	\'capability\' => \'manage_options\',
	\'description\' => '.$this->renderDescription($pageModel) . ',
	\'position\' => '.$pageModel->getPosition().',
]);
';
		}

		$dto = new ExportCodeStringsDto();
		$dto->acpt = $acptCode;
		$dto->wordpress = $wordpressCode;

		return $dto;
	}

	/**
	 * @param OptionPageModel $pageModel
	 *
	 * @return string
	 */
	private function renderDescription(OptionPageModel $pageModel)
	{
		if($pageModel->getDescription()){
			return '\''.addslashes($pageModel->getDescription()).'\'';
		}

		return 'null';
	}
}