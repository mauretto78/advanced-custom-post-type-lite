<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\RepeaterFieldGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class RepeaterField extends AbstractField
{
	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function render()
	{
		$nestedFieldsChecks = $this->nestedFieldsChecks($this->metaField->getChildren());
		$this->enqueueNestedFieldsAssets($nestedFieldsChecks);
		$idName = esc_attr($this->getIdName());
		$nestedListId = Strings::generateRandomId();
		$minimumBlocks = $this->getAdvancedOption('minimum_blocks');
		$maximumBlocks = $this->getAdvancedOption('maximum_blocks');
		$layout = $this->getAdvancedOption('layout') !== null ? $this->getAdvancedOption('layout') : 'row';
		$leadingFieldId = $this->getAdvancedOption('leading_field');

		if($this->isChild()){
			$btnStyle = 'margin-top: 15px; margin-right: 5px;';
			$field = '<input type="hidden" name="'. $idName.'[type]" value="'.MetaFieldModel::REPEATER_TYPE.'">';
			$field .= '<input type="hidden" name="'. $idName.'[original_name]" value="'.$this->metaField->getName().'">';

			if($this->hasChildren()){
				$idName = Strings::toDBFormat($this->metaField->getBox()->getName()) . '_' . Strings::toDBFormat($this->metaField->getName());
				$field .= '<input type="hidden" name="'. $idName.'_type" value="'.MetaFieldModel::REPEATER_TYPE.'">';

				if($minimumBlocks){
					$field .= '<input type="hidden" name="'. $idName.'_min_blocks" value="'.$minimumBlocks.'">';
				}

				if($maximumBlocks){
					$field .= '<input type="hidden" name="'. $idName.'_max_blocks" value="'.$maximumBlocks.'">';
				}
			}

		} else {
			$btnStyle = 'margin-right: 5px;';
			$field = '<input type="hidden" name="'. $idName .'_type" value="'.MetaFieldModel::REPEATER_TYPE.'">';

			if($minimumBlocks){
				$field .= '<input type="hidden" name="'. $idName.'_min_blocks" value="'.$minimumBlocks.'">';
			}

			if($maximumBlocks){
				$field .= '<input type="hidden" name="'. $idName.'_max_blocks" value="'.$maximumBlocks.'">';
			}
		}

		$field .= '<div style="width: 100%">';
		$field .= $this->renderRepeaterLayout($layout, $nestedListId, $minimumBlocks, $maximumBlocks, $leadingFieldId);

		if($this->isNestedInABlock()){
			$btnStyle .= "margin-top: 10px;";
		}

		$field .= '<a 
			style="'.$btnStyle.'" 
			data-layout="'.$layout.'"
			data-parent-index="'.$nestedListId.'" 
			data-parent-name="'.$this->getIdName().'" 
			data-media-type="'.$this->getBelongsTo().'"
			data-group-id="'.$this->metaField->getId().'" 
			href="#" 
			class="add-grouped-element button small"
		>
			'.Translator::translate('Add').' '.$this->metaField->getLabelOrName().'
		</a>';
		$field .= '<a 
			style="'.$btnStyle.'" 
			data-layout="'.$layout.'"
			data-parent-index="'.$nestedListId.'" 
			data-parent-name="'.$this->getIdName().'" 
			data-media-type="'.$this->getBelongsTo().'"
			data-group-id="'.$this->metaField->getId().'" 
			data-element="'.$this->metaField->getLabelOrName().'" 
			data-elements="elements"
			href="#" 
			class="remove-all-grouped-elements button button-danger small"
		>
			'.Translator::translate('Delete all').' '.$this->metaField->getLabelOrName().'
		</a>';

		if($minimumBlocks or $maximumBlocks){
			$field .= '<div class="acpt-min-max-counts float-right">';
		}

		if($minimumBlocks){
			$field .= '<span class="min">'.Translator::translate('Minimum elements required').' <span class="count">'.$minimumBlocks.'</span></span>';
		}

		if($maximumBlocks){
			$field .= '<span class="max">'.Translator::translate('Maximum elements allowed').' <span class="count">'.$maximumBlocks.'</span></span>';
		}

		if($minimumBlocks or $maximumBlocks){
			$field .= '</div>';
		}

		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @param $layout
	 * @param $nestedListId
	 * @param null $minimumBlocks
	 * @param null $maximumBlocks
	 * @param null $leadingFieldId
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function renderRepeaterLayout(
		$layout,
		$nestedListId,
		$minimumBlocks = null,
		$maximumBlocks = null,
		$leadingFieldId = null
	)
	{
		$defaultData = $this->getNestedFieldDefaultData();

		if($layout === 'table'){
			return $this->renderRepeaterWithTableLayout($nestedListId, $defaultData, $minimumBlocks, $maximumBlocks);
		}

		if($layout === 'block'){
			return $this->renderRepeaterWithBlockLayout($nestedListId, $defaultData, $minimumBlocks, $maximumBlocks, $leadingFieldId);
		}

		return $this->renderRepeaterWithRowLayout($nestedListId, $defaultData, $minimumBlocks, $maximumBlocks, $leadingFieldId);
	}

	/**
	 * @param $nestedListId
	 * @param $defaultData
	 * @param null $minimumBlocks
	 * @param null $maximumBlocks
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function renderRepeaterWithTableLayout(
		$nestedListId,
		$defaultData,
		$minimumBlocks = null,
		$maximumBlocks = null
	)
	{
		$field = '<div class="acpt-table-responsive" style="margin: 10px 0;">';
		$field .= '<table class="acpt-table">';
		$field .= '<tbody id="acpt-sortable-'.$nestedListId.'" class="acpt-sortable"';
		$field .= $this->appendDataValidateAndLogicAttributes();

		if($minimumBlocks){
			$field .= ' data-min-blocks="'.$minimumBlocks.'"';
		}

		if($maximumBlocks){
			$field .= ' data-max-blocks="'.$maximumBlocks.'"';
		}

		$field .= '>';
		$field .= '<tr>';
		$field .= '<th width="30"></th>';

		foreach ($this->metaField->getChildren() as $child){
			$field .= '<th>'.$child->getLabelOrName().'</th>';
		}

		$field .= '<th></th>';
		$field .= '</tr>';

		if($defaultData and $defaultData !== '' and is_array($defaultData)) {
			$repeaterFieldGenerator = new RepeaterFieldGenerator(
				$this->metaField, $this->getIdName(),
				$nestedListId,
				$this->getBelongsTo(),
				'table'
			);
			$repeaterFieldGenerator->setDataId($this->find);
			$repeaterFieldGenerator->setData($defaultData);

			$field .= $repeaterFieldGenerator->generate();
		} else {
			$field .= '<tr><td colspan="'.(count($this->metaField->getChildren())+2).'"><p data-message-id="'.$this->metaField->getId().'" class="update-nag notice notice-warning inline no-records">'.Translator::translate('No fields saved, generate the first one clicking on "Add element" button').'</p></td></tr>';
		}

		$field .= '</tbody>';
		$field .= '</table>';
		$field .= '</div>';

		return $field;
	}

	/**
	 * @param $nestedListId
	 * @param $defaultData
	 * @param null $minimumBlocks
	 * @param null $maximumBlocks
	 * @param null $leadingFieldId
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function renderRepeaterWithBlockLayout(
		$nestedListId,
		$defaultData,
		$minimumBlocks = null,
		$maximumBlocks = null,
		$leadingFieldId = null
	)
	{
		$field = '<ul id="acpt-sortable-'.$nestedListId.'" class="acpt-sortable '.$this->getGridCssClass().'"';
		$field .= $this->appendDataValidateAndLogicAttributes();

		if($minimumBlocks){
			$field .= ' data-min-blocks="'.$minimumBlocks.'"';
		}

		if($maximumBlocks){
			$field .= ' data-max-blocks="'.$maximumBlocks.'"';
		}

		$field .= '>';

		if($defaultData and $defaultData !== '' and is_array($defaultData)) {
			$repeaterFieldGenerator = new RepeaterFieldGenerator(
				$this->metaField, $this->getIdName(),
				$nestedListId,
				$this->getBelongsTo(),
				'block',
				$leadingFieldId
			);
			$repeaterFieldGenerator->setDataId($this->find);
			$repeaterFieldGenerator->setData($defaultData);

			$field .= $repeaterFieldGenerator->generate();
		} else {
			$field .= '<p data-message-id="'.$this->metaField->getId().'" class="update-nag notice notice-warning inline no-records">'.Translator::translate('No fields saved, generate the first one clicking on "Add element" button').'</p>';
		}

		$field .= '</ul>';

		return $field;
	}

	/**
	 * @param $nestedListId
	 * @param $defaultData
	 * @param null $minimumBlocks
	 * @param null $maximumBlocks
	 * @param null $leadingFieldId
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function renderRepeaterWithRowLayout(
		$nestedListId,
		$defaultData,
		$minimumBlocks = null,
		$maximumBlocks = null,
		$leadingFieldId = null
	)
	{
		$field = '<ul id="acpt-sortable-'.$nestedListId.'" class="acpt-sortable '.$this->getGridCssClass().'"';
		$field .= $this->appendDataValidateAndLogicAttributes();

		if($minimumBlocks){
			$field .= ' data-min-blocks="'.$minimumBlocks.'"';
		}

		if($maximumBlocks){
			$field .= ' data-max-blocks="'.$maximumBlocks.'"';
		}

		$field .= '>';

		if($defaultData and $defaultData !== '' and is_array($defaultData)) {
			$repeaterFieldGenerator = new RepeaterFieldGenerator(
				$this->metaField, $this->getIdName(),
				$nestedListId,
				$this->getBelongsTo(),
				'row',
				$leadingFieldId,
                $this->cloneFieldId
			);
			$repeaterFieldGenerator->setDataId($this->find);
			$repeaterFieldGenerator->setData($defaultData);

			$field .= $repeaterFieldGenerator->generate();
		} else {
			$field .= '<p data-message-id="'.$this->metaField->getId().'" class="update-nag notice notice-warning inline no-records">'.Translator::translate('No fields saved, generate the first one clicking on "Add element" button').'</p>';
		}

		$field .= '</ul>';

		return $field;
	}

	/**
	 * @return mixed|null
	 */
	private function getNestedFieldDefaultData()
	{
		// LEVEL 1
		if(false === $this->getMetaField()->hasParent() and false === $this->metaField->hasParentBlock()){

		    if(!empty($this->value)){
		        return $this->value;
            }

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

		if(!is_array($parentData)){
			return [];
		}

		// LEVEL 3
		if(count($parentRootName) === 3){
			$parentData = $parentData[$parentRootName[1]][$parentRootName[2]];
		}

		// LEVEL 4
		if(count($parentRootName) === 5){
			$parentData = $parentData[$parentRootName[1]][$parentRootName[2]][$parentRootName[3]][$parentRootName[4]];
		}

		// LEVEL 5
		if(count($parentRootName) === 7){
			$parentData = $parentData[$parentRootName[1]][$parentRootName[2]][$parentRootName[3]][$parentRootName[4]][$parentRootName[5]][$parentRootName[6]];
		}

		// this is a nested block
		if($this->getMetaField()->hasParentBlock()){

			if(
				!isset($parentData['blocks'][$this->getBlockIndex()]) and
				!isset($parentData['blocks'][$this->getBlockIndex()][$this->getParentBlock()->getName()]) and
				!isset($parentData['blocks'][$this->getBlockIndex()][$this->getParentBlock()->getName()][$this->getMetaField()->getName()]) and
				!isset($parentData['blocks'][$this->getBlockIndex()][$this->getParentBlock()->getName()][$this->getMetaField()->getName()][$this->getIndex()])
			){
				return [];
			}

			return $parentData['blocks'][$this->getBlockIndex()][$this->getParentBlock()->getName()][$this->getMetaField()->getName()][$this->getIndex()];
		}

		// this is a nested repeater
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
}