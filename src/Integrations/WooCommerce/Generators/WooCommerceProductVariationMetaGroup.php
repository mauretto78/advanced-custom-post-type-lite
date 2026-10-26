<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class WooCommerceProductVariationMetaGroup extends AbstractGenerator
{
    /**
     * @var MetaGroupModel
     */
    private MetaGroupModel $groupModel;

    private int $loop;

    /**
     * @var array<string, mixed>
     */
    private array $variationData;

    /**
     * @var \WP_Post
     */
    private \WP_Post $variation;

    /**
     * @param MetaGroupModel       $groupModel
     * @param int                  $loop
     * @param array<string, mixed> $variationData
     * @param \WP_Post             $variation
     */
    public function __construct(MetaGroupModel $groupModel, int $loop, array $variationData, \WP_Post $variation)
    {
        $this->groupModel = $groupModel;
        $this->loop = $loop;
        $this->variationData = $variationData;
        $this->variation = $variation;
    }

    /**
     * @return string|null
     * @throws \Exception
     */
    public function render()
    {
        if (empty($this->groupModel->getBoxes())) {
            return null;
        }

        return $this->standardView();
    }

    /**
     * @return string
     * @throws \Exception
     */
    private function standardView(): string
    {
        $render = "<div class='acpt-admin-meta-wc-variation-group'>";

        foreach ($this->groupModel->getBoxes() as $metaBoxModel) {
            $generator = new WooCommerceProductVariationMetaBox($metaBoxModel, $this->loop, $this->variationData, $this->variation);
            $render .= $generator->render();
        }

        $render .= "</div>";

        return $render;
    }
}
