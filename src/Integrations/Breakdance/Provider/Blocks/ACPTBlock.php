<?php

namespace ACPT_Lite\Integrations\Breakdance\Provider\Blocks;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use Breakdance\DynamicData\LoopController;
use Breakdance\DynamicData\RepeaterData;
use Breakdance\DynamicData\RepeaterField;

class ACPTBlock extends RepeaterField
{
	/**
	 * @var MetaFieldBlockModel
	 */
	protected MetaFieldBlockModel $blockModel;

	/**
	 * @var LoopController
	 */
	private LoopController $loop;

	/**
	 * @var int
	 */
	private $limit;

	/**
	 * @var int
	 */
	private $fieldIndex;

	/**
	 * @var int
	 */
	private $blockIndex;

	/**
	 * AbstractACPTField constructor.
	 *
	 * @param MetaFieldBlockModel $blockModel
	 */
	public function __construct(MetaFieldBlockModel $blockModel)
	{
		$this->blockModel = $blockModel;
		$this->loop = \Breakdance\DynamicData\LoopController::getInstance($blockModel->getId());
		$this->limit = 0;
	}

	/**
	 * @inheritDoc
	 */
	public function label()
	{
		$label = '';
		$label .= '['.$this->blockModel->getMetaField()->getBox()->getGroup()->getName() . ']';
		$label .= ' - ' . $this->blockModel->getMetaField()->getBox()->getName() . ' ' . $this->blockModel->getMetaField()->getName() . ' #' . $this->blockModel->getName();

		return $label;
	}

	/**
	 * @inheritDoc
	 */
	public function slug()
	{
		return $this->blockModel->getMetaField()->getBox()->getName() . '_' . $this->blockModel->getMetaField()->getName() . '_#_' . $this->blockModel->getName();
	}

	/**
	 * @return string
	 */
	public function category()
	{
		return 'ACPT';
	}

	/**
	 *@return string
	 */
	public function subcategory()
	{
		return 'blocks';
	}

	/**
	 * @inheritDoc
	 */
	public function hasSubFields( $postId = null )
	{
		$blockLoop = $this->loop->get();

		// @TODO handle Taxonomy sub fields

		if( $this->blockModel->getMetaField()->getBox()->getGroup()->belongsTo(MetaTypes::CUSTOM_POST_TYPE)){

			if($postId === null){
				$postId = get_the_ID();
			}

			if($postId === null){
				return null;
			}

			$nestedBlocks = get_acpt_block([
				'post_id' => $postId,
				'box_name' => $this->blockModel->getMetaField()->getBox()->getName(),
				'parent_field_name' => $this->blockModel->getMetaField()->getName(),
				'block_name' => $this->blockModel->getName(),
			]);

		} elseif( $this->blockModel->getMetaField()->getBox()->getGroup()->belongsTo(MetaTypes::OPTION_PAGE)){

			$nestedBlocks = get_acpt_block([
				'option_page' => $this->blockModel->getMetaField()->getFindLabel() ?? 'test',
				'box_name' => $this->blockModel->getMetaField()->getBox()->getName(),
				'parent_field_name' => $this->blockModel->getMetaField()->getName(),
				'block_name' => $this->blockModel->getName(),
			]);
		}

		if(empty($nestedBlocks)){
			return false;
		}

		$maxLoops = -1;
		$blockIndexMap = [];

		//
		// Create an block index map, with the block index and the corresponding values count.
		//
		// Example:
		//
		// 0 => 2
		// 1 => 3
		// 2 => 2
		//
		foreach ($nestedBlocks as $nestedBlock){
			foreach ($nestedBlock as $nestedBlockName => $nestedBlockValues){
				$countOfNestedValues = count($nestedBlockValues[array_keys($nestedBlockValues)[0]]);
				$maxLoops = $maxLoops + $countOfNestedValues;
				$blockIndexMap[] = $countOfNestedValues;
			}
		}

		$this->blockIndex = $this->calculateBlockIndex($blockIndexMap);
		$this->fieldIndex = $this->calculateFieldIndex($blockIndexMap);

		if($maxLoops <= $blockLoop['limit']){
			$this->limit = 0;
			$this->blockIndex = 0;
			$this->fieldIndex =  0;
			$this->loop->reset();

			return false;
		}

		$this->loop->set([
			'block' => $this->blockModel,
			'limit' => $this->limit,
			'block_index' => $this->blockIndex,
			'field_index' => $this->fieldIndex,
		]);

		$this->limit++;

		return true;
	}

	/**
	 * @param $blockIndexMap
	 *
	 * @return int|string
	 */
	private function calculateBlockIndex($blockIndexMap)
	{
		$calculatedBlockIndex = 0;
		foreach ($blockIndexMap as $blockIndex => $countOfNestedValues){
			$calculatedBlockIndex = $calculatedBlockIndex + $countOfNestedValues;

			if($this->limit < $calculatedBlockIndex){
				return $blockIndex;
			}
		}
	}

	/**
	 * @param $blockIndexMap
	 *
	 * @return int
	 */
	private function calculateFieldIndex($blockIndexMap)
	{
		if($this->blockIndex > 0){
			$indexRest = 0;
			for ($i = 0; $i < $this->blockIndex; $i++){
				$indexRest = $indexRest + $blockIndexMap[$i];
			}

			return $this->limit - $indexRest;
		}

		return $this->limit;
	}

	/**
	 * @inheritDoc
	 */
	public function setSubFieldIndex( $index )
	{
		// TODO: Implement setSubFieldIndex() method.
	}

	/**
	 * @inheritDoc
	 */
	public function parentField()
	{
		// TODO: Implement parentField() method.
	}

	/**
	 * @inheritDoc
	 */
	public function handler( $attributes ): RepeaterData
	{
		return RepeaterData::fromArray([]);
	}
}