<?php

namespace ACPT_Lite\Core\Models\Taxonomy;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;

/**
 * TaxonomyMetaBoxFieldModel
 *
 * @since      1.0.14
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class TaxonomyMetaBoxFieldModel extends AbstractMetaBoxFieldModel implements \JsonSerializable
{
    /**
     * TaxonomyMetaBoxFieldModel constructor.
     * @param int $id
     * @param TaxonomyMetaBoxModel $metaBox
     * @param string $name
     * @param string $type
     * @param bool $required
     * @param int $sort
     * @param null $defaultValue
     * @param null $description
     */
    public function __construct(
        $id,
        TaxonomyMetaBoxModel $metaBox,
        $name,
        $type,
        $required,
        $sort,
        $defaultValue = null,
        $description = null
    ) {
        parent::__construct($id);
        $this->metaBox = $metaBox;
        $this->name    = $name;
        $this->setType($type);
        $this->required = $required;
        $this->sort  = $sort;
        $this->defaultValue  = $defaultValue;
        $this->description  = $description;
    }

    /**
     * @inheritDoc
     */
    public function getAllowedTypes()
    {
        return [
            self::EMAIL_TYPE,
            self::SELECT_TYPE,
            self::TEXT_TYPE,
        ];
    }

    /**
     * @return string
     */
    public function getDbName()
    {
        return Strings::toDBFormat($this->getMetaBox()->getName()).'_'.Strings::toDBFormat($this->name);
    }

    /**
     * @return string
     */
    public function getUiName()
    {
        return Strings::toHumanReadableFormat($this->getMetaBox()->getName()) . ' - ' . Strings::toHumanReadableFormat($this->name);
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaBox()->getId(),
            'db_name' => $this->getDbName(),
            'ui_name' => $this->getUiName(),
            'name' => $this->name,
            'type' => $this->type,
            'defaultValue' => $this->defaultValue,
            'description' => $this->description,
            'isRequired' => (bool)$this->required,
            'sort' => (int)$this->sort,
            'options' => $this->options,
        ];
    }
}