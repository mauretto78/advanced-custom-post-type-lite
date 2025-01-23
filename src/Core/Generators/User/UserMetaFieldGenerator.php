<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class UserMetaFieldGenerator
{
    /**
     * @var MetaFieldModel
     */
    private $metaField;

    /**
     * @var \WP_User $user
     */
    private $user;

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
    public function generate()
    {
	    return $this->getUserMetaField();
    }

	/**
	 * @return AbstractField|null
	 */
    private function getUserMetaField()
    {
	    $className = 'ACPT\\Core\\Generators\\Meta\\Fields\\'.$this->metaField->getType().'Field';

	    if(class_exists($className)){
		    /** @var AbstractField $instance */
		    $instance = new $className($this->metaField, MetaTypes::USER, $this->user->ID);

		    return $instance;
	    }

	    return null;
    }
}