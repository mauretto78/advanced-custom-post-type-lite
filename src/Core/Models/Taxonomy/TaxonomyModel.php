<?php

namespace ACPT_Lite\Core\Models\Taxonomy;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Utils\Wordpress\Translator;

/**
 * TaxonomyModel
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class TaxonomyModel extends AbstractModel implements \JsonSerializable
{
    /**
     * Permissions are not available in ACPT Lite
     *
     * @return array<int, mixed>
     */
    public function getPermissions(): array
    {
        return [];
    }

    /**
     * @var string
     */
    private string $slug;

    /**
     * @var string
     */
    private string $singular;

    /**
     * @var string
     */
    private string $plural;

    /**
     * @var int
     */
    private int $native;

    /**
     * @var int
     */
    private int $postCount;

    /**
     * @var array<string, mixed>
     */
    private array $labels = [];

    /**
     * @var array<string, mixed>
     */
    private array $settings = [];

    /**
     * @var CustomPostTypeModel[]
     */
    private array $customPostTypes = [];

    /**
     * TaxonomyModel constructor.
     *
     * @param string $id
     * @param string $slug
     * @param string $singular
     * @param string $plural
     * @param int $native
     * @param array<string, mixed> $labels
     * @param array<string, mixed> $settings
     *
     * @throws \Exception
     */
    public function __construct(
        string $id,
        string $slug,
        string $singular,
        string $plural,
        int $native,
        array $labels,
        array $settings
    ) {
        parent::__construct($id);
        $this->setSlug($slug, $native);
        $this->native   = $native;
        $this->singular = $singular;
        $this->plural   = $plural;
        $this->labels   = $labels;
        $this->settings = $settings;
        $this->customPostTypes = [];
        $this->postCount = 0;
    }

    /**
     * @param string $slug
     * @param int $native
     *
     * @throws \Exception
     *
     * @return void
     */
    private function setSlug(string $slug, int $native): void
    {
        // avoid reserved terms
        if (!$native && in_array($slug, ReservedTerms::list())) {
            throw new \Exception('Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info');
        }

        if (strlen($slug) > 32) {
            throw new \Exception('Slug must not exceed 32 characters.');
        }

        $this->slug = $slug;
    }

    /**
     * @return string
     */
    public function getSlug(): string
    {
        return $this->slug;
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
     * @return array<string, mixed>
     */
    public function getLabels(): array
    {
        return $this->labels;
    }

    /**
     * @param array<string, mixed> $labels
     */
    public function setLabels(array $labels): void
    {
        $this->labels = $labels;
    }

    /**
     * @return array<string, mixed>
     */
    public function defaultLabels(): array
    {
        $plural = $this->getPlural();
        $singular = $this->getSingular();

        return [
            'name' => $plural,
            'singular_name' => $singular,
            'search_items' => Translator::translate("Search {{r}}", ["r" => $plural]),
            'popular_items' => Translator::translate("Popular {{r}}", ["r" => $plural]),
            'all_items' => Translator::translate("All {{r}}", ["r" => $plural]),
            'parent_item' => Translator::translate("Parent {{r}}", ["r" => $singular]),
            'parent_item_colon' => Translator::translate("Parent item"),
            'edit_item' => Translator::translate("Edit"),
            'view_item' => Translator::translate("View"),
            'update_item' => Translator::translate("Update {{r}}", ["r" => $singular]),
            'add_new_item' => Translator::translate("Add new {{r}}", ["r" => $singular]),
            'new_item_name' => Translator::translate("New {{r}}", ["r" => $singular]),
            'separate_items_with_commas' => Translator::translate("Separate {{r}} with commas", ["r" => $plural]),
            'add_or_remove_items' => Translator::translate("Add or remove {{r}}", ["r" => $plural]),
            'choose_from_most_used' => Translator::translate("Choose from most used {{r}}", ["r" => $singular]),
            'not_found' => Translator::translate("No {{r}} found", ["r" => $singular]),
            'no_terms' => Translator::translate("No {{r}}", ["r" => $plural]),
            'filter_by_item' => Translator::translate("Filter by {{r}}", ["r" => $singular]),
            'items_list_navigation' => Translator::translate("Navigation list {{r}}", ["r" => $plural]),
            'items_list' => Translator::translate("List {{r}}", ["r" => $plural]),
            'most_used' => Translator::translate("Most used {{r}}", ["r" => $plural]),
            'back_to_items' => Translator::translate("Back to {{r}}", ["r" => $plural]),
        ];
    }

    /**
     * Mirrors the values the admin UI's creation wizard pre-fills for a brand-new taxonomy
     * (assets/src/App/pages/SaveTaxonomy/Steps/SettingsStep.jsx), so a taxonomy created
     * without an explicit `settings` payload behaves the same as one created through the UI.
     *
     * @return array<string, mixed>
     */
    public function defaultSettings(): array
    {
        return [
            'public' => true,
            'publicly_queryable' => true,
            'hierarchical' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => true,
            'rest_base' => '',
            'rest_controller_class' => '',
            'show_tagcloud' => true,
            'show_in_quick_edit' => true,
            'show_admin_column' => false,
            'show_meta_box' => true,
            'capabilities' => ['manage_terms', 'edit_terms', 'delete_terms', 'assign_terms'],
            'rewrite' => false,
            'custom_rewrite' => '',
            'query_var' => false,
            'custom_query_var' => '',
            'default_term' => '',
            'sort' => false,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->settings;
    }

    /**
     * @param int $postCount
     *
     * @return void
     */
    public function setPostCount(int $postCount): void
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
        return (bool)$this->native;
    }

    /**
     * @return bool
     */
    public function isWooCommerceNative(): bool
    {
        $wooCommerceNativeTags = [
            'product_brand',
            'product_cat',
            'product_tag',
            'product_shipping_class',
            'product_type'
        ];

        return in_array($this->slug, $wooCommerceNativeTags);
    }

    /**
     * @param CustomPostTypeModel $customPostTypeModel
     *
     * @return void
     */
    public function addCustomPostType(CustomPostTypeModel $customPostTypeModel): void
    {
        if (!$this->existsInCollection($customPostTypeModel->getId(), $this->customPostTypes)) {
            $this->customPostTypes[] = $customPostTypeModel;
        }
    }

    /**
     * @param CustomPostTypeModel $customPostTypeModel
     *
     * @return void
     */
    public function removeCustomPostType(CustomPostTypeModel $customPostTypeModel): void
    {
        $this->removeFromCollection($customPostTypeModel->getId(), $this->customPostTypes);
    }

    /**
     * @return CustomPostTypeModel[]
     */
    public function getCustomPostTypes(): array
    {
        return $this->customPostTypes;
    }

    /**
     * @return TaxonomyModel
     * @throws \Exception
     */
    public function duplicate(): TaxonomyModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();

        return $duplicate;
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        $customPostTypesArray = [];

        /** @var CustomPostTypeModel $postTypeModel */
        foreach ($this->customPostTypes as $postTypeModel) {
            $customPostTypesArray[] = [
                'id' => $postTypeModel->getId(),
                'name' => $postTypeModel->getName(),
                'singular' => $postTypeModel->getSingular(),
                'plural' => $postTypeModel->getPlural(),
                'icon' => $postTypeModel->getIcon(),
                'supports' => $postTypeModel->getSupports(),
                'labels' => $postTypeModel->getLabels(),
                'settings' => $postTypeModel->getSettings(),
                'permissions' => $postTypeModel->getPermissions(),
            ];
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'postCount' => $this->postCount,
            'isNative' => $this->isNative(),
            'labels' => $this->labels,
            'settings' => $this->settings,
            'customPostTypes' => $customPostTypesArray,
            'permissions' => $this->getPermissions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function validationRules(): array
    {
        return [
            'id' => [
                'required' => false,
                'type' => 'string',
            ],
            'slug' => [
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
            'native' => [
                'required' => false,
                'type' => 'boolean',
            ],
            'labels' => [
                'required' => true,
                'type' => 'array',
            ],
            'settings' => [
                'required' => true,
                'type' => 'array',
            ],
            'post_types' => [
                'required' => false,
                'type' => 'array',
            ]
        ];
    }

    /**
     * @return string
     */
    public function capabilityType(): string
    {
        return $this->getSlug()."s";
    }

    /**
     * @return array<int, mixed>
     */
    public function capabilities(): array
    {
        return [
            'edit',
            'assign',
            'manage',
            'delete',
        ];
    }

    /**
     * Checks if the given taxonomy is a native WordPress taxonomy.
     *
     * @param string $taxonomy The name of the taxonomy to check.
     *
     * @return bool Returns true if the taxonomy is native, otherwise false.
     */
    public static function isTaxonomyNative(string $taxonomy): bool
    {
        $nativeTaxonomies = [
            'category',
            'post_tag',
            'nav_menu',
            'link_category',
            'post_format',
        ];

        return in_array($taxonomy, $nativeTaxonomies);
    }
}
