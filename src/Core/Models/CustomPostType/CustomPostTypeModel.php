<?php

namespace ACPT_Lite\Core\Models\CustomPostType;

use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataModel;

/**
 * CustomPostTypeModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class CustomPostTypeModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $singular;

    /**
     * @var string
     */
    private $plural;

    /**
     * @var string
     */
    private $icon;

    /**
     * @var bool
     */
    private $native;

    /**
     * @var int
     */
    private $postCount;

    /**
     * @var array
     */
    private $supports = [];

    /**
     * @var array
     */
    private $labels = [];

    /**
     * @var array
     */
    private $settings = [];

    /**
     * @var TaxonomyModel[]
     */
    private $taxonomies = [];

    /**
     * @var WooCommerceProductDataModel[]
     */
    private $woocommerceProductData = [];

    /**
     * CustomPostTypeModel constructor.
     *
     * @param       $id
     * @param       $name
     * @param       $singular
     * @param       $plural
     * @param       $icon
     * @param       $native
     * @param array $supports
     * @param array $labels
     * @param array $settings
     */
    public function __construct(
        $id,
        $name,
        $singular,
        $plural,
        $icon,
        $native,
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getSingular()
    {
        return $this->singular;
    }

    /**
     * @return string
     */
    public function getPlural()
    {
        return $this->plural;
    }

    /**
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @return array
     */
    public function getSupports()
    {
        return $this->supports;
    }

    /**
     * @return array
     */
    public function getLabels()
    {
        return $this->labels;
    }

    /**
     * @return array
     */
    public function getSettings()
    {
	    return $this->normalizeSettings($this->settings);
    }

	/**
	 * @param array $settings
	 *
	 * @return array
	 */
	private function normalizeSettings(array $settings)
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
    public function setPostCount($postCount)
    {
        $this->postCount = $postCount;
    }

    /**
     * @return int
     */
    public function getPostCount()
    {
        return $this->postCount;
    }

    /**
     * @return bool
     */
    public function isNative()
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
    public function getTaxonomies()
    {
        return $this->taxonomies;
    }

    /**
     * Checks if 'product' if from WooCommerce
     *
     * @return bool
     */
    public function isWooCommerce()
    {
        return $this->name === 'product' and class_exists( 'woocommerce' );
    }

    /**
     * @return WooCommerceProductDataModel[]
     */
    public function getWoocommerceProductData() {
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
     * @return array
     */
    public function arrayRepresentation()
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
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'icon' => $this->icon,
            'postCount' => (isset($this->postCount) and null !== $this->postCount) ? $this->postCount : 0,
            'supports' => $this->supports,
            'labels' => $this->labels,
            'settings' => $this->settings,
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
            ];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'icon' => $this->icon,
            'isNative' => $this->isNative(),
            'postCount' => (isset($this->postCount) and null !== $this->postCount) ? $this->postCount : 0,
            'supports' => $this->supports,
            'labels' => $this->labels,
            'settings' => $this->settings,
            'taxonomies' => $taxonomyArray,
            'isWooCommerce' => $this->isWooCommerce(),
            'woocommerceProductData' => $this->woocommerceProductData,
        ];
    }
}