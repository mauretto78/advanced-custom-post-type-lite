<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\Dataset\DatasetModel;
use ACPT_Lite\Core\Models\Dataset\DatasetModelItem;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class DatasetRepository extends AbstractRepository
{
	/**
	 * @return int
	 */
	public static function count(): int
	{
		$baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."`
            WHERE 1 = 1
            ";

		$results = ACPT_Lite_DB::getResults($baseQuery);

		return (int)$results[0]->count;
	}

	/**
	 * @param $id
	 *
	 * @throws \Exception
	 */
	public static function delete($id)
	{
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."` WHERE id = %s;", [$id]);
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM)."` WHERE dataset_id = %s;", [$id]);
		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $args
	 *
	 * @return DatasetModel[]
	 * @throws \Exception
	 */
	public static function get($args): array
	{
		$mandatoryKeys = [
			'id' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'page' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'perPage' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'sortedBy' => [
				'required' => false,
				'type' => 'string',
			],
			'lazy' => [
				'required' => false,
				'type' => 'boolean',
			],
		];

		self::validateArgs($mandatoryKeys, $args);

		$id = isset($args['id']) ? $args['id'] : null;
		$lazy = isset($args['lazy']) ? $args['lazy'] : false;
		$page = isset($args['page']) ? $args['page'] : false;
		$perPage = isset($args['perPage']) ? $args['perPage'] : null;

		$datasetQueryArgs = [];
		$datasetQuery = "
	        SELECT 
                d.id, 
                d.dataset_name as name,
                d.label
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."` d
            WHERE 1 = 1
	    ";

		if($id !== null){
			$datasetQuery .= " AND d.id = %s";
			$datasetQueryArgs[] = $id;
		}

		$datasetQuery .= ' GROUP BY d.id ORDER BY d.dataset_name ASC';

		if(isset($page) and isset($perPage)){
			$datasetQuery .= " LIMIT ".$perPage." OFFSET " . ($perPage * ($page - 1));
		}

		$datasets = ACPT_Lite_DB::getResults($datasetQuery, $datasetQueryArgs);
		$datasetModels = [];

		foreach ($datasets as $dataset){
			$datasetModels[] = self::hydrateDataset($dataset);
		}

		return $datasetModels;
	}

	/**
	 * @param $id
	 *
	 * @return DatasetModel|null
	 * @throws \Exception
	 */
	public static function getById($id): ?DatasetModel
	{
		$datasetQuery = "
	        SELECT 
                d.id, 
                d.dataset_name as name,
                d.label
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."` d
            WHERE id = %s
	    ";

		$datasets = ACPT_Lite_DB::getResults($datasetQuery, [$id]);

		if(count($datasets) !== 1){
			return null;
		}

		return self::hydrateDataset($datasets[0]);
	}

    /**
     * @return string[]
     */
    public static function getNames()
    {
        $names = [];
        $query = "
	        SELECT 
                d.id, 
                d.dataset_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."` d
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element){
            $names[] = $element->name;
        }

        return $names;
    }

	/**
	 * @param $dataset
	 *
	 * @return DatasetModel
	 * @throws \Exception
	 */
	private static function hydrateDataset($dataset)
	{
		$datasetModel = DatasetModel::hydrateFromArray([
			'id'       => $dataset->id,
			'name'     => $dataset->name,
			'label'    => $dataset->label,
		]);

		$itemsQuery = "
		        SELECT 
	                m.id, 
	                m.item_label as `label`,
	                m.item_value as `value`,
	                m.sort
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM)."` m
	            WHERE dataset_id = %s ORDER BY sort ASC
		    ";

		$items = ACPT_Lite_DB::getResults($itemsQuery, [$dataset->id]);

		foreach ($items as $index => $item){
			$metaDataModel = DatasetModelItem::hydrateFromArray([
				'id'        => $item->id,
				'dataset'   => $datasetModel,
				'value'     => $item->value,
				'label'     => $item->label,
				'isDefault' => false,
				'sort'      => (int)$item->sort,
			]);

			$datasetModel->addItem($metaDataModel);
		}

		return $datasetModel;
	}

	/**
	 * @param DatasetModel $datasetModel
	 *
	 * @throws \Exception
	 */
	public static function save(DatasetModel $datasetModel): void
	{
		ACPT_Lite_DB::startTransaction();

		try {
			$itemIds = [];

			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET)."` 
	            (`id`,
	            `dataset_name`,
	            `label`
	            ) VALUES (
	                %s,
	                %s,
	                %s
	            ) ON DUPLICATE KEY UPDATE 
	                `dataset_name` = %s,
	                `label` = %s
	        ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$datasetModel->getId(),
				$datasetModel->getName(),
				$datasetModel->getLabel(),
				$datasetModel->getName(),
				$datasetModel->getLabel(),
			]);

			// fields
			foreach ($datasetModel->getItems() as $itemIndex => $itemModel){

				$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM)."` 
		            (`id`,
		            `dataset_id`,
		            `item_label`,
		            `item_value`,
		            `is_default`,
		            `sort`
		            ) VALUES (
		                %s,
		                %s,
		                %s,
		                %s,
		                %s,
		                %d
		            ) ON DUPLICATE KEY UPDATE 
		                `dataset_id` = %s,
						`item_label` = %s,
						`item_value` = %s,
						`is_default` = %s,
						`sort` = %d
		        ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$itemModel->getId(),
					$datasetModel->getId(),
					$itemModel->getLabel(),
					$itemModel->getValue(),
					$itemModel->isDefault(),
					($itemIndex+1),
					$datasetModel->getId(),
					$itemModel->getLabel(),
					$itemModel->getValue(),
					$itemModel->isDefault(),
					($itemIndex+1),
				]);

				$itemIds[] = $itemModel->getId();
			}

			self::removeOrphans($datasetModel->getId(), $itemIds);

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

		ACPT_Lite_DB::commitTransaction();
		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $datasetId
	 * @param $ids
	 *
	 * @throws \Exception
	 */
	private static function removeOrphans($datasetId, $ids)
	{
		$deleteValidationRulesQuery = "
	    	DELETE i
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_DATASET_ITEM)."` i
			WHERE dataset_id = %s
	    ";

		if(!empty($ids)){
			$deleteValidationRulesQuery .= " AND i.id NOT IN ('".implode("','",$ids)."')";
			$deleteValidationRulesQuery .= ";";
		}

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery, [$datasetId]);
	}
}