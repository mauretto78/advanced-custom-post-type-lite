<?php

namespace ACPT_Lite\Core\Models\Dataset;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Repository\DatasetRepository;

/**
 * Class DatasetModelItem
 * @package ACPT\Core\Models\Meta
 */
class DatasetModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private string $name;

	/**
	 * @var string
	 */
	private string $label;

	/**
	 * @var DatasetModelItem[]
	 */
	private array $items = [];

	/**
	 * DatasetModel constructor.
	 *
	 * @param string $id
	 * @param string $name
	 * @param string|null $label
	 */
	public function __construct(
		string $id,
		string $name,
		string $label = null
	) {
		parent::__construct($id);
		$this->setName($name);
		$this->label = $label;
		$this->items = [];
	}

	/**
	 * @param $name
	 */
	public function changeName($name)
	{
		$this->setName($name);
	}

	/**
	 * @param $name
	 */
	private function setName($name)
	{
		if(!Strings::alphanumericallyValid($name)){
			throw new \DomainException($name . ' is not valid name');
		}

		$this->name = $name;
	}

	/**
	 * @return string
	 */
	public function getName(): string
	{
		return $this->name;
	}

	/**
	 * @return string
	 */
	public function getLabel(): string
	{
		return $this->label;
	}

	/**
	 * @param DatasetModelItem $item
	 */
	public function addItem(DatasetModelItem $item)
	{
		if(!$this->existsInCollection($item->getId(), $this->items)){
			$this->items[] = $item;
		}
	}

	/**
	 * @param DatasetModelItem $item
	 */
	public function removeItem(DatasetModelItem $item)
	{
		$this->items = $this->removeFromCollection($item->getId(), $this->items);
	}

	/**
	 * Clear all options
	 */
	public function clearItems()
	{
		$this->items = [];
	}

	/**
	 * @return DatasetModelItem[]
	 */
	public function getItems()
	{
		return $this->items;
	}

    /**
     * @return DatasetModel
     */
    public function duplicate(): DatasetModel
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), DatasetRepository::getNames()));

        $items = $duplicate->getItems();
        $duplicate->items = [];

        foreach ($items as $itemModel){
            $duplicate->items[] = $itemModel->duplicateFrom($duplicate);
        }

        return $duplicate;
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
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'items' => [
				'required' => false,
				'type' => 'array',
			],
		];
	}

	/**
	 * @inheritDoc
	 */
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'items' => $this->getItems(),
		];
	}
}