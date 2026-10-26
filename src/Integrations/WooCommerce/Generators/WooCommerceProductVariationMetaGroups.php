<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\WPUtils;

class WooCommerceProductVariationMetaGroups
{
    /**
     * Add product data
     */
    public function generate(): void
    {
        $this->renderGroups();
        $this->saveData();
    }

    /**
     * Render fields on WC product variation data
     */
    private function renderGroups(): void
    {
        add_action('woocommerce_product_after_variable_attributes', function ($loop, $variationData, \WP_Post $variation) {
            $singleProductGroups = MetaRepository::get([
                'belongsTo' => BelongsTo::POST_ID,
                'find' => $variation->ID,
                'clonedFields' => true,
            ]);

            $groups = MetaRepository::get([
                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                'find' => 'product_variation',
                'postId' => $variation->ID,
                'clonedFields' => true,
            ]);

            $groups = array_merge($groups, $singleProductGroups);

            foreach ($groups as $group) {
                $generator = new WooCommerceProductVariationMetaGroup($group, $loop, $variationData, $variation);
                echo $generator->render();
            }
        }, 10, 3);
    }

    /**
     * Save WC product variation data
     */
    private function saveData(): void
    {
        add_action('woocommerce_save_product_variation', function ($variationId, $loop) {
            $singleProductGroups = MetaRepository::get([
                'belongsTo' => BelongsTo::POST_ID,
                'find' => $variationId,
                'clonedFields' => true,
            ]);

            $groups = MetaRepository::get([
                'belongsTo' => MetaTypes::CUSTOM_POST_TYPE,
                'find' => 'product_variation',
                'postId' => $variationId,
                'clonedFields' => true,
            ]);

            $groups = array_merge($groups, $singleProductGroups);

            WPUtils::handleSavePost((int)$variationId, 'product_variation', $groups, $loop);
        }, 10, 2);
    }
}
