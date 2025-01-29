<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class WooCommerceProductVariationMetaGroups
{
    /**
     * Add product data
     */
    public function generate()
    {
        try {
            $groups = MetaRepository::get([
                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                'find' => 'product_variation',
                'clonedFields' => true,
            ]);
        } catch (\Exception $exception){
            $groups = [];
        }

        $this->renderGroups($groups);
        $this->saveData($groups);
    }

    /**
     * @param MetaGroupModel[] $groups
     */
    private function renderGroups($groups)
    {
        add_action( 'woocommerce_product_after_variable_attributes', function ($loop, $variationData, \WP_Post $variation) use($groups) {

            $singleProductGroups = MetaRepository::get([
                'belongsTo' => BelongsTo::POST_ID,
                'find' => $variation->ID,
                'clonedFields' => true,
            ]);

            $groups = array_merge($groups, $singleProductGroups);

            foreach ($groups as $group){
                $generator = new WooCommerceProductVariationMetaGroup($group, $loop, $variationData, $variation);
                echo $generator->render();
            }
        }, 10, 3);
    }

    /**
     * @param MetaGroupModel[] $groups
     */
    private function saveData($groups)
    {
        add_action( 'woocommerce_save_product_variation', function ($variationId, $loop) use($groups) {

            $singleProductGroups = MetaRepository::get([
                'belongsTo' => BelongsTo::POST_ID,
                'find' => $variationId,
                'clonedFields' => true,
            ]);

            $groups = array_merge($groups, $singleProductGroups);

            WPUtils::handleSavePost($variationId, $groups, $loop);
        }, 10, 2 );
    }
}
