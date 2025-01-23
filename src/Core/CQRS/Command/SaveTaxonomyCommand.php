<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Permission\PermissionModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Repository\TaxonomyRepository;
use ACPT_Lite\Utils\Wordpress\Translator;

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
			$taxonomyModel = TaxonomyModel::hydrateFromArray([
				'id' => ($data['id'] ? $data['id'] : Uuid::v4()),
				'slug' => @$data["slug"],
				'singular' => @$data["singular_label"],
				'plural' => @$data["plural_label"],
				'native' => false,
				'labels' => @$data['labels'],
				'settings' =>  @$data['settings'],
			]);

			if(in_array($taxonomyModel->getSlug(), ReservedTerms::list())){
				throw new \Exception('Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info');
			}

			TaxonomyRepository::save($taxonomyModel);

			$permissions = $data['permissions'] ?? [];

			if(is_array($permissions) and !empty($permissions)){
				foreach ($permissions as $permissionIndex => $permission){
					$permissionModel = PermissionModel::hydrateFromArray([
						'id' => (isset($permission["id"]) ? $permission["id"] : Uuid::v4()),
						'entityId' => $taxonomyModel->getId(),
						'userRole' => $permission['userRole'] ?? $permission['user_role'],
						'permissions' => $permission['permissions'] ?? [],
						'sort' => ($permissionIndex+1),
					]);

					$taxonomyModel->addPermission($permissionModel);
				}
			}

			// Assoc post types
			if(isset($data['post_types']) and is_array($data['post_types'])){
				foreach ($data['post_types'] as $post_type){

					// Assoc ACPT post type definition
					$post_id = CustomPostTypeRepository::getId($post_type);
					$command = new AssocTaxonomyToCustomPostTypeCommand($post_id, $taxonomyModel->getId());
					$command->execute();

					$singular = Translator::translateString($data["singular_label"]);
					$plural = Translator::translateString($data["plural_label"]);
					$labels = $data['labels'];

					$labels['name'] = Translator::translateString(@$labels['name']);
					$labels['singular_name'] = Translator::translateString(@$labels['singular_label']);
					$labels['search_items'] = Translator::translateString(@$labels['search_items']);
					$labels['popular_items'] = Translator::translateString(@$labels['popular_items']);
					$labels['all_items'] = Translator::translateString(@$labels['all_items']);
					$labels['parent_item'] = Translator::translateString(@$labels['parent_item']);
					$labels['parent_item_colon'] = Translator::translateString(@$labels['parent_item_colon']);
					$labels['edit_item'] = Translator::translateString(@$labels['edit_item']);
					$labels['view_item'] = Translator::translateString(@$labels['view_item']);
					$labels['update_item'] = Translator::translateString(@$labels['update_item']);
					$labels['add_new_item'] = Translator::translateString(@$labels['add_new_item']);
					$labels['new_item_name'] = Translator::translateString(@$labels['new_item_name']);
					$labels['separate_items_with_commas'] = Translator::translateString(@$labels['separate_items_with_commas']);
					$labels['add_or_remove_items'] = Translator::translateString(@$labels['add_or_remove_items']);
					$labels['choose_from_most_used'] = Translator::translateString(@$labels['choose_from_most_used']);
					$labels['not_found'] = Translator::translateString(@$labels['not_found']);
					$labels['no_terms'] = Translator::translateString(@$labels['no_terms']);
					$labels['filter_by_item'] = Translator::translateString(@$labels['filter_by_item']);
					$labels['items_list_navigation'] = Translator::translateString(@$labels['items_list_navigation']);
					$labels['items_list'] = Translator::translateString(@$labels['items_list']);
					$labels['back_to_items'] = Translator::translateString(@$labels['back_to_items']);
					$labels['item_link'] = Translator::translateString(@$labels['item_link']);
					$labels['item_link_description'] = Translator::translateString(@$labels['item_link_description']);
					$labels['menu_name'] = Translator::translateString(@$labels['menu_name']);
					$labels['name_admin_bar'] = Translator::translateString(@$labels['name_admin_bar']);
					$labels['archives'] = Translator::translateString(@$labels['archives']);

					$modelOptions = array_merge(
						[
							'singular_label' =>  $singular,
							'plural' => $plural,
							'labels' => $labels,
						],
						$data['settings']
					);

					$options = array_merge(
						[
							"hierarchical" => false,
							"label" => $data["slug"],
							"singular_label" => $plural,
							"show_ui" => true,
							"query_var" => true,
							'show_admin_column' => true,
							"show_in_rest" => true,
							"rewrite" => ["slug" => strtolower($data["slug"])]
						], $modelOptions
					);

					if($taxonomyModel->hasPermissions()){
						$capabilityType = $taxonomyModel->getSlug()."s";
						$options['capabilities'] = [
							'manage_terms' => 'manage_'.$capabilityType,
							'edit_terms' => 'edit_'.$capabilityType,
							'delete_terms' => 'delete_'.$capabilityType,
							'assign_terms' => 'assign_'.$capabilityType
						];
					}

					if(!taxonomy_exists(strtolower($data["slug"]))){
						register_taxonomy(
							strtolower($data["slug"]),
							$post_type,
							$options
						);
					}
				}
			}

			// save permissions
			if($taxonomyModel->hasPermissions()){
				$command = new SavePermissionCommand([
					'entityId' => $taxonomyModel->getId(),
					'items' => $taxonomyModel->gerPermissionsAsArray()
				]);

				$command->execute();
			}

			return $taxonomyModel->getId();
		} catch (\Exception $exception){
			return null;
		}
	}
}
