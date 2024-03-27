<?php

namespace ACPT_Lite\Core\Generators\Meta;

use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\DataAggregator;
use ACPT_Lite\Utils\Wordpress\Translator;

class FieldBlockGenerator
{
	/**
	 * @var MetaFieldBlockModel
	 */
	private MetaFieldBlockModel $fieldBlockModel;

	/**
	 * @var array
	 */
	private $data = [];

	/**
	 * @var int
	 */
	private $dataId;

	/**
	 * @var
	 */
	private $belongsTo;

	/**
	 * @var
	 */
	private $parentName;

	/**
	 * @var
	 */
	private $parentBlockIndex;

	/**
	 * FieldBlockGenerator constructor.
	 *
	 * @param MetaFieldBlockModel $fieldBlockModel
	 * @param $parentName

	 * @param $belongsTo
	 */
	public function __construct(MetaFieldBlockModel $fieldBlockModel, $parentBlockIndex, $parentName, $belongsTo)
	{
		$this->fieldBlockModel = $fieldBlockModel;
		$this->data = [];
		$this->belongsTo = $belongsTo;
		$this->parentName = $parentName;
		$this->parentBlockIndex = $parentBlockIndex;
	}

	/**
	 * @param array $data
	 */
	public function setData($data)
	{
		$this->data = $data;
	}

	/**
	 * @param int $dataId
	 */
	public function setDataId( $dataId )
	{
		$this->dataId = $dataId;
	}

	/**
	 * @param $blocksListId
	 * @param null $blockIndex
	 *
	 * @return string
	 */
	public function generate($blocksListId, $blockIndex = null)
	{
		$label = (!empty($this->fieldBlockModel->getLabel())) ? $this->fieldBlockModel->getLabel() : $this->fieldBlockModel->getName();
		$id = 'block-'.rand(999999,111111);

		$block = '<li draggable="true" id="'.$id.'" class="sortable-li sortable-li-'.$blocksListId.' acpt_blocks_list_item">';
		$block .= '<input type="hidden" name="'. esc_attr($this->fieldBlockModel->getMetaField()->getDbName()) . '[blocks][' . $blockIndex . '][' . $this->fieldBlockModel->getNormalizedName() . ']" value="[]">';
		$block .= '<div class="handle">.<br/>.<br/>.</div>';
		$block .= '<div class="sortable-content">';
		$block .= '<div class="acpt_blocks_list_item_title">';
		$block .= '<h3><span>'.$label.'</span> <span class="acpt-badge acpt-badge-danger">BLOCK</span></h3>';
		$block .= '<div class="acpt_blocks_list_item_icons">';
		$block .= '<a title="'.Translator::translate("Remove this block").'" class="acpt_blocks_list_item_delete" data-target-id="'.$id.'" href="#">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
							<path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
						</svg>
					</a>';
		$block .= '<a title="'.Translator::translate("Show/hide elements in this block").'" class="acpt_blocks_list_item_toggle_visibility" data-target-id="'.$id.'" href="#">
						<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="components-panel__arrow" aria-hidden="true" focusable="false">
							<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path>
						</svg>
					</a>';
		$block .= '</div>';
		$block .= '</div>';
		$block .= '<div class="acpt_blocks_list_item_fields" data-parent-id="'.$id.'">';
		$block .= $this->generateBlockElements($blockIndex);
		$block .= '</div>';
		$block .= '<a 
			data-index="'.$blockIndex.'" 
			data-media-type="'.$this->belongsTo.'" 
			data-parent-name="'.$this->parentName.'" 
			data-block-id="'.$id.'" 
			data-group-id="'.$this->fieldBlockModel->getId().'" 
			href="#" 
			class="acpt_add_flexible_element_btn button small"
		>
			'.Translator::translate('Add').' '.$this->fieldBlockModel->getLabelOrName().'
		</a>';
		$block .= '</div>';
		$block .= '</li>';
		
		return $block;
	}

	/**
	 * @param $blockIndex
	 *
	 * @return string
	 */
	private function generateBlockElements($blockIndex)
	{
		$id = 'block-elements-'.$this->fieldBlockModel->getId(). '-'. $blockIndex;
		$list = '<ul id="'.$id.'" class="acpt_nested_fields_list acpt-nested-sortable">';
		$aggregateData = DataAggregator::aggregateNestedFieldsData($this->data);

		if(!empty($aggregateData)){
			foreach ($aggregateData as $elementIndex => $aggregateDatum){
				$list .= $this->generateElement($elementIndex, $blockIndex, $aggregateDatum);
			}
		} else {
			$list .= '<p data-message-id="'.$id.'" class="update-nag notice notice-warning inline no-records">'.Translator::translate('No elements saved, generate the first one clicking on "Add element" button').'</p>';
		}

		$list .= '</ul>';

		return $list;
	}

	/**
	 * @param $elementIndex
	 * @param $blockIndex
	 * @param array $data
	 *
	 * @return string
	 */
	public function generateElement($elementIndex, $blockIndex, array $data = [])
	{
		$id = 'element-'.rand(999999,111111);
		$element = '<li id="'.$id.'" draggable="true" class="sortable-li sortable-li-'.$this->fieldBlockModel->getId(). '-'. $blockIndex.'">';
		$element .= '<div class="handle">.<br/>.<br/>.</div>';
		$element .= '<div class="sortable-content">';

		foreach ($this->fieldBlockModel->getFields() as $fieldModel){
			$value = $this->getDafaultNestedFieldValue($data, $fieldModel->getNormalizedName());
			$flexibleField = $this->getFlexibleField($fieldModel, $elementIndex, $blockIndex, $value);
			$element .= $flexibleField->render();
		}

		$element .= '</div>';
		$element .= '<a class="button small button-danger remove-grouped-element" data-element="element" data-elements="elements" data-target-id="'.$id.'" href="#">'.Translator::translate('Remove').' '.$this->fieldBlockModel->getLabelOrName().'</a>';
		$element .= '</li>';

		return $element;
	}

	/**
	 * @param $data
	 * @param $key
	 *
	 * @return string
	 */
	private function getDafaultNestedFieldValue($data, $key)
	{
		if(empty($data)){
			return null;
		}

		foreach ($data as $datum){
			if($key === $datum['key']){
				return $datum['value'];
			}
		}

		return null;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $elementIndex
	 * @param $blockIndex
	 * @param null $value
	 *
	 * @return AbstractField|null
	 */
	private function getFlexibleField(MetaFieldModel $fieldModel, $elementIndex, $blockIndex, $value = null )
	{
		$className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$fieldModel->getType().'Field';

		if(class_exists($className)){
			return new $className($fieldModel, $this->belongsTo, $this->dataId, $elementIndex, $value, $this->parentName, $blockIndex);
		}

		return null;
	}
}
