<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Generators\Fields\CustomPostTypeFieldInterface;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;

class MetaBoxFieldGenerator
{
    /**
     * @param       $postId
     * @param       $metaboxId
     * @param array $input
     *
     * @return CustomPostTypeFieldInterface
     * @throws \Exception
     */
    public static function generate( $postId, $metaboxId, array $input)
    {
        if(!isset($input['type'])){
            throw new \Exception('Type is not defined');
        }

        $field = self::getCustomPostTypeField($postId, $metaboxId, $input);

        return $field->render();
    }

    /**
     * @param int    $postId
     * @param string $metaboxId
     * @param array  $input
     *
     * @return CustomPostTypeFieldInterface
     */
    private static function getCustomPostTypeField( $postId, $metaboxId, array $input)
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Fields\\'.$input['type'].'Field';

        return new $className($postId, $metaboxId, $input['name'], $input['sort'], $input['isRequired'], $input['defaultValue'], $input['description'], $input['options'], $input['relations']);
    }
}
