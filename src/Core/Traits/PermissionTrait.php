<?php

namespace ACPT_Lite\Core\Traits;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Permission\PermissionModel;

trait PermissionTrait
{
	use CollectionsTrait;

	/**
	 * @var PermissionModel[]
	 */
	protected array $permissions = [];

	/**
	 * @return string
	 */
	abstract function capabilityType(): string;

	/**
	 * @return array
	 */
	abstract function capabilities(): array;

	/**
	 * @return array
	 */
	public function userPermissions(): array
	{
		$permissions = [];

		if($this->hasPermissions()){
			$user = wp_get_current_user();
			$caps = $user->get_role_caps();

			foreach ($this->capabilities() as $capability){
				$capabilitySlug = Strings::pluralize($capability, $this->capabilityType());
				$permissions[$capability] = isset($caps[$capabilitySlug]) and $caps[$capabilitySlug] == true;
			}

			return $permissions;
		}

		// If no permissions are set, set all capabilities to true by default
		foreach ($this->capabilities() as $capability){
			$permissions[$capability] = true;
		}

		return $permissions;
	}

	/**
	 * @return bool
	 */
	public function hasPermissions(): bool
	{
		return count($this->permissions) > 0;
	}

	/**
	 * @param PermissionModel $permission
	 */
	public function addPermission(PermissionModel $permission)
	{
		if(!$this->existsInCollection($permission->getId(), $this->permissions)){
			$this->permissions[] = $permission;
		}
	}

	/**
	 * @param PermissionModel $permission
	 */
	public function removePermission(PermissionModel $permission)
	{
		$this->permissions = $this->removeFromCollection($permission->getId(), $this->permissions);
	}

	/**
	 * Clear all permissions
	 */
	public function clearPermissions()
	{
		$this->permissions = [];
	}

	/**
	 * @return PermissionModel[]
	 */
	public function getPermissions(): array
	{
		if(empty($this->permissions)){
			return [];
		}

		return array_values($this->permissions);
	}

	/**
	 * @return array
	 * @throws \ReflectionException
	 *
	 */
	public function gerPermissionsAsArray(): array
	{
		$array = [];

		if(empty($this->permissions)){
			return $array;
		}

		foreach ($this->permissions as $permission){
			$array[] = $permission->toArray();
		}

		return $array;
	}
}