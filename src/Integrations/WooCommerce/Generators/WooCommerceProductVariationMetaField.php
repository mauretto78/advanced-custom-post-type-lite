<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class WooCommerceProductVariationMetaField
{
    /**
     * @var MetaFieldModel
     */
    private MetaFieldModel $metaField;

    /**
     * @var int
     */
    private $loop;

    /**
     * @var array
     */
    private $variationData;

    /**
     * @var \WP_Post
     */
    private \WP_Post $variation;

    /**
     * WooCommerceProductVariationMetaField constructor.
     * @param MetaFieldModel $metaField
     * @param $loop
     * @param $variationData
     * @param \WP_Post $variation
     */
    public function __construct(MetaFieldModel $metaField, $loop, $variationData, \WP_Post $variation)
    {
        $this->metaField = $metaField;
        $this->loop = $loop;
        $this->variationData = $variationData;
        $this->variation = $variation;
    }

    /**
     * @return AbstractField|null
     */
    public function generate(): ?AbstractField
    {
        $className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'. $this->metaField->getType().'Field';
        $value = $this->variationData[$this->metaField->getDbName()][0] ?? null;

        if(!empty($value) and is_serialized($value)){
            $value = unserialize($value);
        }

        if(class_exists($className)){
            /** @var AbstractField $instance */
            $instance = new $className( $this->metaField, MetaTypes::CUSTOM_POST_TYPE, $this->variation->ID);
            $instance->setWooCommerceLoopIndex($this->loop);

            if(!empty($value)){
                $instance->setValue($value);
            }

            return $instance;
        }

        return null;
    }
}
