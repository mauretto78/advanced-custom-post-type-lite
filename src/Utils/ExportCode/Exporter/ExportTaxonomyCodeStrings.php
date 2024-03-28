<?php

namespace ACPT_Lite\Utils\ExportCode\Exporter;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\ExportCode\DTO\ExportCodeStringsDto;

class ExportTaxonomyCodeStrings extends AbstractExportCodeStrings
{
	/**
	 * @param $find
	 *
	 * @return ExportCodeStringsDto
	 * @throws \Exception
	 */
	public function export( $find )
	{
		/** @var TaxonomyModel $taxonomyModel */
		$taxonomyModel = @TaxonomyRepository::get([
			'taxonomy' => $find,
		])[0];

		if(!$taxonomyModel){
			throw new \Exception($find . ' is not a valid taxonomy');
		}

		$slug = $taxonomyModel->getSlug();
		$taxonomyName = ucwords($slug);
		$plural = $taxonomyModel->getPlural();
		$options = array_merge(
			[
				'singular_label' => $taxonomyModel->getSingular(),
				'label' => $taxonomyModel->getPlural(),
				'labels' => $taxonomyModel->getLabels(),
			],
			$taxonomyModel->getSettings()
		);

		if (empty($plural) or $plural === '') {
			$plural = $taxonomyName . 's';
		}

		$taxonomyName = ucwords($taxonomyName);

		$options = array_merge(
			[
				"hierarchical" => true,
				"label" => $taxonomyName,
				"singular_label" => $plural,
				"show_ui" => true,
				"query_var" => true,
				'show_admin_column' => true,
				"show_in_rest" => true,
				"rewrite" => ["slug" => strtolower($taxonomyName)]
			], $options
		);

		// fix for post_tag
		if($slug === 'post_tag'){
			$options["hierarchical"] = false;
		}

		$customPostTypesArray = [];

		foreach ($taxonomyModel->getCustomPostTypes() as $customPostTypeModel){
			$customPostTypesArray[] = $customPostTypeModel->getName();
		}

		$customPostTypeArrayNames = (!empty($customPostTypesArray)) ? Strings::convertKeyValueArrayToString($customPostTypesArray) : 'null,';

		// WORDPRESS code
		$wordpressCode = '<?php
register_taxonomy(
	\''.strtolower($taxonomyName).'\', 
	[
	'. $customPostTypeArrayNames .'
	],
	[
	'.Strings::convertKeyValueArrayToString($options).'
]);';

		// ACPT code
		$acptCode = '<?php
register_acpt_taxonomy([
	\'slug\' => \''.strtolower($taxonomyName).'\', 
	\'singular_label\' => \''.$taxonomyModel->getSingular().'\',
	\'plural_label\' => \''.$plural.'\',
	\'labels\' => [
		'.Strings::convertKeyValueArrayToString($taxonomyModel->getLabels()).'
	],
	\'settings\' => [
		'.Strings::convertKeyValueArrayToString($taxonomyModel->getSettings()).'
	],
	\'post_types\' => [
		'.$customPostTypeArrayNames.'
	]
]);';

		$dto = new ExportCodeStringsDto();
		$dto->acpt = $acptCode;
		$dto->wordpress = $wordpressCode;

		return $dto;
	}
}