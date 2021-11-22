<?php

namespace ACPT_Lite\Core\Models;

/**
 * MetaBoxFieldRelationshipModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaBoxFieldRelationshipModel extends AbstractModel implements \JsonSerializable
{
    const ONE_TO_ONE_UNI = 'OneToOneUni';
    const ONE_TO_ONE_BI = 'OneToOneBi';
    const ONE_TO_MANY_UNI = 'OneToManyUni';
    const ONE_TO_MANY_BI = 'OneToManyBi';
    const MANY_TO_ONE_UNI = 'ManyToOneUni';
    const MANY_TO_ONE_BI = 'ManyToOneBi';
    const MANY_TO_MANY_UNI = 'ManyToManyUni';
    const MANY_TO_MANY_BI = 'ManyToManyBi';

    /**
     * @var MetaBoxFieldModel
     */
    private $metaBoxField;

    /**
     * @var CustomPostTypeModel
     */
    private $relatedCustomPostType;

    /**
     * @var string
     */
    private $relationship;

    /**
     * @var MetaBoxFieldModel
     */
    private $inversedBy;

    /**
     * MetaBoxFieldRelationshipModel constructor.
     *
     * @param                     $id
     * @param MetaBoxFieldModel   $metaBoxField
     * @param CustomPostTypeModel $relatedCustomPostType
     * @param string              $relationship
     */
    public function __construct(
        $id,
        MetaBoxFieldModel $metaBoxField,
        CustomPostTypeModel $relatedCustomPostType,
        $relationship
    )
    {
        parent::__construct($id);
        $this->metaBoxField          = $metaBoxField;
        $this->relatedCustomPostType = $relatedCustomPostType;
        $this->relationship          = $relationship;
    }

    /**
     * @return MetaBoxFieldModel
     */
    public function getMetaBoxField()
    {
        return $this->metaBoxField;
    }

    /**
     * @return CustomPostTypeModel
     */
    public function getRelatedCustomPostType()
    {
        return $this->relatedCustomPostType;
    }

    /**
     * @return string
     */
    public function getRelationship()
    {
        return $this->relationship;
    }

    /**
     * @return bool
     */
    public function isBidirectional()
    {
        return $this->relationship === self::ONE_TO_ONE_BI or
                $this->relationship === self::MANY_TO_ONE_BI or
                $this->relationship === self::ONE_TO_MANY_BI or
                $this->relationship === self::MANY_TO_MANY_BI;
    }

    /**
     * @return string
     */
    public function getOppositeRelationship()
    {
        switch ($this->relationship) {
            case self::ONE_TO_ONE_BI:
                return self::ONE_TO_ONE_BI;

            case self::ONE_TO_MANY_BI:
                return self::MANY_TO_ONE_BI;

            case self::MANY_TO_ONE_BI:
                return self::ONE_TO_MANY_BI;

            case self::MANY_TO_MANY_BI:
                return self::MANY_TO_MANY_BI;
        }

        return null;
    }

    /**
     * @param MetaBoxFieldModel $inversedBy
     */
    public function setInversedBy( MetaBoxFieldModel $inversedBy )
    {
        $this->inversedBy = $inversedBy;
    }

    /**
     * @return MetaBoxFieldModel
     */
    public function getInversedBy()
    {
        return $this->inversedBy;
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
            'type' => $this->relationship,
            'relatedPostType' => ($this->getRelatedCustomPostType() !== null) ? $this->getRelatedCustomPostType()->getName() : null,
            'inversedBoxId' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getMetaBox()->getId() : null,
            'inversedBoxName' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getMetaBox()->getName() : null,
            'inversedFieldName' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getName() : null,
            'inversedFieldId' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getId() : null,
        ];
    }
}
