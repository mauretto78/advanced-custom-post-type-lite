<?php

namespace ACPT_Lite\Core\Models\OptionPage;

use ACPT_Lite\Core\Helper\Icon;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Traits\PermissionTrait;

/**
 * OptionPageModel
 *
 * @since      1.0.150
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class OptionPageModel extends AbstractModel implements \JsonSerializable
{
	use PermissionTrait;

	/**
	 * @var string
	 */
	private string $pageTitle;

	/**
	 * @var string
	 */
	private string $menuTitle;

	/**
	 * @var string
	 */
	private string $capability;

	/**
	 * @var string
	 */
	private string $menuSlug;

	/**
	 * @var string
	 */
	private ?string $icon = null;

	/**
	 * @var string
	 */
	private ?string $description = null;

	/**
	 * @var int
	 */
	private int $sort;

	/**
	 * @var int
	 */
	private int $position;

	/**
	 * @var string
	 */
	private ?string $parentId = null;

	/**
	 * @var OptionPageModel[]
	 */
	private array $children = [];

	/**
	 * OptionPageModel constructor.
	 *
	 * @param string $id
	 * @param string $pageTitle
	 * @param string $menuTitle
	 * @param string $capability
	 * @param string $menuSlug
	 * @param int $sort
	 * @param int $position
	 * @param string|null $icon
	 * @param string|null $description
	 * @param string|null $parentId
	 *
	 * @throws \Exception
	 */
	public function __construct(
		string $id,
		string $pageTitle,
		string$menuTitle,
		string$capability,
		string $menuSlug,
		int $sort,
		int $position,
		?string $icon = null,
		?string $description = null,
		?string $parentId = null
	) {
		parent::__construct($id);
		$this->setMenuSlug($menuSlug);
		$this->setCapability($capability);
		$this->menuTitle    = $menuTitle;
		$this->pageTitle    = $pageTitle;
		$this->icon         = $icon;
		$this->description  = $description;
		$this->sort         = $sort;
		$this->position     = $position;
		$this->parentId     = $parentId;
		$this->children     = [];
		$this->permissions  = [];
	}

	/**
	 * @param $capability
	 *
	 * @throws \Exception
	 */
	private function setCapability($capability)
	{
		$allowedCapabilities = [
			'moderate_comments',
			'manage_options',
			'manage_categories',
			'manage_links',
			'unfiltered_html',
			'edit_others_posts',
			'edit_pages',
			'edit_others_pages',
			'edit_published_pages',
			'publish_pages',
			'delete_pages',
			'delete_others_pages',
			'delete_published_pages',
			'delete_others_posts',
			'delete_private_posts',
			'edit_private_posts',
			'read_private_posts',
			'delete_private_pages',
			'edit_private_pages',
			'read_private_pages',
		];

		if(!in_array($capability, $allowedCapabilities)){
			throw new \Exception($capability . ' is not a capability allowed');
		}

		$this->capability = $capability;
	}

	/**
	 * @param $slug
	 */
	public function setMenuSlug($slug)
	{
		$size = strlen($slug);

		if($size > 32){
			throw new \DomainException( $slug . ' is too long [32 characters max]');
		}

		preg_match_all('/[a-z0-9_-]/u', $slug, $matches);

		if(empty($matches[0]) or $size !== count($matches[0])){
			throw new \DomainException('Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]');
		}

		$this->menuSlug = sanitize_key($slug);
	}

	/**
	 * @return string
	 */
	public function getPageTitle(): string
	{
		return $this->pageTitle;
	}

	/**
	 * @return string
	 */
	public function getMenuTitle(): string
	{
		return $this->menuTitle;
	}

	/**
	 * @return string
	 */
	public function getCapability(): string
	{
		return $this->capability;
	}

	/**
	 * @return string
	 */
	public function getMenuSlug(): string
	{
		return $this->menuSlug;
	}

	/**
	 * @return string|null
	 */
	public function getIcon(): ?string
	{
		return $this->icon;
	}

	/**
	 * @return string|null
	 */
	public function renderIcon(): ?string
	{
		if($this->getIcon()){
			return Icon::render($this->icon);
		}

		return null;
	}

	/**
	 * @return string|null
	 */
	public function getDescription(): ?string
	{
		return $this->description;
	}

	/**
	 * @param string $parentId
	 */
	public function changeParentId( string $parentId ): void
	{
		$this->parentId = $parentId;
	}

	/**
	 * @return string|null
	 */
	public function getParentId(): ?string
	{
		return $this->parentId;
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @return int
	 */
	public function getPosition(): int
	{
		return $this->position;
	}

	/**
	 * @return bool
	 */
	public function hasChildren(): bool
	{
		return !empty($this->children);
	}

	/**
	 * @param OptionPageModel $page
	 */
	public function addChild(OptionPageModel $page)
	{
		if(!$this->existsInCollection($page->getId(), $this->children)){
			$this->children[] = $page;
		}
	}

	/**
	 * @param OptionPageModel $page
	 */
	public function removeChild(OptionPageModel $page)
	{
		$this->children = $this->removeFromCollection($page->getId(), $this->children);
	}

	/**
	 * Clear all children
	 */
	public function clearChildren()
	{
		$this->children = [];
	}

	/**
	 * @return OptionPageModel[]
	 */
	public function getChildren(): array
	{
		if(empty($this->children)){
			return [];
		}

		return array_values($this->children);
	}

    /**
     * @param OptionPageModel|null $parent
     * @return OptionPageModel
     */
	public function duplicate(OptionPageModel $parent = null): OptionPageModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();
		$duplicate->menuSlug = $this->menuSlug."_copy";
		$duplicate->pageTitle = $this->pageTitle." copy";
		$duplicate->menuTitle = $this->menuTitle." copy";

		if($parent){
            $duplicate->parentId = $parent->getId();
        }

		$duplicatedChildren = [];
		$duplicatedPermissions = [];

		foreach ($duplicate->getChildren() as $child){
			$duplicatedChildren[] = $child->duplicate($duplicate);
		}

		foreach ($duplicate->getPermissions() as $permission){
			$duplicatedPermissions[] = $permission->duplicateFromEntityId($duplicate->id);
		}

		$duplicate->children = $duplicatedChildren;
		$duplicate->permissions = $duplicatedPermissions;

		return $duplicate;
	}

	/**
	 * @inheritDoc
	 */
	public function arrayRepresentation()
	{
		return [
			'id' => $this->id,
			'parentId' => $this->parentId,
			'pageTitle' => $this->pageTitle,
			'menuTitle' => $this->menuTitle,
			'capability' => $this->capability,
			'menuSlug' => $this->menuSlug,
			'icon' => $this->renderIcon(),
			'description' => $this->description,
			'sort' => $this->sort,
			'position' => $this->position,
			'children' => $this->getChildren(),
			'permissions' => $this->getPermissions(),
		];
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'parentId' => $this->parentId,
			'pageTitle' => $this->pageTitle,
			'menuTitle' => $this->menuTitle,
			'capability' => $this->capability,
			'menuSlug' => $this->menuSlug,
			'icon' => $this->renderIcon(),
			'description' => $this->description,
			'sort' => $this->sort,
			'position' => $this->position,
			'children' => $this->getChildren(),
			'permissions' => $this->getPermissions(),
		];
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => true,
				'type' => 'string',
			],
			'parentId' => [
				'required' => false,
				'type' => 'string',
			],
			'pageTitle' => [
				'required' => true,
				'type' => 'string',
			],
			'menuTitle' => [
				'required' => true,
				'type' => 'string',
			],
			'menuSlug' => [
				'required' => true,
				'type' => 'string',
			],
			'icon' => [
				'required' => false,
				'type' => 'string',
			],
			'capability' => [
				'required' => true,
				'type' => 'string',
				'enum' => [
					'moderate_comments',
					'manage_options',
					'manage_categories',
					'manage_links',
					'unfiltered_html',
					'edit_others_posts',
					'edit_pages',
					'edit_others_pages',
					'edit_published_pages',
					'publish_pages',
					'delete_pages',
					'delete_others_pages',
					'delete_published_pages',
					'delete_others_posts',
					'delete_private_posts',
					'edit_private_posts',
					'read_private_posts',
					'delete_private_pages',
					'edit_private_pages',
					'read_private_pages',
				],
			],
			'description' => [
				'required' => false,
				'type' => 'string',
			],
			'position' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'children' => [
				'required' => false,
				'type' => 'array',
			],
		];
	}

	/**
	 * @inheritDoc
	 */
	public function capabilityType(): string
	{
		return $this->getMenuSlug();
	}

	/**
	 * @inheritDoc
	 */
	public function capabilities(): array
	{
		return [
			'edit',
			'read',
		];
	}
}