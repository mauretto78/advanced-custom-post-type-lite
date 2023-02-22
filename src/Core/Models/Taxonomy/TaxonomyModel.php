<?php

namespace ACPT_Lite\Core\Models\Taxonomy;

use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;

/**
 * TaxonomyModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class TaxonomyModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $slug;

    /**
     * @var string
     */
    private $singular;

    /**
     * @var string
     */
    private $plural;

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
    private $labels = [];

    /**
     * @var array
     */
    private $settings = [];

    /**
     * @var CustomPostTypeModel[]
     */
    private $customPostTypes = [];

	/**
	 * @var AbstractMetaBoxModel[]
	 */
	private $metaBoxes = [];

    /**
     * TaxonomyModel constructor.
     *
     * @param       $id
     * @param       $slug
     * @param       $singular
     * @param       $plural
     * @param       $native
     * @param array $labels
     * @param array $settings
     *
     * @throws \Exception
     */
    public function __construct(
        $id,
        $slug,
        $singular,
        $plural,
        $native,
        array $labels,
        array $settings
    ) {
        parent::__construct($id);
        $this->setSlug($slug);
        $this->native   = $native;
        $this->singular = $singular;
        $this->plural   = $plural;
        $this->labels   = $labels;
        $this->settings = $settings;
    }

    /**
     * @param $slug
     *
     * @throws \Exception
     */
    private function setSlug($slug)
    {
        if(strlen($slug) > 32){
            throw new \Exception('Slug must not exceed 32 characters.');
        }

        $this->slug = $slug;
    }

    /**
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
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
        return $this->settings;
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
     * @param CustomPostTypeModel $customPostTypeModel
     */
    public function addCustomPostType(CustomPostTypeModel $customPostTypeModel)
    {
        if(!$this->existsInCollection($customPostTypeModel->getId(), $this->customPostTypes)){
            $this->customPostTypes[] = $customPostTypeModel;
        }
    }

    /**
     * @param CustomPostTypeModel $customPostTypeModel
     */
    public function removeCustomPostType(CustomPostTypeModel $customPostTypeModel)
    {
        $this->removeFromCollection($customPostTypeModel->getId(), $this->customPostTypes);
    }

	/**
	 * @return CustomPostTypeModel[]
	 */
	public function getCustomPostTypes()
	{
		return $this->customPostTypes;
	}

	/**
	 * @return AbstractMetaBoxModel[]
	 */
	public function getMetaBoxes()
	{
		return $this->metaBoxes;
	}

	/**
	 * @param AbstractMetaBoxModel $metaBox
	 */
	public function addMetaBox(AbstractMetaBoxModel $metaBox)
	{
		if(!$this->existsInCollection($metaBox->getId(), $this->metaBoxes)){
			$this->metaBoxes[] = $metaBox;
		}
	}

	/**
	 * @param AbstractMetaBoxModel $metaBox
	 */
	public function removeMetaBox(AbstractMetaBoxModel $metaBox)
	{
		$this->removeFromCollection($metaBox->getId(), $this->metaBoxes);
	}

    /**
     * @return array|mixed
     */
    public function jsonSerialize()
    {
	    $metaArray = [];
	    foreach ($this->getMetaBoxes() as $metaBoxModel){
		    $metaArray[] = [
			    "name" => $metaBoxModel->getName(),
			    "count" => count($metaBoxModel->getFields()),
		    ];
	    }

        $customPostTypesArray = [];

        /** @var CustomPostTypeModel $postTypeModel */
        foreach ($this->customPostTypes as $postTypeModel){
            $customPostTypesArray[] = [
                'id' => $postTypeModel->getId(),
                'name' => $postTypeModel->getName(),
                'singular' => $postTypeModel->getSingular(),
                'plural' => $postTypeModel->getPlural(),
                'icon' => $postTypeModel->getIcon(),
                'supports' => $postTypeModel->getSupports(),
                'labels' => $postTypeModel->getLabels(),
                'settings' => $postTypeModel->getSettings(),
            ];
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'singular' => $this->singular,
            'plural' => $this->plural,
            'postCount' => (isset($this->postCount) and null !== $this->postCount) ? $this->postCount : 0,
            'isNative' => $this->isNative(),
            'labels' => $this->labels,
            'settings' => $this->settings,
            'meta' => $metaArray,
            'customPostTypes' => $customPostTypesArray
        ];
    }
}