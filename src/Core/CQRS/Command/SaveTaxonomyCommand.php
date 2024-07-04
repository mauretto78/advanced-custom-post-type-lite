<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;

class SaveTaxonomyCommand implements CommandInterface {
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveTaxonomyCommand constructor.
	 *
	 * @param array $data
	 */
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
		try {
			$data = $this->data;
			$model = TaxonomyModel::hydrateFromArray([
				'id' => ($data['id'] ? $data['id'] : Uuid::v4()),
				'slug' => @$data["slug"],
				'singular' => @$data["singular_label"],
				'plural' => @$data["plural_label"],
				'native' => false,
				'labels' => @$data['labels'],
				'settings' =>  @$data['settings'],
			]);

			TaxonomyRepository::save($model);

			// Assoc post types
			if(isset($data['post_types'])){
				foreach ($data['post_types'] as $post_type){

					// Assoc ACPT post type definition
					$post_id = CustomPostTypeRepository::getId($post_type);
					$command = new AssocTaxonomyToCustomPostTypeCommand($post_id, $model->getId());
					$command->execute();

					$modelOptions = array_merge(
						[
							'singular_label' =>  $data["singular_label"],
							'plural' => $data["plural_label"],
							'labels' => $data['labels'],
						],
						$data['settings']
					);

					$options = array_merge(
						[
							"hierarchical" => false,
							"label" => $data["slug"],
							"singular_label" => $data["plural_label"],
							"show_ui" => true,
							"query_var" => true,
							'show_admin_column' => true,
							"show_in_rest" => true,
							"rewrite" => ["slug" => strtolower($data["slug"])]
						], $modelOptions
					);

					register_taxonomy(strtolower($data["slug"]), $post_type, $options);

					return true;
				}
			}

			return $model->getId();
		} catch (\Exception $exception){
			return null;
		}
	}
}