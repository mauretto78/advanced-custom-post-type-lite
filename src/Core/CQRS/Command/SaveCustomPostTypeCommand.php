<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Models\Permission\PermissionModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\PHP\Image;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

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

		// Custom icon image resize
		if(isset($data['icon']) and Strings::isUrl($data['icon'])){
			$attachment = WPAttachment::fromUrl($data['icon']);

			if($attachment->isImage()){
				$data['icon'] = Image::resize($attachment, 20, 20);
			}
		}

		$postTypeModel = CustomPostTypeModel::hydrateFromArray([
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

		CustomPostTypeRepository::save($postTypeModel);

		$permissions = $data['permissions'] ?? [];

		if(is_array($permissions) and !empty($permissions)){
			foreach ($permissions as $permissionIndex => $permission){
				$permissionModel = PermissionModel::hydrateFromArray([
					'id' => (isset($permission["id"]) ? $permission["id"] : Uuid::v4()),
					'entityId' => $postTypeModel->getId(),
					'userRole' => $permission['userRole'] ?? $permission['user_role'],
					'permissions' => $permission['permissions'] ?? [],
					'sort' => ($permissionIndex+1),
				]);

				$postTypeModel->addPermission($permissionModel);
			}
		}

		// generate CPT in WP tables
		$customPostTypeGenerator = new CustomPostTypeGenerator($postTypeModel);
		$customPostTypeGenerator->registerPostType();
		$this->flushPermalinkRules();

		// save permissions
		if($postTypeModel->hasPermissions()){
			$command = new SavePermissionCommand([
				'entityId' => $postTypeModel->getId(),
				'items' => $postTypeModel->gerPermissionsAsArray()
			]);

			$command->execute();
		}

		return $postTypeModel->getId();
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