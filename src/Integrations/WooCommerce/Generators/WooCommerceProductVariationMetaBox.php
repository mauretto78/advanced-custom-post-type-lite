<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeMetaBoxFieldGenerator;
use ACPT_Lite\Core\Helper\Fields;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;

class WooCommerceProductVariationMetaBox extends AbstractGenerator
{
    /**
     * @var MetaBoxModel
     */
    private MetaBoxModel $metaBoxModel;

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
     * WooCommerceProductVariationMetaBox constructor.
     * @param MetaBoxModel $metaBoxModel
     * @param $loop
     * @param $variationData
     * @param \WP_Post $variation
     */
    public function __construct(MetaBoxModel $metaBoxModel, $loop, $variationData, \WP_Post $variation)
    {
        $this->metaBoxModel = $metaBoxModel;
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
        if(empty($this->metaBoxModel->getFields())){
            return null;
        }

        $boxLabel = (!empty($this->metaBoxModel->getLabel())) ? $this->metaBoxModel->getLabel() : $this->metaBoxModel->getName();
        $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->metaBoxModel->getName());
        $rows = $this->fieldRows($this->metaBoxModel->getFields());

        $box = "<div class='acpt-admin-meta-wc-variation-box' id='".$idBox."'>";
        $box .= "<div class='acpt-admin-meta-wc-variation-box-header'>".$boxLabel."</div>";

        foreach ($rows as $row){
            $box .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

            foreach ($row['fields'] as $field){
                $box .= $field;
            }

            $box .= "</div>";
        }

        $box .= "</div>";

        return $box;
    }

    /**
     * @param $fields
     * @param $postId
     *
     * @return array
     * @throws \Exception
     */
    private function fieldRows($fields)
    {
        $rows = Fields::extractFieldRows($fields);
        $fieldRows = [];
        $visibleFieldsTotalCount = 0;

        // build the field rows array
        foreach ($rows as $index => $row){

            $visibleFieldsRowCount = 0;

            foreach ($row as $field){
                $fieldGenerator = new WooCommerceProductVariationMetaField($field, $this->loop, $this->variationData, $this->variation);
                $f = $fieldGenerator->generate();

                if($f){
                    if($f->isVisible()){
                        $visibleFieldsTotalCount++;
                        $visibleFieldsRowCount++;
                    }

                    $fieldRows[$index]['fields'][] = $f->render();
                    $fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
                }
            }
        }

        if($visibleFieldsTotalCount > 0){
            return $fieldRows;
        }

        return [];
    }
}
