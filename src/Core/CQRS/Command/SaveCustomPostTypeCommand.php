<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;

class SaveCustomPostTypeCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	public function __construct(array $data)
	{
		$this->data = $data;
	}

	/**
	 * @return mixed|string
	 * @throws \Exception
	 */
	public function execute()
	{
		$data = $this->data;
		$model = CustomPostTypeModel::hydrateFromArray([
			'id' => ($data['id'] ? $data['id'] : Uuid::v4()),
			'name' => @$data['name'],
			'singular' => @$data["singular_label"],
			'plural' => @$data["plural_label"],
			'icon' => @$data["icon"],
			'native' => false,
			'supports' => @$data['supports'],
			'labels' =>  @$data['labels'],
			'settings' =>  @$data['settings'],
		]);

		CustomPostTypeRepository::save($model);

		// generate CPT in WP tables
		$customPostTypeGenerator = new CustomPostTypeGenerator(
			$model->getName(),
			$model->isNative(),
			$model->isWooCommerce(),
			array_merge(
				[
					'supports' => $model->getSupports(),
					'label' => $model->getPlural(),
					'labels' => $model->getLabels(),
					"menu_icon" => $model->getIcon()
				],
				$model->getSettings()
			)
		);

		$customPostTypeGenerator->registerPostType();
		$this->flushPermalinkRules();

		return $model->getId();
	}

	/**
	 * Reset the permalink structure
	 */
	private function flushPermalinkRules()
	{
		global $wp_rewrite;

		$wp_rewrite->flush_rules();
	}
}