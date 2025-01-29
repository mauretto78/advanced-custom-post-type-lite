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
     * WooCommerceProductVariationMetaGroup constructor.
     * @param MetaGroupModel $groupModel
     * @param $loop
     * @param $variationData
     * @param \WP_Post $variation
     */
    public function __construct(MetaGroupModel $groupModel, $loop, $variationData, \WP_Post $variation)
    {
        $this->groupModel = $groupModel;
        $this->loop = $loop;
        $this->variationData = $variationData;
        $this->variation = $variation;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function render()
    {
        if(empty($this->groupModel->getBoxes())){
            return null;
        }

        return $this->standardView();
    }

    /**
     * Standard view
     * @throws \Exception
     */
    private function standardView()
    {
        $render = "<div class='acpt-admin-meta-wc-variation-group'>";

        foreach ($this->groupModel->getBoxes() as $metaBoxModel){
            $generator = new WooCommerceProductVariationMetaBox($metaBoxModel, $this->loop, $this->variationData, $this->variation);
            $render .= $generator->render();
        }

        $render .= "</div>";

        return $render;
    }
}
