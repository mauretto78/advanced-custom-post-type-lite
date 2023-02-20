<?php

namespace ACPT_Lite\Core\Models\Taxonomy;

use ACPT\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT\Costants\MetaTypes;

/**
 * TaxonomyMetaBoxModel
 *
 * @since      1.0.14
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class TaxonomyMetaBoxModel extends AbstractMetaBoxModel implements \JsonSerializable
{
    /**
     * @var string
     */
    private $taxonomy;

    /**
     * TaxonomyMetaBoxModel constructor.
     * @param int $id
     * @param string $taxonomy
     * @param string $name
     * @param int $sort
     */
    public function __construct(
        $id,
        $taxonomy,
        $name,
        $sort
    )
    {
        parent::__construct($id);
        $this->taxonomy = $taxonomy;
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
    }

    /**
     * @param string $taxonomy
     * @param string $name
     * @param int $sort
     */
    public function edit(
        $taxonomy,
        $name,
        $sort
    )
    {
        $this->taxonomy = $taxonomy;
        $this->name     = $name;
        $this->sort     = $sort;
        $this->fields   = [];
    }

    /**
     * @return string
     */
    public function getTaxonomy()
    {
        return $this->taxonomy;
    }

	/**
	 * @param $taxonomy
	 */
	public function changeTaxonomy($taxonomy)
	{
		$this->taxonomy = $taxonomy;
	}

    /**
     * @return string
     */
    public function metaType()
    {
        return MetaTypes::TAXONOMY;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'title' => $this->name,
            'find' => $this->taxonomy,
            'sort' => (int)$this->sort,
            'belongsTo' => $this->metaType(),
            'fields' => $this->fields
        ];
    }
}