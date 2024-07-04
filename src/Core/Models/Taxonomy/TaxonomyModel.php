<?php

namespace ACPT_Lite\Core\Models\Taxonomy;

use ACPT_Lite\Constants\ReservedTerms;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;

/**
 * TaxonomyModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class TaxonomyModel extends AbstractModel implements \JsonSerializable
{
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
     * @var bool
     */
    private bool $native;

    /**
     * @var int
     */
    private int $postCount;

    /**
     * @var array
     */
    private array $labels = [];

    /**
     * @var array
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
	 * @param array $labels
	 * @param array $settings
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
	 * @param $slug
	 * @param $native
	 *
	 * @throws \Exception
	 */
    private function setSlug($slug, $native)
    {
	   	// avoid reserved terms
    	if(!$native and in_array($slug, ReservedTerms::list())){
		    throw new \Exception('Slug must not collide with any reserved term. Please see the <a href="https://developer.wordpress.org/reference/functions/register_taxonomy/#reserved-terms" target="_blank">official docs</a> for more info');
	    }

        if(strlen($slug) > 32){

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
     * @return array
     */
    public function getLabels(): array
    {
        return $this->labels;
    }

    /**
     * @return array
     */
    public function getSettings(): array
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
	public function getCustomPostTypes(): array
	{
		return $this->customPostTypes;
	}

	/**
	 * @return array
	 */
    public function arrayRepresentation()
    {
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
		    'customPostTypes' => $customPostTypesArray,
	    ];
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
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
            'customPostTypes' => $customPostTypesArray,
        ];
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
}