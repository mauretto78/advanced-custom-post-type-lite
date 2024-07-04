<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\OptionPage\OptionPageModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Data\Formatter\Formatter;

class ExportDataCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private string $format;

	/**
	 * @var array
	 */
	private array $data;

	/**
	 * ExportDataCommand constructor.
	 *
	 * @param $format
	 * @param array $data
	 */
	public function __construct($format, array $data)
	{
		$this->format = $format;
		$this->data = $data;
	}

	/**
	 * @return mixed|string
	 * @throws \Exception
	 */
	public function execute()
	{
		$items = [
			MetaTypes::CUSTOM_POST_TYPE => [],
			MetaTypes::TAXONOMY => [],
			MetaTypes::OPTION_PAGE => [],
			MetaTypes::META => [],
		];

		$format = $this->format;
		$dataToExport = $this->data;

		foreach ($dataToExport as $type => $data){
			foreach ($data as $datum){
				if($datum['type'] === MetaTypes::META and $datum['checked'] === true){

					/** @var MetaGroupModel $metaGroupModel */
					$metaGroupModel = @MetaRepository::get([
						'id' => $datum['id']
					])[0];

					if($metaGroupModel !== null){
						$items[MetaTypes::META][] = $metaGroupModel->arrayRepresentation();
					}
				}

				if($datum['type'] === MetaTypes::CUSTOM_POST_TYPE and $datum['checked'] === true){
					/** @var CustomPostTypeModel $customPostTypeModel */
					$customPostTypeModel = @CustomPostTypeRepository::get([
						'id' => $datum['id']
					])[0];

					if($customPostTypeModel !== null){
						$items[MetaTypes::CUSTOM_POST_TYPE][] = $customPostTypeModel->arrayRepresentation();
					}
				}

				if($datum['type'] === MetaTypes::TAXONOMY and $datum['checked'] === true){
					/** @var TaxonomyModel $taxonomyModel */
					$taxonomyModel = @TaxonomyRepository::get([
						'id' => $datum['id']
					])[0];

					if($taxonomyModel !== null){
						$items[MetaTypes::TAXONOMY][] = $taxonomyModel->arrayRepresentation();
					}
				}

				if($datum['type'] === MetaTypes::OPTION_PAGE and $datum['checked'] === true){
					/** @var OptionPageModel $optionPageModel */
					$optionPageModel = @OptionPageRepository::getById($datum['id']);

					if($optionPageModel !== null){
						$items[MetaTypes::OPTION_PAGE][] = $optionPageModel->arrayRepresentation();
					}
				}
			}
		}

		return Formatter::format($format, $items);
	}
}