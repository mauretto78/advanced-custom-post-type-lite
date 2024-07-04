<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Dataset\DatasetModel;
use ACPT_Lite\Core\Models\Dataset\DatasetModelItem;
use ACPT_Lite\Core\Repository\DatasetRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

class SaveDatasetCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * @var bool
	 */
	private bool $emptyItems;

	/**
	 * SaveDatasetCommand constructor.
	 *
	 * @param array $data
	 * @param bool $emptyItems
	 */
	public function __construct(array $data, $emptyItems = false)
	{
		$this->data = $data;
		$this->emptyItems = $emptyItems;
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function execute(): string
	{
		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate(DatasetModel::validationRules(), $this->data)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}

		$data = $this->data;
		$id = (isset($data['id'])) ? $data['id'] : Uuid::v4();

		$datasetModel = DatasetModel::hydrateFromArray([
			'id'   => $id,
			'name' => @$data['name'],
			'label' => $data['label'] ? $data['label'] : null,
		]);

		// inject items
		if(isset($data['items']) and !empty($data['items'])){
			foreach ($data['items'] as $index => $item){
				$datasetItemModel = DatasetModelItem::hydrateFromArray([
					'id' => $item['id'],
					'dataset' => $datasetModel,
					'label' => $item['label'],
					'value' => $item['value'],
					'isDefault' => false,
					'sort' => (int)$index+1,
				]);

				$datasetModel->addItem($datasetItemModel);
			}
		} elseif($this->emptyItems === false) {
			// otherwise hydrate with saved items
			$savedDataset = DatasetRepository::getById($id);
			if($savedDataset !== null and !empty($savedDataset->getItems())){
				foreach ($savedDataset->getItems() as $item){
					$datasetModel->addItem($item);
				}
			}
		}

		DatasetRepository::save($datasetModel);

		return $id;
	}
}