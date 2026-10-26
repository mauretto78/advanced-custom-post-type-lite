<?php

namespace ACPT_Lite\Integrations\WooCommerce\Generators;

use ACPT_Lite\Core\Generators\AbstractGenerator;
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
     * @param MetaBoxModel         $metaBoxModel
     * @param int                  $loop
     * @param array<string, mixed> $variationData
     * @param \WP_Post             $variation
     */
    public function __construct(MetaBoxModel $metaBoxModel, int $loop, array $variationData, \WP_Post $variation)
    {
        $this->metaBoxModel = $metaBoxModel;
        $this->loop = $loop;
        $this->variationData = $variationData;
        $this->variation = $variation;
    }

    /**
     * @return string|null
     * @throws \Exception
     */
    public function render(): ?string
    {
        if (empty($this->metaBoxModel->getFields())) {
            return null;
        }

        $boxLabel = (!empty($this->metaBoxModel->getLabel())) ? $this->metaBoxModel->getLabel() : $this->metaBoxModel->getName();
        $idBox = 'acpt_metabox_'. Strings::toDBFormat($this->metaBoxModel->getName());
        $rows = $this->fieldRows($this->metaBoxModel->getFields());

        $box = "<div class='acpt-admin-meta-wc-variation-box' id='".$idBox."'>";
        $box .= "<div class='acpt-admin-meta-wc-variation-box-header'>".$boxLabel."</div>";

        foreach ($rows as $row) {
            $box .= "<div class='acpt-admin-meta-row ".($row['isVisible'] == 0 ? ' hidden' : '')."'>";

            foreach ($row['fields'] as $field) {
                $box .= $field;
            }

            $box .= "</div>";
        }

        $box .= "</div>";

        return $box;
    }

    /**
     * @param array<int, \ACPT_Lite\Core\Models\Meta\MetaFieldModel> $fields
     * @return array<int, mixed>
     * @throws \Exception
     */
    private function fieldRows(array $fields): array
    {
        $rows = Fields::extractFieldRows($fields);
        $fieldRows = [];
        $visibleFieldsTotalCount = 0;

        // build the field rows array
        foreach ($rows as $index => $row) {
            $visibleFieldsRowCount = 0;

            foreach ($row as $field) {
                $fieldGenerator = new WooCommerceProductVariationMetaField($field, $this->loop, $this->variationData, $this->variation);
                $f = $fieldGenerator->generate();

                if ($f) {
                    if ($f->isVisible()) {
                        $visibleFieldsTotalCount++;
                        $visibleFieldsRowCount++;
                    }

                    $fieldRows[$index]['fields'][] = $f->render();
                    $fieldRows[$index]['isVisible'] = $visibleFieldsRowCount;
                }
            }
        }

        if ($visibleFieldsTotalCount > 0) {
            return $fieldRows;
        }

        return [];
    }
}
