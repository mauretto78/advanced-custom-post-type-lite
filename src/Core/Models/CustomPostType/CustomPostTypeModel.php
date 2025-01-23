<?php

namespace ACPT_Lite\Core\Models\CustomPostType;

use ACPT_Lite\Core\Helper\Icon;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Core\Traits\PermissionTrait;
use ACPT_Lite\Utils\Wordpress\Translator;

/**
 * CustomPostTypeModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class CustomPostTypeModel extends AbstractModel implements \JsonSerializable
{
	use PermissionTrait;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var string
     */
    private string $singular;

    /**
     * @var string
     */
    private string $plural;

    /**
     * @var string
     */
    private string $icon;

    /**
     * @var bool
     */
    private bool $native;

    /**
     * @var int
     */
    private int $postCount = 0;

    /**
     * @var array
     */
    private array $supports = [];

    /**
     * @var array
     */
    private array $labels = [];

    /**
     * @var array
     */
    private array $settings = [];

    /**
     * @var TaxonomyModel[]
     */
    private array $taxonomies = [];

    /**
     * @var WooCommerceProductDataModel[]
     */
    private array $woocommerceProductData = [];

	/**
	 * CustomPostTypeModel constructor.
	 *
	 * @param string $id
	 * @param string $name
	 * @param string $singular
	 * @param string $plural
	 * @param string $icon
	 * @param bool $native
	 * @param array $supports
	 * @param array $labels
	 * @param array $settings
	 */
    public function __construct(
        string $id,
        string $name,
        string $singular,
        string $plural,
        string $icon,
        bool $native,
        array $supports,
        array $labels,
        array $settings
    ) {
        parent::__construct($id);
        $this->setName($name);
        $this->singular = $singular;
        $this->plural   = $plural;
        $this->icon     = $icon;
        $this->native   = $native;
        $this->supports = $supports;
        $this->labels   = $labels;
        $this->settings = $settings;
        $this->taxonomies = [];
        $this->woocommerceProductData = [];
	    $this->permissions  = [];
        $this->postCount = 0;
    }

    /**
     * Keys are used as internal identifiers. Lowercase alphanumeric characters, dashes, and underscores are allowed.
     * https://developer.wordpress.org/reference/functions/sanitize_key/
     *
     * @param $name
     */
    private function setName($name)
    {
        $size = strlen($name);

        if($size > 20){
            throw new \DomainException($name . ' is too long [20 characters max]');
        }

        preg_match_all('/[a-z0-9_-]/u', $name, $matches);

        if(empty($matches[0]) or $size !== count($matches[0])){
            throw new \DomainException('Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]');
        }

        $this->name = sanitize_key($name);
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getSingular(): string
    {
        return $this->singular;
    }

    /**
     * @return string
     */
    public function getPlural(): string
    {
        return $this->plural;
    }

	/**
	 * @return string
	 */
    public function getIcon(): string
    {
	    return $this->icon;
    }

	/**
	 * @return string
	 */
	public function renderIcon(): string
	{
		return Icon::render($this->icon);
	}

    /**
     * @return array
     */
    public function getSupports(): array
    {
        return $this->supports;
    }

    /**
     * @return array
     */
    public function getLabels(): array
    {
        return $this->labels;
    }

    /**
     * @param $labels
     */
    public function setLabels($labels): void
    {
        $this->labels = $labels;
    }

    /**
     * @return array
     */
    public function defaultLabels()
    {
        $plural = $this->getPlural();
        $singular = $this->getSingular();

        return [
            'menu_name' => $plural,
            'all_items' => Translator::translate("All {{r}}", ["r" => $plural]),
            'add_new' => Translator::translate("Add") . " " . $singular,
            'add_new_item' => Translator::translate("Add new {{r}}", ["r" => $singular]),
            'edit_item' => Translator::translate("Edit") . " ". $singular,
            'new_item' => Translator::translate("New") . " "  . $singular,
            'view_item' => Translator::translate("View") . " "  . $singular,
            'view_items' => Translator::translate("View") . " "  .  $plural,
            'search_item' => Translator::translate("Search") . " "  .  $plural,
            'not_found' => Translator::translate("No {{r}} found", ["r" => $singular]),
            'not_found_in_trash' => Translator::translate("No {{r}} found", ["r" => $singular]),
            'parent_item_colon' => Translator::translate("Parent item"),
            'featured_image' => Translator::translate("Featured image"),
            'set_featured_image' => Translator::translate("Set featured image"),
            'remove_featured_image' => Translator::translate("Remove featured image"),
            'use_featured_image' => Translator::translate("Use featured image"),
            'archives' => Translator::translate("Archives"),
            'insert_into_item' => Translator::translate("Insert"),
            'uploaded_to_this_item' => Translator::translate("Upload"),
            'filter_items_list' => Translator::translate("Filter {{r}} list", ["r" => $plural]),
            'items_list_navigation' => Translator::translate("Navigation list {{r}}", ["r" => $plural]),
            'items_list' => Translator::translate("List {{r}}", ["r" => $plural]),
            'filter_by_date' => Translator::translate("Filter by date"),
            'item_published' => Translator::translate("{{r}} published", ["r" => $singular]),
            'item_published_privately' => Translator::translate("{{r}} published privately", ["r" => $singular]),
            'item_reverted_to_draft' => Translator::translate("{{r}} reverted to draft", ["r" => $singular]),
            'item_scheduled' => Translator::translate("{{r}} scheduled", ["r" => $singular]),
            'item_updated' => Translator::translate("{{r}} updated", ["r" => $singular]),
        ];
    }

    /**
     * @return array
     */
    public function getSettings(): array
    {
        return $this->normalizeSettings($this->settings);
    }

    /**
     * @param array $settings
     */
    public function modifySettings(array $settings)
    {
        $this->settings = $this->normalizeSettings($settings);
    }

	/**
	 * @param array $settings
	 *
	 * @return array
	 */
    private function normalizeSettings(array $settings): array
    {
    	// menu_position MUST be integer to have effect
	    if(isset($settings['menu_position']) and $settings['menu_position'] !== null){
		    $settings['menu_position'] = (int)$settings['menu_position'];
	    }

	    return $settings;
    }

    /**
     * @param int $postCount
     */
    public function setPostCount(int $postCount)
    {
        $this->postCount = $postCount;
    }

    /**
     * @return int
     */
    public function getPostCount(): int
    {
        return $this->postCount;
    }

    /**
     * @return bool
     */
    public function isNative(): bool
    {
        return $this->native;
    }

    /**
     * @param TaxonomyModel $taxonomyModel
     */
    public function addTaxonomy(TaxonomyModel $taxonomyModel)
    {
        if(!$this->existsInCollection($taxonomyModel->getId(), $this->taxonomies)){
            $this->taxonomies[] = $taxonomyModel;
        }
    }

    /**
     * @param TaxonomyModel $taxonomyModel
     */
    public function removeTaxonomy(TaxonomyModel $taxonomyModel)
    {
        $this->removeFromCollection($taxonomyModel->getId(), $this->taxonomies);
    }

    /**
     * @return TaxonomyModel[]
     */
    public function getTaxonomies(): array
    {
        return $this->taxonomies;
    }

    /**
     * @return WooCommerceProductDataModel[]
     */
    public function getWoocommerceProductData(): array
    {
        return $this->woocommerceProductData;
    }

    /**
     * @param WooCommerceProductDataModel $woocommerceProductDataModel
     */
    public function addWoocommerceProductData( WooCommerceProductDataModel $woocommerceProductDataModel )
    {
        if(!$this->existsInCollection($woocommerceProductDataModel->getId(), $this->woocommerceProductData)){
            $this->woocommerceProductData[] = $woocommerceProductDataModel;
        }
    }

    /**
     * Checks if 'product' if from WooCommerce
     *
     * @return bool
     */
    public function isWooCommerce(): bool
    {
        return $this->name === 'product' and in_array( 'woocommerce/woocommerce.php',  get_option( 'active_plugins' )  );
    }

    /**
     * @return CustomPostTypeModel
     * @throws \Exception
     */
    public function duplicate(): CustomPostTypeModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->permissions = [];
        $duplicate->setName(Strings::getTheFirstAvailableName($duplicate->getName(), CustomPostTypeRepository::getNames()));

        $permissions = $duplicate->getPermissions();
        $duplicate->permissions = [];

        foreach ($permissions as $permissionModel){
            $duplicate->permissions[] = $permissionModel->duplicateFromEntityId($duplicate->getId());
        }

        return $duplicate;
    }

    /**
     * @return array
     */
    public function arrayRepresentation(): array
    {
        $taxonomyArray = [];

        foreach ($this->getTaxonomies() as $taxonomy){
            $taxonomyArray[] = [
                'id' => $taxonomy->getId(),
                'slug' => $taxonomy->getSlug(),
                'singular' => $taxonomy->getSingular(),
                'plural' => $taxonomy->getPlural(),
                'labels' => $taxonomy->getLabels(),
                'settings' => $taxonomy->getSettings(),
                'postCount' => $taxonomy->getPostCount(),
                'permissions' => $taxonomy->getPermissions(),
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'icon' => $this->renderIcon(),
            'postCount' => (isset($this->postCount) and null !== $this->postCount) ? $this->postCount : 0,
            'supports' => $this->supports,
            'labels' => $this->labels,
            'settings' => $this->settings,
            'permissions' => $this->getPermissions(),
            'taxonomies' => $taxonomyArray,
        ];
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        $taxonomyArray = [];
        foreach ($this->taxonomies as $taxonomy){
            $taxonomyArray[] = [
                'id' => $taxonomy->getId(),
                'slug' => $taxonomy->getSlug(),
                'singular' => $taxonomy->getSingular(),
                'plural' => $taxonomy->getPlural(),
                'labels' => $taxonomy->getLabels(),
                'settings' => $taxonomy->getSettings(),
                'postCount' => $taxonomy->getPostCount(),
                'isNative' => $taxonomy->isNative(),
                'permissions' => $taxonomy->getPermissions(),
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'icon' => $this->renderIcon(),
            'isNative' => $this->isNative(),
            'postCount' => (isset($this->postCount) and null !== $this->postCount) ? $this->postCount : 0,
            'supports' => $this->supports,
            'labels' => $this->labels,
            'settings' => $this->settings,
            'taxonomies' => $taxonomyArray,
            'permissions' => $this->getPermissions(),
            'isWooCommerce' => $this->isWooCommerce(),
            'woocommerceProductData' => $this->woocommerceProductData,
        ];
    }

	/**
	 * @return array
	 */
	public static function validationRules(): array
	{
    	return [
		    'id' => [
			    'required' => false,
			    'type' => 'string',
		    ],
		    'name' => [
			    'required' => true,
			    'type' => 'string',
		    ],
		    'singular' => [
			    'required' => true,
			    'type' => 'string',
		    ],
		    'plural' => [
			    'required' => true,
			    'type' => 'string',
		    ],
		    'icon' => [
			    'required' => true,
			    'type' => 'string',
		    ],
		    'native' => [
			    'required' => true,
			    'type' => 'boolean',
		    ],
		    'supports' => [
			    'required' => true,
			    'type' => 'array',
		    ],
		    'labels' => [
			    'required' => true,
			    'type' => 'array',
		    ],
		    'settings' => [
			    'required' => true,
			    'type' => 'array',
		    ]
	    ];
	}


	/**
	 * @inheritDoc
	 */
	public function capabilityType(): string
	{
		if(isset($this->getSettings()['capability_type']) and $this->getSettings()['capability_type'] !== 'post'){
			return $this->getSettings()['capability_type'];
		}

		return $this->getName();
	}

	/**
	 * @inheritDoc
	 */
	public function capabilities(): array
	{
		return [
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
	}
}