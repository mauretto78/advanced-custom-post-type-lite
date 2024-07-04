<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class CustomPostTypeMetaBoxFieldGenerator
{
    /**
     * @param int    $postId
     * @param MetaFieldModel $metaField
     *
     * @return AbstractField
     * @throws \Exception
     */
    public static function generate($postId, MetaFieldModel $metaField)
    {
        $field = self::getCustomPostTypeField($postId, $metaField);

        if($field){
	        echo $field->render();
        }

        return null;
    }

    /**
     * @param int    $postId
     * @param MetaFieldModel $metaField
     *
     * @return AbstractField
     */
    private static function getCustomPostTypeField( $postId, MetaFieldModel $metaField): ?AbstractField
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$metaField->getType().'Field';

	    if(class_exists($className)){
	    	/** @var AbstractField $instance */
	    	$instance = new $className($metaField, MetaTypes::CUSTOM_POST_TYPE, $postId);

		    return $instance;
	    }

        return null;
    }
}
