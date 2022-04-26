<?php

namespace ACPT_Lite\Core\Models;

/**
 * UserFieldOptionModel
 *
 * @since      1.0.7
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class UserMetaFieldOptionModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var UserMetaBoxModel
     */
    private $userMetaBox;

    /**
     * @var UserMetaFieldModel
     */
    private $userField;

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
     * UserFieldOptionModel constructor.
     *
     * @param                   $id
     * @param UserMetaBoxModel   $userMetaBox
     * @param UserMetaFieldModel $userField
     * @param string $label
     * @param string $value
     * @param int $sort
     */
    public function __construct(
            $id,
            UserMetaBoxModel   $userMetaBox,
            UserMetaFieldModel $userField,
            $label,
            $value,
            $sort
    ) {
        parent::__construct($id);
        $this->userMetaBox = $userMetaBox;
        $this->userField = $userField;
        $this->label = $label;
        $this->value = $value;
        $this->sort  = $sort;
    }

    /**
     * @return UserMetaBoxModel
     */
    public function getUserMetaBox() {
        return $this->userMetaBox;
    }

    /**
     * @return UserMetaFieldModel
     */
    public function getUserField()
    {
        return $this->userField;
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
                'boxId' => $this->getUserMetaBox()->getId(),
                'fieldId' => $this->getUserField()->getId(),
                'label' => $this->label,
                'value' => $this->value,
                'sort' => $this->sort
        ];
    }
}