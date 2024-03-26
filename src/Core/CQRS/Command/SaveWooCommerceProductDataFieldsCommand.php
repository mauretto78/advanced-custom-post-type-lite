<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerce\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Repository\WooCommerceProductDataRepository;

class SaveWooCommerceProductDataFieldsCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveTaxonomyCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data)
	{
		$this->data = $data;
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$fields = [];
		$ids = [];
		$data = $this->data;

		if(!isset($data['fields'])){
			throw new \InvalidArgumentException("No `fields` send.");
		}

		foreach ($data['fields'] as $fieldIndex => $field ) {

			$productData = WooCommerceProductDataRepository::get([
				'id' => $field['productDataId']
			])[0];

			$fieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
				'id' => $field['id'],
				'productDataModel' => $productData,
				'name' => $field['name'],
				'type' => $field['type'],
				'defaultValue' => $field['defaultValue'],
				'description' => $field['description'],
				'required' => $field['isRequired'],
				'sort' => ($fieldIndex+1),
			]);

			$optionsIds = [];

			if(isset($field['options'])){
				foreach ($field['options'] as $optionIndex => $option){
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