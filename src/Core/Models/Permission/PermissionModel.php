<?php

namespace ACPT_Lite\Core\Models\Permission;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Utils\Wordpress\Roles;

/**
 * OptionPageModel
 *
 * @since      1.0.150
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class PermissionModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private $entityId;

	/**
	 * @var string
	 */
	private $userRole;

	/**
	 * @var array
	 */
	private $permissions = [];

	/**
	 * @var int
	 */
	private int $sort;
	/**
	 * PermissionModel constructor.
	 *
	 * @param $id
	 * @param $entityId
	 * @param $userRole
	 * @param $permissions
	 * @param $sort
	 *
	 * @throws \Exception
	 */
	public function __construct(
		$id,
		$entityId,
		$userRole,
		$permissions,
		$sort
	)
	{
		parent::__construct( $id );
		$this->setUserRole($userRole);
		$this->setPermissions($permissions);
		$this->entityId = $entityId;
		$this->sort = $sort;
	}

    /**
     * @param $userRole
     */
    public function setUserRole($userRole)
    {
        $roles = Roles::get('names');

        if(!in_array($userRole, $roles)){
            throw new \DomainException("User role ".$userRole." not permitted");
        }

        $this->userRole = $userRole;
    }

	/**
	 * @return mixed
	 */
	public function getUserRole()
	{
		return $this->userRole;
	}

	/**
	 * @param $permissions
	 *
	 * @throws \Exception
	 */
	private function setPermissions($permissions)
	{
		if(!is_array($permissions)){
			return;
		}

		$allowedPermissions = [
			'manage',
			'assign',
			'edit',
			'publish',
			'read',
			'delete',
			'edit_s',
			'edit_private_s',
			'edit_published_s',
			'edit_others_s',
			'publish_s',
			'read_private_s',
			'delete_s',
			'delete_private_s',
			'delete_published_s',
			'delete_others_s',
		];

		foreach ($permissions as $permission => $value){

			if(!in_array($permission, $allowedPermissions)){
				throw new \Exception($permission . ' is not an allowed permission');
			}

			$this->permissions[$permission] = (bool)$value;
		}
	}

	/**
	 * @return array
	 */
	public function getPermissions(): array
	{
		return $this->permissions;
	}

	/**
	 * @return mixed
	 */
	public function getEntityId()
	{
		return $this->entityId;
	}

	/**
	 * @return mixed
	 */
	public function getSort()
	{
		return $this->sort;
	}

	/**
	 * @param $entityId
	 *
	 * @return PermissionModel
	 */
	public function duplicateFromEntityId($entityId): PermissionModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->entityId = $entityId;

		return $duplicate;
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'entityId' => [
				'required' => true,
				'type' => 'string',
			],
			'userRole' => [
				'required' => false,
				'type' => 'string',
			],
			'permissions' => [
				'required' => false,
				'type' => 'array',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
		];
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'entityId' => $this->getEntityId(),
			'userRole' => $this->getUserRole(),
			'permissions' => $this->getPermissions(),
			"sort" => (int)$this->getSort(),
		];
	}
}