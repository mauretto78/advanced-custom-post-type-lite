<?php

namespace ACPT_Lite\Core\Models\Meta;

use ACPT_Lite\Constants\Relationships;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\ValueObjects\RelatedEntityValueObject;

/**
 * MetaBoxFieldRelationshipModel
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class MetaFieldRelationshipModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

	/**
	 * @var RelatedEntityValueObject
	 */
    private RelatedEntityValueObject $from;

	/**
	 * @var RelatedEntityValueObject
	 */
	private RelatedEntityValueObject $to;

    /**
     * @var string
     */
    private string $relationship;

    /**
     * @var MetaFieldModel
     */
    private ?MetaFieldModel $inversedBy = null;

	/**
	 * MetaFieldRelationshipModel constructor.
	 *
	 * @param string $id
	 * @param MetaFieldModel $metaField
	 * @param RelatedEntityValueObject $from
	 * @param RelatedEntityValueObject $to
	 * @param string $relationship
	 *
	 * @throws \Exception
	 */
    public function __construct(
	    string $id,
	    MetaFieldModel $metaField,
	    RelatedEntityValueObject $from,
	    RelatedEntityValueObject $to,
        string $relationship
    ) {
        parent::__construct( $id );
        $this->metaField     = $metaField;
        $this->from = $from;
        $this->to = $to;
        $this->setRelationship($relationship);
    }

    /**
     * @param $relationship
     *
     * @throws \Exception
     */
    private function setRelationship($relationship)
    {
        $allowedValues = [
            Relationships::ONE_TO_ONE_UNI,
            Relationships::ONE_TO_ONE_BI,
            Relationships::ONE_TO_MANY_UNI,
            Relationships::ONE_TO_MANY_BI,
            Relationships::MANY_TO_ONE_UNI,
            Relationships::MANY_TO_ONE_BI,
            Relationships::MANY_TO_MANY_UNI,
            Relationships::MANY_TO_MANY_BI,
        ];

        if(!in_array($relationship, $allowedValues)){
            throw new \Exception($relationship . ' is not an allowed relation');
        }

        $this->relationship  = $relationship;
    }

    /**
     * @return MetaFieldModel
     */
    public function getMetaField()
    {
        return $this->metaField;
    }

	/**
	 * @return RelatedEntityValueObject
	 */
	public function from(): RelatedEntityValueObject
	{
		return $this->from;
	}

	/**
	 * @return RelatedEntityValueObject
	 */
	public function to(): RelatedEntityValueObject
	{
		return $this->to;
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
    public function isMany()
    {
        return $this->relationship === Relationships::ONE_TO_MANY_UNI or
                $this->relationship === Relationships::MANY_TO_MANY_UNI or
                $this->relationship === Relationships::ONE_TO_MANY_BI or
                $this->relationship === Relationships::MANY_TO_MANY_BI;
    }

    /**
     * @return bool
     */
    public function isBidirectional()
    {
        return $this->relationship === Relationships::ONE_TO_ONE_BI or
                $this->relationship === Relationships::MANY_TO_ONE_BI or
                $this->relationship === Relationships::ONE_TO_MANY_BI or
                $this->relationship === Relationships::MANY_TO_MANY_BI;
    }

    /**
     * @return string
     */
    public function getOppositeRelationship()
    {
        switch ($this->relationship) {
            case Relationships::ONE_TO_ONE_BI:
                return Relationships::ONE_TO_ONE_BI;

            case Relationships::ONE_TO_MANY_BI:
                return Relationships::MANY_TO_ONE_BI;

            case Relationships::MANY_TO_ONE_BI:
                return Relationships::ONE_TO_MANY_BI;

            case Relationships::MANY_TO_MANY_BI:
                return Relationships::MANY_TO_MANY_BI;
        }

        return null;
    }

    /**
     * @param MetaFieldModel $inversedBy
     */
    public function setInversedBy(MetaFieldModel $inversedBy)
    {
        $this->inversedBy = $inversedBy;
    }

    /**
     * @return MetaFieldModel
     */
    public function getInversedBy(): ?MetaFieldModel
    {
        return $this->inversedBy;
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'boxId' => $this->getMetaField()->getBox()->getId(),
            'fieldId' => $this->getMetaField()->getId(),
            'relationship' => $this->relationship,
            'from' => $this->from(),
            'to' => $this->to(),
            'inversedBoxId' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getBox()->getId() : null,
            'inversedBoxName' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getBox()->getName() : null,
            'inversedFieldName' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getName() : null,
            'inversedFieldId' => ($this->getInversedBy() !== null) ? $this->getInversedBy()->getId() : null,
        ];
    }

	/**
	 * @param MetaFieldModel $duplicateFrom
	 *
	 * @return MetaFieldRelationshipModel
	 */
	public function duplicateFrom( MetaFieldModel $duplicateFrom )
	{
		$duplicate            = clone $this;
		$duplicate->id        = Uuid::v4();
		$duplicate->metaField = $duplicateFrom;

		return $duplicate;
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
			'metaFieldId' => [
				'required' => false,
				'type' => 'string',
			],
			'metaField' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => MetaFieldModel::class
			],
			'from' => [
				'required' => true,
				'type' => 'object',
				'instanceOf' => RelatedEntityValueObject::class
			],
			'to' => [
				'required' => true,
				'type' => 'object',
				'instanceOf' => RelatedEntityValueObject::class
			],
			'relationship' => [
				'required' => true,
				'type' => 'string',
				'enum'=> [
					Relationships::ONE_TO_ONE_UNI,
					Relationships::ONE_TO_ONE_BI,
					Relationships::ONE_TO_MANY_UNI,
					Relationships::ONE_TO_MANY_BI,
					Relationships::MANY_TO_ONE_UNI,
					Relationships::MANY_TO_ONE_BI,
					Relationships::MANY_TO_MANY_UNI,
					Relationships::MANY_TO_MANY_BI
				]
			],
		];
	}
}
