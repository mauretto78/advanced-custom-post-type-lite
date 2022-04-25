<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Generators\UserFields\UserMetaFieldInterface;
use ACPT_Lite\Core\Models\UserMetaFieldModel;

class UserMetaFieldGenerator
{
    /**
     * @var UserMetaFieldModel
     */
    private $userField;

    /**
     * @var \WP_User $user
     */
    private $user;

    /**
     * UserMetaFieldGenerator constructor.
     *
     * @param UserMetaFieldModel $userField
     * @param \WP_User           $user
     */
    public function __construct(UserMetaFieldModel $userField, \WP_User $user)
    {
        $this->userField = $userField;
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function generate()
    {
        $field = $this->getUserMetaField();

        return $field->render();
    }

    /**
     * @return UserMetaFieldInterface
     */
    private function getUserMetaField()
    {
        $className = 'ACPT_Lite\\Core\\Generators\\UserFields\\'.$this->userField->getType().'Field';

        if(class_exists($className)){
            return new $className(
                    $this->user->ID,
                    $this->userField->getMetaBox()->getName(),
                    $this->userField->getName(),
                    $this->userField->getSort(),
                    $this->userField->isRequired(),
                    $this->userField->getDefaultValue(),
                    $this->userField->getDescription(),
                    $this->userField->getOptions()
            );
        }

        return null;
    }
}