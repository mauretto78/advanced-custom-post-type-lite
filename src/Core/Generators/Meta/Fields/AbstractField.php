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
use ACPT_Lite\Utils\Data\Sanitizer;
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
	 * @return MetaFieldModel
	 */
	public function getParentMetaField(): MetaFieldModel
	{
		return $this->parentMetaField;
	}

	/**
	 * @return MetaFieldBlockModel
	 */
	public function getParentBlock(): MetaFieldBlockModel
	{
		return $this->parentBlock;
	}

	/**
	 * @return null
	 */
	public function getParentName()
	{
		return $this->parentName;
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
	 * @return bool
	 */
	protected function hasBlocks()
	{
		return $this->metaField->hasBlocks();
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
		if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
			$idName .= Strings::toDBFormat($this->find)."_";
		}

		if($this->isNestedInABlock()){
			$idName .= $this->parentName . '[blocks]['.$this->blockIndex.']['.$this->parentBlock->getNormalizedName().']['.$this->metaField->getNormalizedName().']['.$this->index.']';

			return esc_html($idName);
		}

		if($this->isChild()){
			$idName .= $this->parentName.'['.$this->metaField->getNormalizedName().']['.$this->index.']';

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
		switch ($this->belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				return get_post_meta($this->find, $key, true);

			case MetaTypes::TAXONOMY:
				return get_term_meta($this->find, $key, true);

			case MetaTypes::OPTION_PAGE:
				return get_option($key);

			case MetaTypes::USER:
				return get_user_meta($this->find, $key, true);
		}

		return null;
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
			return ($this->value) ? $this->value : $this->parentMetaField->getDefaultValue();
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
		return ($this->metaField->isRequired()) ? 'required="required"' : '';
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	protected function renderField($field)
	{
		if($this->isChild()){
			return $this->renderRepeaterField($field);
		}

		switch ($this->belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				return $this->renderForCustomPostType($field);

			case MetaTypes::TAXONOMY:
				return $this->renderForTaxonomy($field);

			case MetaTypes::OPTION_PAGE:
				return $this->renderForOptionPage($field);

			case MetaTypes::USER:
				return $this->renderForUser($field);
		}

		return "";
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	protected function renderRepeaterField($field)
	{
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';

		$return = '<div class="field '.$headlineAlignment.'" data-index="'.$this->index.'" style="width: '.$width.'%;">';
		$return .= '<div class="field-inner">';

		if ( $headlineAlignment === 'top' or $headlineAlignment === 'left' ) {
			$return .= $this->renderRepeaterFieldLabel() . $this->renderRepeaterFieldValue($field);
		} elseif ( $headlineAlignment === 'right' ) {
			$return .= $this->renderRepeaterFieldValue( $field ) . $this->renderRepeaterFieldLabel();
		} elseif ( $headlineAlignment === 'none' ) {
			$return .= $this->renderRepeaterFieldValue( $field );
		}

		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @return string
	 */
	private function renderRepeaterFieldLabel()
	{
		$return = '<div class="acpt-admin-meta-label">';
		$return .= '<label for="'.$this->getIdName().'">';
		$return .= $this->displayLabel();
		$return .= '</label>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return mixed|string
	 */
	private function renderRepeaterFieldValue($field)
	{
		$return = ($this->metaField->getType() !== MetaFieldModel::EDITOR_TYPE) ? Sanitizer::escapeField($field) : $field;

		if($this->hasChildren()){
			$idName = Strings::toDBFormat($this->metaField->getBox()->getName()) . '_' . Strings::toDBFormat($this->metaField->getName());
			$return .= '<input type="hidden" name="meta_fields[]" value="'. $idName .'">';
			$return .= '<input type="hidden" name="meta_fields[]" value="'. $idName .'_type">';
			$return .= '<input type="hidden" name="meta_fields[]" value="'. $idName .'_id">';
			$return .= '<input type="hidden" name="'.$idName.'_id" value="'. esc_html($this->metaField->getId()) .'">';
			$return .= '<input type="hidden" name="'.$idName.'_required" value="'.esc_attr($this->metaField->isRequired()) . '">';
		}

		if($this->metaField->getDescription() !== null and $this->metaField->getDescription() !== ''){
			$return .= '<span class="description">'.$this->metaField->getDescription().'</span>';
		}

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderForCustomPostType($field)
	{
		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';
		$widthStyle = $width.'%';

		$return = '<div class="acpt-admin-meta-wrapper '.$css.'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.';">';
		$return .= '<div class="acpt-admin-meta sort-'.esc_attr($this->getMetaField()->getSort()).'">';

		$return .= $this->renderPostTypeFieldWrapper($field, $headlineAlignment);
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
	private function renderPostTypeFieldWrapper($field, $alignment = 'top')
	{
		$return = '<div class="acpt-admin-meta-field-wrapper '.$alignment.'">';

		if($alignment === 'top' or $alignment === 'left'){
			$return .= $this->renderPostTypeFieldLabel() . $this->renderPostTypeFieldValue($field);
		} elseif($alignment === 'right'){
			$return .= $this->renderPostTypeFieldValue($field) . $this->renderPostTypeFieldLabel();
		} elseif($alignment === 'none'){
			$return .= $this->renderPostTypeFieldValue($field);
		}

		$return .= $this->renderErrors();
		$return .= '</div>';

		return $return;
	}

	/**
	 * @return string
	 */
	private function renderPostTypeFieldLabel()
	{
		$return = '<div class="acpt-admin-meta-label">';
		$return .= '<label for="'.esc_attr($this->getIdName()).'">';
		$return .= $this->displayLabel();
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
	private function renderPostTypeFieldValue($field)
	{
		$return = '<div class="acpt-admin-meta-field">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_type">';
		$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_id">';
		$return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_id" value="'. esc_html($this->metaField->getId()) .'">';
		$return .= '<input type="hidden" name="'.esc_attr($this->getIdName()).'_required" value="'.esc_attr($this->metaField->isRequired()) . '">';
		$return .= Sanitizer::escapeField($field);
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderForTaxonomy($field)
	{
		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';
		$widthStyle = $width.'%';

		$return = '<div class="taxonomy-meta-field-wrapper '.$css.'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.'">';
		$return .= '<div class="taxonomy-meta-field">';

		$return .= '<div style="width: 100%">';
		$return .= $this->renderTaxonomyFieldWrapper($field, $headlineAlignment);
		$return .= $this->renderErrors();
		$return .= '</div>';

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
	private function renderTaxonomyFieldWrapper($field, $alignment = 'top')
	{
		$return = '<div class="form-field '.$alignment.'">';

		if($alignment === 'top' or $alignment === 'left'){
			$return .= $this->renderTaxonomyFieldLabel().$this->renderTaxonomyFieldValue($field);
		} elseif($alignment === 'right'){
			$return .= $this->renderTaxonomyFieldValue($field).$this->renderTaxonomyFieldLabel();
		} elseif($alignment === 'none'){
			$return .= $this->renderTaxonomyFieldValue($field);
		}

		$return .= '</div>';

		return $return;
	}

	/**
	 * @return string
	 */
	private function renderTaxonomyFieldLabel()
	{
		$return = '<div>';
		$return .= '<label for="'.esc_attr($this->getIdName()).'">';
		$return .= $this->displayLabel();
		$return .= '</label>';

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
	 * @return mixed|string
	 */
	private function renderTaxonomyFieldValue($field)
	{
		$return = Sanitizer::escapeField($field);

		if($this->metaField->getDescription()){
			$return .= '<p class="description">';
			$return .= esc_html($this->metaField->getDescription());
			$return .= '</p>';
		}

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderForOptionPage($field)
	{
		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';
		$widthStyle = $width.'%';

		$return = '<div class="option-page-meta-field-wrapper '.$css.'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.'">';
		$return .= '<div class="option-page-meta">';
		$return .= '<div class="option-page-meta-field '.$headlineAlignment.'">';

		$return .= '<div>';

		if($headlineAlignment !== 'none'){
			$return .= '<div class="acpt-admin-meta-label">';
			$return .= '<label for="'.$this->getIdName().'">'.$this->displayLabel().'</label>';
			$return .= '</div>';
		}

		if($this->metaField->getDescription() !== null and $this->metaField->getDescription() !== ''){
			$return .= '<span class="description">'.$this->metaField->getDescription().'</span>';
		}

		$return .= '</div>';
		$return .= $field;

		$return .= $this->renderErrors();
		$return .= '</div>';
		$return .= '</div>';
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderForUser($field)
	{
		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';

		$return = '<tr class="'.$css.'">';

		switch ($headlineAlignment){
			case "top":
				$return .= '<td colspan="2">';
				$return .= $this->renderUserLabel();
				$return .= $this->renderUserField($field);
				$return .= '</td>';
				break;

			case "left":
				$return .= '<th>';
				$return .= $this->renderUserLabel();
				$return .= '</th>';
				$return .= '<td>';
				$return .= $this->renderUserField($field);
				$return .= '</td>';

				break;

			case "right":
				$return .= '<td>';
				$return .= $this->renderUserField($field);
				$return .= '</td>';
				$return .= '<th>';
				$return .= $this->renderUserLabel();
				$return .= '</th>';

				break;

			case "none":
				$return .= '<td colspan="2">';
				$return .= $this->renderUserField($field);
				$return .= '</td>';
				break;
		}

		$return .= '</tr>';

		return $return;
	}

	/**
	 * @return string
	 */
	private function renderUserLabel()
	{
		$return = '<div class="acpt-admin-meta-label-wrapper" id="'.$this->metaField->getId().'">';

		$return .= '<div>';
		$return .= '<label for="'. $this->getIdName() .'">';
		$return .= $this->displayLabel();
		$return .= '</label>';

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
		$return .= '</div>';

		return $return;
	}

	/**
	 * @param $field
	 *
	 * @return string
	 */
	private function renderUserField($field)
	{
		$return = Sanitizer::escapeField($field);
		$return .= $this->renderErrors();

		if($this->metaField->getDescription() !== null and $this->metaField->getDescription() !== ''){
			$return .= '<span class="description">';
			$return .= $this->metaField->getDescription();
			$return .= '</span>';
		}

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
	private function renderErrors()
	{
		if(Session::has(self::ERRORS_SESSION_KEY)){
			$errorsList = '<ul class="acpt-error-list">';

			foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errors){
				foreach ($errors as $error){
					if($id === $this->metaField->getId()){
						$errorsList .= '<li>'.$error.'</li>';
					}
				}
			}

			Session::flush(self::ERRORS_SESSION_KEY);
			$errorsList .= '</ul>';

			return $errorsList;
		}

		return null;
	}

	/**
	 * @return string
	 */
	protected function appendDataValidateAndLogicAttributes()
	{
		$attr = '';

		if($this->metaField->canFieldHaveValidationAndLogicRules()){
			$attr .= ' data-conditional-rules-id="'.$this->metaField->getId().'"';
			$attr .= DataValidateAttributes::generate($this->metaField->getValidationRules(), $this->metaField->isTextual(), $this->metaField->isRequired());

		}

		return $attr;
	}
}