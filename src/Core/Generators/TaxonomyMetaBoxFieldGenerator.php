<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Generators\Contracts\MetaFieldInterface;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;

/**
 * *************************************************
 * TaxonomyMetaBoxFieldGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class TaxonomyMetaBoxFieldGenerator
{
    /**
     * @var AbstractMetaBoxFieldModel
     */
    private AbstractMetaBoxFieldModel $metaBoxFieldModel;

    /**
     * @var string
     */
    private $taxonomy;

    /**
     * @var null
     */
    private $termId;

    /**
     * TaxonomyMetaBoxFieldGenerator constructor.
     * @param AbstractMetaBoxFieldModel $metaBoxFieldModel
     * @param string $taxonomy
     * @param null $termId
     */
    public function __construct(AbstractMetaBoxFieldModel $metaBoxFieldModel, $taxonomy, $termId = null)
    {
        $this->metaBoxFieldModel = $metaBoxFieldModel;
        $this->taxonomy = $taxonomy;
        $this->termId = $termId;
    }

    /**
     * @return mixed
     */
    public function generate()
    {
        $field = self::getTaxonomyField();

	    if($field){
		    return $field->render();
	    }

	    return null;
    }

    /**
     * @return MetaFieldInterface|null
     */
    private function getTaxonomyField()
    {
        $className = 'ACPT_Lite\\Core\\Generators\\TaxonomyFields\\'.$this->metaBoxFieldModel->getType().'Field';

        if(class_exists($className)){
            return new $className(
                $this->metaBoxFieldModel,
                $this->taxonomy,
                $this->termId,
            );
        }

        return null;
    }
}
