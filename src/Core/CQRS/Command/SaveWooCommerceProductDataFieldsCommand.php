<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class SaveWooCommerceProductDataFieldsCommand implements CommandInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * SaveTaxonomyCommand constructor.
     *
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return array<int, array<string, mixed>>
     * @throws \Exception
     */
    public function execute(): array
    {
        $fields = [];
        $ids = [];
        $data = $this->data;

        if (!isset($data['fields'])) {
            throw new \InvalidArgumentException("No `fields` send.");
        }

        // productDataId identifies which product-data tab this whole save
        // belongs to -- it's a single, request-level value (the frontend
        // submits it once, as a top-level hidden input), not a per-field
        // one. Resolve it once here rather than re-reading a `productDataId`
        // key off each individual $field, which never exists there.
        if (empty($data['productDataId'])) {
            throw new \InvalidArgumentException("No `productDataId` send.");
        }

        $productData = WooCommerceProductDataRepository::get([
            'id' => $data['productDataId']
        ])[0];

        foreach ($data['fields'] as $fieldIndex => $field) {
            $fieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                'id' => $field['id'],
                'productDataModel' => $productData,
                'name' => $field['name'],
                'type' => $field['type'],
                'defaultValue' => $field['defaultValue'] ?? null,
                'description' => $field['description'] ?? null,
                'required' => $field['isRequired'] ?? false,
                'sort' => ($fieldIndex+1),
            ]);

            $optionsIds = [];

            if (isset($field['options'])) {
                foreach ($field['options'] as $optionIndex => $option) {
                    $optionModel = WooCommerceProductDataFieldOptionModel::hydrateFromArray([
                        'id' => $option['id'],
                        'productDataField' => $fieldModel,
                        'label' => $option['label'],
                        'value' => $option['value'],
                        'sort' => ($optionIndex+1),
                    ]);

                    $fieldModel->addOption($optionModel);
                    $optionsIds[] = $optionModel->getId();
                }
            }

            $fields[] = $fieldModel;
            $ids[] = [
                'product_data_id' => $fieldModel->getProductData()->getId(),
                'field' => $fieldModel->getId(),
                'options' => $optionsIds
            ];
        }

        WooCommerceProductDataRepository::saveFields($fields);

        // remove orphans
        WooCommerceProductDataRepository::removeFieldsOrphans($ids);

        return $ids;
    }
}
