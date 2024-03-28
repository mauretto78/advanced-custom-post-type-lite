<?php

namespace ACPT_Lite\Utils\ExportCode\Exporter;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\ExportCode\DTO\ExportCodeStringsDto;

class ExportCustomPostTypeCodeStrings extends AbstractExportCodeStrings
{
	/**
	 * @param $find
	 *
	 * @return ExportCodeStringsDto
	 * @throws \Exception
	 */
	public function export( $find )
	{
		/** @var CustomPostTypeModel $postTypeModel */
		$postTypeModel = @CustomPostTypeRepository::get([
			'postType' => $find
		])[0];

		if(!$postTypeModel){
			throw new \Exception($find . ' is not a valid post type');
		}

		// WORDPRESS code
		$wordpressCode = '<php
register_post_type(\''.$find.'\', [
';

		$postTypeArgs = array_merge(
			[
				'supports' => $postTypeModel->getSupports(),
				'label' => $postTypeModel->getPlural(),
				'labels' => $postTypeModel->getLabels(),
				"menu_icon" => $postTypeModel->renderIcon()
			],
			$postTypeModel->getSettings()
		);

		$n = ucwords($find);
		$n = str_replace("_", " ", $n);

		$args = [
			"label" => $n,
			'singular_name' => $n,
			'labels' => [
				'add_new_item' => 'Add ' . $n,
				'add_new' => 'Add ' . $n,
				'view_item' => 'View ' . $n,
				'search_items' => 'Search ' . $n,
				'edit_item' => 'Modify ' . $n,
				'not_found' => 'No ' . $n . ' was found'
			],
			"public" => true,
			"publicly_queryable" => true,
			"query_var" => true,
			"menu_icon" => "dashicons-admin-site-alt3",
			"rewrite" => true,
			"capability_type" => "post",
			"hierarchical" => false,
			"menu_position" => null,
			"supports" => ["title", "editor", "thumbnail"],
			'has_archive' => true,
			"show_in_rest" => true,
		];

		if(isset($postTypeArgs['rewrite']) and $postTypeArgs['rewrite'] === true and !empty($postTypeArgs['custom_rewrite'])){
			$postTypeArgs['rewrite'] = [
				'slug' => $postTypeArgs['custom_rewrite'],
				'with_front' => true
			];
		}

		$args = array_merge($args, $postTypeArgs);

		$wordpressCode .= Strings::convertKeyValueArrayToString($args);
		$wordpressCode .= '
]);';

		// ACTP code
		$acptCode = '<?php
register_acpt_post_type([
	\'post_name\' => \''.$find.'\',
	\'singular_label\' => \''.$postTypeModel->getSingular().'\',
	\'plural_label\' => \''.$postTypeModel->getPlural().'\',
	\'icon\' => \''.$postTypeModel->getIcon().'\',
	\'supports\' => [
';

		foreach ($postTypeModel->getSupports() as $support){
			$acptCode.= '           \''.$support.'\',' . PHP_EOL;
		}

		$acptCode.= '       ],
	\'labels\' => [
';
		$acptCode.= Strings::convertKeyValueArrayToString($postTypeModel->getLabels());
		$acptCode.= '       ],
	\'settings\' => [
';
		$acptCode.= Strings::convertKeyValueArrayToString($postTypeModel->getSettings());
		$acptCode.= '       ],
]);';

		$dto = new ExportCodeStringsDto();
		$dto->acpt = $acptCode;
		$dto->wordpress = $wordpressCode;

		return $dto;
	}
}