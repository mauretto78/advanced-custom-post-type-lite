<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Relationships;
use ACPT_Lite\Core\Generators\Validation\DataValidateAttributes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Browser;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

abstract class AbstractField
{
	const ERRORS_SESSION_KEY = 'meta_field_errors';

	/**
	 * @var MetaFieldModel
	 */
	protected MetaFieldModel $metaField;

	/**
	 * @var MetaFieldModel
	 */
	protected ?MetaFieldModel $parentMetaField = null;

	/**
	 * @var MetaFieldBlockModel
	 */
	protected ?MetaFieldBlockModel $parentBlock = null;

	/**
	 * @var string
	 */
	protected $belongsTo;

	/**
	 * @var string
	 */
	protected $find;

	/**
	 * @var
	 */
	protected $index = 0;

	/**
	 * @var
	 */
	protected $value;

	/**
	 * @var null
	 */
	protected $parentName;

	/**
	 * @var int
	 */
	protected int $blockIndex;

	/**
	 * AbstractField constructor.
	 *
	 * @param MetaFieldModel $metaField
	 * @param $belongsTo
	 * @param $find
	 * @param int $index
	 * @param null $value
	 * @param null $parentName
	 * @param int $blockIndex
	 *
	 * @throws \Exception
	 */
	public function __construct(
		MetaFieldModel $metaField,
		$belongsTo,
		$find,
		$index = 0,
		$value = null,
		$parentName = null,
		$blockIndex = 0
	)
	{
		$this->metaField = $metaField;
		$this->belongsTo = $belongsTo;
		$this->find = $find;
		$this->value = $value;
		$this->parentName = $parentName;
		$this->index = $index;
		$this->blockIndex = $blockIndex;

		if($metaField->hasParent()){
			$parentMetaField = MetaRepository::getMetaFieldById($metaField->getParentId());
			$this->parentMetaField = $parentMetaField;
		}

		if($metaField->hasParentBlock()){
			$parentBlock = MetaRepository::getMetaBlockById($metaField->getBlockId());
			$this->parentBlock = $parentBlock;
		}
	}

	/**
	 * @return mixed
	 */
	abstract public function render();

	/**
	 * @return MetaFieldModel
	 */
	public function getMetaField(): MetaFieldModel
	{
		return $this->metaField;
	}

	/**
	 * @return string
	 */
	public function getBelongsTo(): string
	{
		return $this->belongsTo;
	}

	/**
	 * @return string
	 */
	public function getFind(): string
	{
		return $this->find;
	}

	/**
	 * @return mixed
	 */
	public function getIndex()
	{
		return $this->index;
	}

	/**
	 * @return MetaFieldBlockModel
	 */
	public function getParentBlock(): MetaFieldBlockModel
	{
		return $this->parentBlock;
	}

	/**
	 * @return int
	 */
	public function getBlockIndex(): int
	{
		return $this->blockIndex;
	}

	/**
	 * @return mixed
	 */
	public function getValue()
	{
		return $this->value;
	}

	/**
	 * @return bool
	 */
	protected function isChild()
	{
		return $this->metaField->hasParent();
	}

	/**
	 * @return bool
	 */
	protected function hasChildren()
	{
		return $this->metaField->hasChildren();
	}

	/**
	 * @return bool
	 */
	protected function isNestedInABlock()
	{
		return $this->metaField->hasParentBlock();
	}

	/**
	 * @param MetaFieldOptionModel[] $options
	 * @param bool $isMulti
	 *
	 * @return array
	 */
	protected function selectedOptions(array $options, bool $isMulti = false)
	{
		$value = $this->getDefaultValue();

		if(!$isMulti){
			if(!empty($value)){
				return [$value];
			}

			$default = [];
			foreach ($options as $option){
				if($option->isDefault()){
					$default[] = $option->getValue();
				}
			}

			if(empty($default)){
				return [];
			}

			return [
				$default[0]
			];
		}

		if(!empty($value) and is_array($value)){
			return $value;
		}

		$default = [];
		foreach ($options as $option){
			if($option->isDefault()){
				$default[] = $option->getValue();
			}
		}

		return $default;
	}

	/**
	 * @return string
	 */
	protected function getIdName()
	{
		$idName = '';

		// add prefix for OP fields
		if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
			$idName .= Strings::toDBFormat($this->find)."_";
		}

		if($this->isNestedInABlock()){
			$idName .= $this->parentName . '[blocks]['.$this->blockIndex.']['.$this->parentBlock->getNormalizedName().']['.$this->metaField->getNormalizedName().']['.$this->index.']';

			// remove double prefix
			if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
				$idName = str_replace(Strings::toDBFormat($this->find)."_".Strings::toDBFormat($this->find)."_", Strings::toDBFormat($this->find)."_", $idName);
			}

			return esc_html($idName);
		}

		if($this->isChild()){
			$idName .= $this->parentName.'['.$this->metaField->getNormalizedName().']['.$this->index.']';

			// remove double prefix
			if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
				$idName = str_replace(Strings::toDBFormat($this->find)."_".Strings::toDBFormat($this->find)."_", Strings::toDBFormat($this->find)."_", $idName);
			}

			return esc_html($idName);
		}

		$idName .= Strings::toDBFormat($this->metaField->getBox()->getName()) . '_' . Strings::toDBFormat($this->metaField->getName());

		return esc_html($idName);
	}

	/**
	 * @param $key
	 *
	 * @return mixed|null
	 */
	protected function getData($key)
	{
		return Meta::fetch($this->find, $this->belongsTo, $key);
	}

	/**
	 * @return mixed
	 */
	protected function getParentData()
	{
		if($this->parentMetaField === null){
			return null;
		}

		return $this->getData($this->parentMetaField->getDbName());
	}

	/**
	 * @return string
	 */
	protected function generateRandomId()
	{
		return 'id_'.rand(999999,111111);
	}

	/**
	 * @return mixed|null
	 */
	protected function getDefaultValue()
	{
		if($this->isNestedInABlock()){

			if($this->value){
				return $this->value;
			}

			if(!isset($this->parentBlock->getFields()[$this->blockIndex])){
				return null;
			}

			$nestedField = $this->parentBlock->getFields()[$this->blockIndex];

			return ($nestedField) ? $nestedField->getDefaultValue() : null;
		}

		if($this->isChild()){
			return ($this->value) ? $this->value : $this->metaField->getDefaultValue();
		}

		$value = $this->getData($this->getIdName());

		if($value !== null and $value !== ''){
			return $value;
		}

		return $this->metaField->getDefaultValue();
	}

	/**
	 * @return WPAttachment[]
	 */
	protected function getAttachments()
	{
		$attachments = [];
		$id = $this->getData($this->getIdName().'_id');
		$url = $this->getData($this->getIdName());

		if($id === null and $url === null){
			return $attachments;
		}

		// from id
		if(!empty($id)){
			$ids =  explode(',', $id);

			foreach ($ids as $_id){
				$attachments[] = WPAttachment::fromId($_id);
			}

			return $attachments;
		}

		// from url
		if(!empty($url)){
			if(is_array($url)){
				foreach ($url as $_url){
					$attachments[] = WPAttachment::fromUrl($_url);
				}

				return $attachments;
			}

			$attachments[] = WPAttachment::fromUrl($url);
		}

		return $attachments;
	}

	/**
	 * @param $key
	 *
	 * @return mixed|null
	 */
	protected function getAdvancedOption($key)
	{
		foreach ($this->metaField->getAdvancedOptions() as $advancedOption){
			if ($advancedOption->getKey() === $key and $advancedOption->getValue() !== '') {
				return $advancedOption->getUnserializedValue();
			}
		}

		return null;
	}

	/**
	 * @return string
	 */
	protected function displayLabel()
	{
		$label = ($this->metaField->getLabel()) ? $this->metaField->getLabel() : $this->metaField->getName();
		$label = esc_html($label);
		$label = '<span>'.$this->addAsteriskToLabel($label).'</span>';

		if($this->metaField->getType() === MetaFieldModel::REPEATER_TYPE){
			$label .= '<span class="acpt-badge">REPEATER</span>';
		}

		if($this->metaField->getType() === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){
			$label .= '<span class="acpt-badge acpt-badge-success">FLEXIBLE</span>';
		}

		return $label;
	}

	/**
	 * @param $label
	 *
	 * @return mixed
	 */
	private function addAsteriskToLabel($label)
	{
		if($this->metaField->isRequired()){
			return $label . '<span class="required">*</span>';
		}

		return $label;
	}

	/**
	 * @return string
	 */
	protected function getGridCssClass()
	{
		foreach ($this->metaField->getAdvancedOptions() as $advancedOption){
			if ($advancedOption->getKey() === 'columns' and $advancedOption->getValue() !== '') {
				return "grid-".$advancedOption->getValue();
			}
		}

		return '';
	}

	/**
	 * @param string $relation
	 *
	 * @return string
	 */
	private function displayRelation($relation)
	{
		switch ($relation){
			case Relationships::ONE_TO_ONE_UNI:
				return '<span class="relation-label">1</span><span class="relation-sign">⟶</span><span class="relation-label">1</span></span>';

			case Relationships::ONE_TO_ONE_BI:
				return '<span class="relation-label">1</span><span class="relation-sign">⟷</span><span class="relation-label">1</span></span>';

			case Relationships::ONE_TO_MANY_UNI:
				return '<span class="relation-label">1</span><span class="relation-sign">⟶</span><span class="relation-label">M</span></span>';

			case Relationships::ONE_TO_MANY_BI:
				return '<span class="relation-label">1</span><span class="relation-sign">⟷</span><span class="relation-label">M</span></span>';

			case Relationships::MANY_TO_ONE_UNI:
				return '<span class="relation-label">M</span><span class="relation-sign">⟶</span><span class="relation-label">1</span></span>';

			case Relationships::MANY_TO_ONE_BI:
				return '<span class="relation-label">M</span><span class="relation-sign">⟷</span><span class="relation-label">1</span></span>';

			case Relationships::MANY_TO_MANY_UNI:
				return '<span class="relation-label">M</span><span class="relation-sign">⟶</span><span class="relation-label">M</span></span>';

			case Relationships::MANY_TO_MANY_BI:
				return '<span class="relation-label">M</span><span class="relation-sign">⟷</span><span class="relation-label">M</span></span>';
		}


		return $relation;
	}

	/**
	 * @return string
	 */
	protected function required()
	{
		return ($this->metaField->isRequired()) ? 'required="required" aria-required="true"' : '';
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	protected function renderField($field)
	{
		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';
		$widthStyle = $width.'%';

		$return = '<div class="acpt-admin-meta-wrapper acpt-w-'.$width.' '.$css.'" data-id="'.$this->metaField->getId().'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.';">';
		$return .= '<div class="acpt-admin-meta sort-'.esc_attr($this->getMetaField()->getSort()).'">';

		$return .= $this->renderFieldWrapper($field, $headlineAlignment);
		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 * @param string $alignment
	 *
	 * @return string
	 */
	private function renderFieldWrapper($field, $alignment = 'top')
	{
		$return = '<div class="acpt-admin-meta-field-wrapper '.$alignment.'">';

		if($alignment === 'top' or $alignment === 'left'){
			$return .= $this->renderFieldLabel() . $this->renderFieldValue($field);
		} elseif($alignment === 'right'){
			$return .= $this->renderFieldValue($field) . $this->renderFieldLabel();
		} elseif($alignment === 'none'){
			$return .= $this->renderFieldValue($field);
		}

		$return .= '</div>';

		return $return;
	}

	/**
	 * @return string
	 */
	private function renderFieldLabel()
	{
		$return = '<div class="acpt-admin-meta-label">';
		$return .= '<label for="'.esc_attr($this->getIdName()).'">';
		$return .= $this->displayLabel();

		// Firefox message
		if(!Browser::isBrowser('Chrome') and $this->metaField->getType() === MetaFieldModel::EDITOR_TYPE){

			add_thickbox();

			$modalId = 'modal_window_id_'.esc_attr($this->getIdName());
			$return .= '<a href="#TB_inline?&inlineId='.$modalId.'" title="Don\'t see the content?"  class="thickbox">Don\'t see the content?</a>';
			$return .= '<div id="'.$modalId.'" style="display:none;">
							<div class="notice notice-warning update-nag inline">If you use FireFox or other browsers, you may not see the content in the editor.</div>
							<p>This is due to a <strong>well-known TinyMCE bug</strong>.</p>
							<h3>Walk-around</h3>
							<p>To solve this issue please do the following:</p>
							<ul style="list-style: disc; padding-left: 20px;">
								<li>Open the dev console (on FireFix press F12 on keyboard)</li>
								<li>Refresh the page (F5) <strong>keeping the console open</strong></li>
								<li>Now the editor should work fine</li>
							</ul>
						</div>';
		}

		$return .= '</label>';

		if($this->metaField->getDescription()){
			$return .= '<span class="description">';
			$return .= $this->metaField->getDescription();
			$return .= '</span>';
		}

		if(!empty($this->metaField->getRelations())){
			$relationModel = $this->metaField->getRelations()[0];
			$return .= '<div class="relation">';
			$return .= $this->displayRelation($relationModel->getRelationship());
			$return .= '</div>';

			if($relationModel->getInversedBy() !== null){
				$return .= '<div class="inversed-by">'.$relationModel->getInversedBy()->getUiName().'</div>';
			}
		}

		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderFieldValue($field)
	{
		$return = '<div class="acpt-admin-meta-field">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_type">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_id">';
		$return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_id" value="'. esc_html($this->metaField->getId()) .'">';
		$return .= '<input type="hidden" name="'.esc_attr($this->getIdName()).'_required" value="'.esc_attr($this->metaField->isRequired()) . '">';
		$return .= Sanitizer::escapeField($field);
		$return .= $this->renderErrors();
		$return .= '</div>';

		return $return;
	}

	/**
	 * @return bool
	 */
	protected function hasErrors()
	{
		if(Session::has(self::ERRORS_SESSION_KEY)){
			foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errors){
				if($id === $this->metaField->getId()){
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * @return string|null
	 */
	public function renderErrors()
	{
		$id = 'acpt-error-list-'.$this->getIdName();

		if($this->isChild() or $this->isNestedInABlock()){
			$id .= '[value]';
		}

		$errorsList = '<ul class="acpt-error-list" id="'.$id.'">';

		if(Session::has(self::ERRORS_SESSION_KEY)){
			foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errors){
				foreach ($errors as $error){
					if($id === $this->metaField->getId()){
						$errorsList .= '<li>'.$error.'</li>';
					}
				}
			}

			Session::flush(self::ERRORS_SESSION_KEY);
		}

		$errorsList .= '</ul>';

		return $errorsList;
	}

	/**
	 * @return string
	 */
	protected function appendDataValidateAndLogicAttributes()
	{
		$attr = ' data-conditional-rules-id="'.$this->metaField->getId().'"';

		if($this->metaField->hasParent()){
			$attr .= ' data-conditional-rules-field-index="'.$this->getIndex().'"';
		}

		if($this->metaField->canFieldHaveValidationAndLogicRules()){
			$attr .= DataValidateAttributes::generate(
				$this->metaField->getValidationRules(),
				$this->metaField->isTextual(),
				$this->metaField->isRequired()
			);
		}

		return $attr;
	}

	/**
	 * @return bool
	 */
	protected function isLeadingField()
	{
		if($this->isChild()){
			$parentField = $this->parentMetaField;

			if($parentField === null){
				return false;
			}

			$leadingFieldId = $parentField->getAdvancedOption('leading_field');

			if($leadingFieldId !== null){
				return $leadingFieldId === $this->metaField->getId();
			}
		}

		if($this->isNestedInABlock()){
			$parentField = $this->parentBlock->getMetaField();

			if($parentField === null){
				return false;
			}

			$leadingFieldId = $parentField->getAdvancedOption('leading_field');

			if($leadingFieldId !== null){
				return $leadingFieldId === $this->metaField->getId();
			}
		}
	}
}