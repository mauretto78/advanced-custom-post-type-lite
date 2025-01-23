<?php

namespace ACPT_Lite\Core\Models\Dataset;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

/**
 * Class DatasetModelItem
 * @package ACPT\Core\Models\Meta
 */
class DatasetModelItem extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var DatasetModel
	 */
	private DatasetModel $dataset;

	/**
	 * @var string
	 */
	private string $label;

	/**
	 * @var string
	 */
	private string $value;

	/**
	 * @var int
	 */
	private int $sort;

	/**
	 * @var bool
	 */
	private bool $isDefault = false;

	/**
	 * DatasetModelItem constructor.
	 *
	 * @param string $id
	 * @param DatasetModel $dataset
	 * @param string $label
	 * @param string $value
	 * @param int $sort
	 * @param bool $isDefault
	 */
	public function __construct(
		string $id,
		DatasetModel $dataset,
		string $label,
		string $value,
		int $sort,
		bool $isDefault = false
	) {
		parent::__construct($id);
		$this->dataset = $dataset;
		$this->label = $label;
		$this->value = $value;
		$this->sort  = $sort;
		$this->isDefault  = $isDefault;
	}

	/**
	 * @return DatasetModel
	 */
	public function getDataset(): DatasetModel
	{
		return $this->dataset;
	}

	/**
	 * @return string
	 */
	public function getLabel(): string
	{
		return $this->label;
	}

	/**
	 * @return string
	 */
	public function getValue(): string
	{
		return $this->value;
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @return bool
	 */
	public function isDefault(): bool
	{
		return $this->isDefault;
	}

    /**
     * @param DatasetModel $datasetModel
     * @return DatasetModelItem
     */
    public function duplicateFrom(DatasetModel $datasetModel)
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->dataset = $datasetModel;

        return $duplicate;
    }

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->id,
			'label' => $this->label,
			'value' => $this->value,
			'sort' => (int)$this->sort,
			'isDefault' => $this->isDefault()
		];
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'datasetId' => [
				'required' => false,
				'type' => 'string',
			],
			'dataset' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => DatasetModel::class
			],
			'label' => [
				'required' => true,
				'type' => 'string',
			],
			'value' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'isDefault' => [
				'required' => false,
				'type' => 'boolean',
			],
		];
	}
}