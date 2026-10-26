<?php

namespace ACPT_Lite\Core\Generators\CustomPostType;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Meta;

class CustomPostTypeMetaBoxFieldGenerator
{
    /**
     * @param int    $postId
     * @param MetaFieldModel $metaField
     *
     * @return AbstractField
     * @throws \Exception
     */
    public static function generate(MetaFieldModel $metaField, $postId = null)
    {
        return self::getCustomPostTypeField($metaField, $postId);
    }

    /**
     * @param int    $postId
     * @param MetaFieldModel $metaField
     *
     * @return AbstractField|null
     */
    private static function getCustomPostTypeField(MetaFieldModel $metaField, $postId = null): ?AbstractField
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$metaField->getType().'Field';
        $value = null;

        if (class_exists($className)) {
            $belongs = MetaTypes::CUSTOM_POST_TYPE;
            $find = $postId;

            if (!empty($postId)) {
                $value = Meta::fetch($postId, $belongs, $metaField->getDbName());
            }

            /** @var AbstractField $instance */
            $instance = new $className($metaField, $belongs, $find);

            if ($value !== '' && $value !== null) {
                $instance->setValue($value);
            }

            if ($postId !== null && get_post_type($postId) === 'attachment') {
                $instance->setNoShowLabel(true);
            }

            return $instance;
        }

        return null;
    }
}
