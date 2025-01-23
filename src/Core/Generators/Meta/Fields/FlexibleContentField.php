<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\FieldBlockGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\Translator;

class FlexibleContentField extends AbstractField
{
	/**
	 * @return string
	 * @throws \Exception
	 */
	public function render()
	{
		$idName = esc_attr($this->getIdName());
		$minimumBlocks = $this->getAdvancedOption('minimum_blocks');
		$maximumBlocks = $this->getAdvancedOption('maximum_blocks');
		$layout = $this->getAdvancedOption('layout') !== null ? $this->getAdvancedOption('layout') : 'row';
		$leadingFieldId = $this->getAdvancedOption('leading_field');
		$blocksListId = 'blocks_list_'.rand(999999,111111);
		$this->enqueueNestedFieldsAssets($this->checkNestedFields());

		$field = '<input type="hidden" name="'. $idName.'_type" value="'.MetaFieldModel::FLEXIBLE_CONTENT_TYPE.'">';

		if($minimumBlocks){
			$field .= '<input type="hidden" name="'. $idName.'_min_blocks" value="'.$minimumBlocks.'">';
		}

		if($maximumBlocks){
			$field .= '<input type="hidden" name="'. $idName.'_max_blocks" value="'.$maximumBlocks.'">';
		}

		$field .= '<div class="acpt_flexible">';
		$field .= $this->blocksList($blocksListId, $minimumBlocks, $maximumBlocks, $layout, $leadingFieldId);
		$field .= $this->addButton($blocksListId, $layout);
		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @param $blocksListId
	 * @param null $minimumBlocks
	 * @param null $maximumBlocks
	 * @param string $layout
	 * @param null $leadingFieldId
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function blocksList($blocksListId, $minimumBlocks = null, $maximumBlocks = null, $layout = 'row', $leadingFieldId = null)
	{
		$list = '<ul id="acpt-sortable-'.$blocksListId.'" class="acpt_blocks_list acpt-sortable '.$this->getGridCssClass().'"';
		$list .= $this->appendDataValidateAndLogicAttributes();
		$list .= '>';

		$defaultData = $this->getNestedBlockDefaultData();

		if($defaultData and $defaultData !== '' and is_array($defaultData) and isset($defaultData['blocks'])){

			$blockIndex = 0;

			foreach ($defaultData['blocks'] as $blockRawData){
				foreach ($blockRawData as $blockName => $blockRawDatum){
					$blockModel = MetaRepository::getMetaBlockByName($this->getOriginalBlockName($blockName));

					if($blockModel !== null){
						$flexibleFieldGenerator = new FieldBlockGenerator(
							$blockModel,
							$this->blockIndex,
							$this->getIdName(),
							$this->belongsTo,
							$layout,
							$leadingFieldId,
							$minimumBlocks,
							$maximumBlocks
						);
						$flexibleFieldGenerator->setData($blockRawDatum);
						$flexibleFieldGenerator->setDataId($this->find);
						$list .= $flexibleFieldGenerator->generate($blocksListId, $blockIndex);
					}

					$blockIndex++;
				}
			}

		} else {
			$list .= '<p data-message-id="'.$this->metaField->getId().'" class="update-nag notice notice-warning inline no-records">'.Translator::translate('No blocks saved, generate the first one clicking on "Add block" button').'</p>';
		}

		$list .= '</ul>';

		return $list;
	}

	/**
	 * @return array|mixed|null
	 */
	private function getNestedBlockDefaultData()
	{
		// LEVEL 1
		if(false === $this->getMetaField()->hasParent() and false === $this->metaField->hasParentBlock()){
			return $this->getData($this->getIdName());
		}

		// Nested repeaters or blocks from here

		$parentRootName = str_replace("]", "", $this->parentName);
		$parentRootName = explode("[", $parentRootName );

		if(empty($parentRootName)){
			return [];
		}

		// LEVEL 2
		$parentData = $this->getData($parentRootName[0]);

		// LEVEL 3
		// LEVEL 5
		// LEVEL 5

		// this is a nested repeater
		if($this->getMetaField()->hasParent()){

			if(
				!isset($parentData[$this->getMetaField()->getName()]) and
				!isset($parentData[$this->getMetaField()->getName()][$this->getIndex()])
			){
				return [];
			}

			$data = $parentData[$this->getMetaField()->getName()][$this->getIndex()];

			if(!is_array($data)){
				return [];
			}

			// unset unneeded data
			unset($data['original_name']);
			unset($data['type']);

			return $data;
		}

		// this is a nested block
		if(!isset($parentData['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()]) or !is_array($parentData['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()])){
			return [];
		}

		return $parentData['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$this->getMetaField()->getName()][$this->getIndex()];
	}

	/**
	 * @param $name
	 *
	 * @return mixed
	 */
	private function getOriginalBlockName($name)
	{
		foreach ($this->metaField->getBlocks() as $blockModel){
			if($blockModel->getNormalizedName() === $name){
				return $blockModel->getName();
			}
		}

		return $name;
	}

	/**
	 * @param $blocksListId
	 * @param $layout
	 *
	 * @return string|void
	 */
	private function addButton($blocksListId, $layout)
	{
		if(empty($this->metaField->getBlocks())){
			return Translator::translate('First, you need to add a block in ACPT settings.');
		}

		$minimumBlocks = $this->getAdvancedOption('minimum_blocks');
		$maximumBlocks = $this->getAdvancedOption('maximum_blocks');

		$button = '<div class="acpt_add_flexible_block">';
		$button .= '<div>';
		$button .= '<button class="button acpt_add_flexible_btn"';

		if($minimumBlocks){
			$button .= ' data-min-blocks="'.$minimumBlocks.'"';
		}

		if($maximumBlocks){
			$button .= ' data-max-blocks="'.$maximumBlocks.'"';
		}

		$button .= '>';
		$button .= '<span class="acpt_add_flexible_btn_label">'.Translator::translate('Add block').'</span>';
		$button .= '<span class="acpt_add_flexible_btn_icon">
					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="components-panel__arrow" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>
					</span>';
		$button .= '</button>';
		$button .= '<ul class="acpt_flexible_block_items">';

		foreach ($this->metaField->getBlocks() as $block){
			$label = (!empty($block->getLabel())) ? $block->getLabel() : $block->getName();
			$button .= '<li 
					class="acpt_flexible_block_item" 
					data-layout="'.$layout.'"
					data-min-blocks="'.$minimumBlocks.'"
					data-max-blocks="'.$maximumBlocks.'"
					data-block-list-id="'.$blocksListId.'"
					data-block-index="'.$this->blockIndex.'"
					data-field-id="'.$this->metaField->getId().'" 
					data-parent-name="'.$this->getIdName().'" 
					data-media-type="'.$this->getBelongsTo().'" 
					data-value="'.$block->getId().'"
				>
					'.$label.'
				</li>';
		}

		$button .= '</ul>';
		$button .= '<a 
			style="margin-left: 5px;" 
			data-block-list-id="'.$blocksListId.'" 
			data-min-blocks="'.$minimumBlocks.'"
			data-max-blocks="'.$maximumBlocks.'"
			class="remove-all-blocks button button-danger small" href="#">
				'.Translator::translate('Delete all blocks').'
			</a>';
		$button .= '</div>';

		if($minimumBlocks or $maximumBlocks){
			$button .= '<div class="acpt-min-max-counts">';
		}

		if($minimumBlocks){
			$button .= '<span class="min">'.Translator::translate('Min blocks required').' <span class="count">'.$minimumBlocks.'</span></span>';
		}

		if($maximumBlocks){
			$button .= '<span class="max">'.Translator::translate('Max blocks allowed').' <span class="count">'.$maximumBlocks.'</span></span>';
		}

		if($minimumBlocks or $maximumBlocks){
			$button .= '</div>';
		}

		$button .= '</div>';

		return $button;
	}

	/**
	 * @return array
	 */
	private function checkNestedFields()
	{
		if(empty($this->metaField->getBlocks())){
			return [];
		}

		$return = [];

		foreach ($this->metaField->getBlocks() as $blockModel){
			$return = array_merge($return, $this->nestedFieldsChecks($blockModel->getFields()));
		}

		return $return;
	}
}