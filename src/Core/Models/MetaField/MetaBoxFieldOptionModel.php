<?php

namespace ACPT_Lite\Core\Models\MetaField;

use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * MetaBoxFieldOptionModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaBoxFieldOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var AbstractMetaBoxFieldModel
     */
    private $metaBoxField;

    /**
     * @var string
     */
    private $label;

    /**
     * @var string
     */
    private $value;

    /**
     * @var int
     */
    private $sort;

    /**
     * MetaBoxFieldModel constructor.
     *
     * @param                   $id
     * @param AbstractMetaBoxFieldModel $metaBoxField
     * @param string            $label
     * @param string            $value
     * @param int               $sort
     */
    public function __construct(
        $id,
	    AbstractMetaBoxFieldModel $metaBoxField,
        $label,
        $value,
        $sort
    ) {
        parent::__construct($id);
        $this->metaBoxField = $metaBoxField;
        $this->label = $label;
        $this->value = $value;
        $this->sort  = $sort;
    }

    /**
     * @return AbstractMetaBoxFieldModel
     */
    public function getMetaBoxField()
    {
        return $this->metaBoxField;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaBoxField()->getMetaBox()->getId(),
            'fieldId' => $this->getMetaBoxField()->getId(),
            'label' => $this->label,
            'value' => $this->value,
            'sort' => $this->sort
        ];
    }
}