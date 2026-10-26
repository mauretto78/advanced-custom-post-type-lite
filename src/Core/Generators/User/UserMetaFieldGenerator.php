<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Meta;

class UserMetaFieldGenerator
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

    /**
     * @var \WP_User $user
     */
    private \WP_User $user;

    /**
     * UserMetaFieldGenerator constructor.
     *
     * @param MetaFieldModel $metaField
     * @param \WP_User           $user
     */
    public function __construct(MetaFieldModel $metaField, \WP_User $user)
    {
        $this->metaField = $metaField;
        $this->user = $user;
    }

    /**
     * @return AbstractField|null
     */
    public function generate(): ?AbstractField
    {
        return $this->getUserMetaField();
    }

    /**
     * @return AbstractField|null
     */
    private function getUserMetaField(): ?AbstractField
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$this->metaField->getType().'Field';
        $value = null;

        if (class_exists($className)) {
            $belongs = MetaTypes::USER;
            // The user id, as the post generator passes the post id: the field reads its
            // saved sub-values (e.g. a phone's country) and runs its visibility check by it (#1426)
            $userId = !empty($this->user->ID) ? (string)$this->user->ID : null;
            $find = $userId;

            if (!empty($this->user->ID)) {
                $value = Meta::fetch($this->user->ID, $belongs, $this->metaField->getDbName());
            }

            /** @var AbstractField $instance */
            $instance = new $className($this->metaField, $belongs, $find);

            if ($value !== '' && $value !== null) {
                $instance->setValue($value);
            }

            return $instance;
        }

        return null;
    }
}
