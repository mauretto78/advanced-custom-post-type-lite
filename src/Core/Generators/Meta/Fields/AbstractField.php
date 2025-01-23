<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\Permissions;
use ACPT_Lite\Constants\Relationships;
use ACPT_Lite\Constants\Visibility;
use ACPT_Lite\Core\Generators\Validation\DataValidateAttributes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Checker\FieldVisibilityChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Maps;
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
	 * @var array|null
	 */
	protected $externalPermissions;

	/**
	 * @var string
	 */
	protected $permissions;

    /**
     * @var null
     */
    protected $cloneFieldId;

    /**
     * @var null
     */
    protected $WooCommerceLoopIndex;

    /**
     * AbstractField constructor.
     * @param MetaFieldModel $metaField
     * @param $belongsTo
     * @param $find
     * @param int $index
     * @param null $value
     * @param null $parentName
     * @param int $blockIndex
     * @param null $cloneFieldId
     * @throws \Exception
     */
	public function __construct(
		MetaFieldModel $metaField,
		$belongsTo,
		$find,
		$index = 0,
		$value = null,
		$parentName = null,
		$blockIndex = 0,
        $cloneFieldId = null
	)
	{
		$this->metaField = $metaField;
		$this->belongsTo = $belongsTo;
		$this->find = $find;
		$this->value = $value;
		$this->parentName = $parentName;
		$this->index = $index;
		$this->blockIndex = $blockIndex;
		$this->cloneFieldId = $cloneFieldId;

		if($metaField->hasParent()){
			$parentMetaField = MetaRepository::getMetaFieldById($metaField->getParentId());
			$this->parentMetaField = $parentMetaField;
		}

		if($metaField->hasParentBlock()){
			$parentBlock = MetaRepository::getMetaBlockById($metaField->getBlockId());
			$this->parentBlock = $parentBlock;
		}

		$this->setPermissions();
	}

    /**
     * @param mixed $value
     */
    public function setValue($value): void
    {
        $this->value = $value;
    }

    /**
     * @param null $WooCommerceLoopIndex
     */
    public function setWooCommerceLoopIndex($WooCommerceLoopIndex): void
    {
        $this->WooCommerceLoopIndex = $WooCommerceLoopIndex;
    }

	/**
	 * External permissions can be injected from outside,
	 * for example from Option page permissions
	 *
	 * @param array $externalPermissions
	 */
	public function setExternalPermissions(array $externalPermissions): void
	{
		$this->externalPermissions = $externalPermissions;
		$this->setPermissions();
	}

	/**
	 * @return string
	 */
	protected function setPermissions()
	{
		// First, check if externalPermissions are set
		if(is_array($this->externalPermissions)){
			if(in_array("edit", $this->externalPermissions) and $this->externalPermissions['edit'] == true){
				$externalPermissions = Permissions::EDIT;
			} elseif(in_array("read", $this->externalPermissions) and $this->externalPermissions['read'] == true){
				$externalPermissions = Permissions::READ_ONLY;
			} else {
				$externalPermissions = Permissions::NO_SHOW;
			}
		} else {
			$externalPermissions = Permissions::EDIT;
		}

		// Then, check the specific meta fields permissions
		$fieldUserPermissions = $this->metaField->userPermissions();
		if(in_array("edit", $fieldUserPermissions) and $fieldUserPermissions['edit'] == true){
			$fieldPermissions = Permissions::EDIT;
		} elseif(in_array("read", $fieldUserPermissions) and $fieldUserPermissions['read'] == true){
			$fieldPermissions = Permissions::READ_ONLY;
		} else {
			$fieldPermissions = Permissions::NO_SHOW;
		}

		$this->permissions = min([$externalPermissions, $fieldPermissions]);
	}

	/**
	 * @return mixed
	 */
	abstract public function render();

	/**
	 * @return bool
	 */
	protected function isForEdit()
	{
		return $this->permissions === Permissions::EDIT;
	}

	/**
	 * @return bool
	 */
	protected function isNoShow()
	{
		return $this->permissions === Permissions::NO_SHOW;
	}

	/**
	 * @return bool
	 */
	protected function isReadOnly()
	{
		return $this->permissions === Permissions::READ_ONLY;
	}

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
	protected function isCloned()
    {
        return $this->metaField->getForgedBy() !== null;
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
			$idName .= $this->parentName;

            if($this->WooCommerceLoopIndex !== null){
                $idName .= "_".$this->WooCommerceLoopIndex;
            }

			$idName .= '[blocks]['.$this->blockIndex.']['.$this->parentBlock->getNormalizedName().']['.$this->metaField->getNormalizedName().']['.$this->index.']';

			// remove double prefix
			if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
				$idName = str_replace(Strings::toDBFormat($this->find)."_".Strings::toDBFormat($this->find)."_", Strings::toDBFormat($this->find)."_", $idName);
			}

			return esc_html($idName);
		}

		if($this->isChild()){
			$idName .= $this->parentName;

            if($this->WooCommerceLoopIndex !== null){
                $idName .= "_".$this->WooCommerceLoopIndex;
            }

			$idName .= '['.$this->metaField->getNormalizedName().']['.$this->index.']';

			// remove double prefix
			if($this->belongsTo === MetaTypes::OPTION_PAGE and $this->find !== null){
				$idName = str_replace(Strings::toDBFormat($this->find)."_".Strings::toDBFormat($this->find)."_", Strings::toDBFormat($this->find)."_", $idName);
			}

			return esc_html($idName);
		}

		$idName .= Strings::toDBFormat($this->metaField->getBox()->getName()) . '_' . $this->metaField->getNormalizedName();

		if($this->WooCommerceLoopIndex !== null){
            $idName .= "_".$this->WooCommerceLoopIndex;
        }

		return esc_html($idName);
	}

	/**
	 * @return bool
	 */
	public function isVisible()
	{
		return FieldVisibilityChecker::check(
			Visibility::IS_BACKEND,
			$this->find,
			$this->belongsTo,
			$this->metaField,
			[],
			$this->index ?? null,
			$this->parentBlock ? $this->parentBlock->getName() : null,
			$this->blockIndex ?? null
		);
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
		// field nested in a block
		if($this->parentBlock !== null){
			$key = '';

			if($this->belongsTo === MetaTypes::OPTION_PAGE){
				$key .= $this->find.'_';
			}

			if($this->parentBlock->getMetaField()->hasParent()){
				$key .= $this->parentBlock->getMetaField()->getParentField()->getDbName();
			} elseif($this->parentBlock->getMetaField()->hasParentBlock()){
				$key .= $this->parentBlock->getMetaField()->getParentBlock()->getMetaField()->getDbName();
			}  else {
				$key .= $this->parentBlock->getMetaField()->getDbName();
			}

			return $this->getData($key);
		}

		// field nested in a repeater
		if($this->parentMetaField !== null){
			$key = '';

			if($this->belongsTo === MetaTypes::OPTION_PAGE){
				$key .= $this->find.'_';
			}

			if($this->parentMetaField->hasParent()){
				$key .= $this->parentMetaField->getParentField()->getDbName();
			} elseif($this->parentMetaField->hasParentBlock()){
				$key .= $this->parentMetaField->getParentBlock()->getMetaField()->getDbName();
			}  else {
				$key .= $this->parentMetaField->getDbName();
			}

			return $this->getData($key);
		}

		return null;
	}

	/**
	 * @return mixed|null
	 */
	protected function getDefaultValue()
	{
        if($this->value){
            return $this->value;
        }

		if($this->isNestedInABlock()){

			if(!isset($this->parentBlock->getFields()[$this->blockIndex])){
				return null;
			}

			$nestedField = $this->parentBlock->getFields()[$this->blockIndex];

			return ($nestedField) ? $this->formatDefaultValue($nestedField->getDefaultValue()) : null;
		}

		if($this->isChild()){
			return $this->formatDefaultValue($this->metaField->getDefaultValue());
		}

		$value = $this->getData($this->getIdName());

		if($value !== null and $value !== ''){
			return $value;
		}

		return $this->formatDefaultValue($this->metaField->getDefaultValue());
	}

	/**
	 * @param $string
	 *
	 * @return mixed
	 */
	private function formatDefaultValue($string)
	{
		if(Strings::isJson($string)){
			return json_decode($string, true);
		}

		return $string;
	}

	/**
	 * @return WPAttachment[]
	 */
	protected function getAttachments()
	{
		$attachments = [];
		$id = $this->getAttachmentId();
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
	 * @return string|null
	 */
	private function getAttachmentId()
	{
		// legacy format
		if(!empty($this->getData('_id')) and is_numeric($this->getData('_id'))){
			return $this->getData('_id');
		}

		// current format
		return $this->getData('_attachment_id') ?? null;
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

        if($this->metaField->getForgedBy() !== null){
            $label .= '<span class="acpt-badge acpt-badge-info">CLONED</span>';
        }

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
	    // cloned fields
        if($this->isCloned() and $this->cloneFieldId !== $this->metaField->getForgedBy()->getId()){
            return null;
        }

		// no show
		if($this->isNoShow()){
			return null;
		}

		$css = $this->getAdvancedOption('css') ? $this->getAdvancedOption('css') : '';
		$headlineAlignment = $this->getAdvancedOption('headline') ? $this->getAdvancedOption('headline') : 'top';
		$verticalAlignment = $this->getAdvancedOption('vertical_alignment') ? $this->getAdvancedOption('vertical_alignment') : 'center';
		$width = $this->getAdvancedOption('width') ? $this->getAdvancedOption('width') : '100';
		$widthStyle = $width.'%';
		$isHidden = ($this->isVisible() === false) ? 'hidden' : '';

		$return = '<div class="acpt-admin-meta-wrapper '.$isHidden.' acpt-w-'.$width.' '.$css.'" data-id="'.$this->metaField->getId().'" id="'.$this->metaField->getId().'" style="width: '.$widthStyle.';">';
		$return .= '<div class="acpt-admin-meta sort-'.esc_attr($this->getMetaField()->getSort()).'" style="align-items: '.$verticalAlignment.';">';

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
	 * @return string|null
	 */
	private function renderFieldLabel()
	{
	    if($this->metaField->getType() === MetaFieldModel::CLONE_TYPE){
	        return null;
        }

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
			$return .= '<div>';
			$return .= $this->displayRelation($relationModel->getRelationship());
			$return .= '</div>';

			if($relationModel->getInversedBy() !== null){
				$return .= '<div class="inversed-by">'.$relationModel->getInversedBy()->getUiName().'</div>';
			}

			$return .= '</div>';
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

		// readonly
		if($this->isReadOnly()){
			switch ($this->belongsTo){
				default;
				case MetaTypes::CUSTOM_POST_TYPE:
					$tag = 'acpt pid';
					break;

				case MetaTypes::TAXONOMY:
					$tag = 'acpt_tax tid';
					break;

				case MetaTypes::OPTION_PAGE:
					$tag = 'acpt_option page';
					break;

				case MetaTypes::USER:
					$tag = 'acpt_user uid';
					break;
			}

			$return .= do_shortcode('['.$tag.'="'.$this->find.'" box="'.esc_attr($this->metaField->getBox()->getName()).'" field="'.esc_attr($this->metaField->getName()).'" preview="true"]');
			$return .= '</div>';

			return $return;
		}

		// edit
		if($this->isForEdit()){
			$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'">';
			$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_type">';
			$return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_id">';

			if($this->metaField->getForgedBy() !== null){
                $return .= '<input type="hidden" name="meta_fields[]" value="'. esc_html($this->getIdName()) .'_forged_by">';
                $return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_forged_by" value="'. esc_html($this->metaField->getForgedBy()->getId()) .'">';
            }

			$return .= '<input type="hidden" name="'.esc_html($this->getIdName()).'_id" value="'. esc_html($this->metaField->getId()) .'">';
			$return .= '<input type="hidden" name="'.esc_attr($this->getIdName()).'_required" value="'.esc_attr($this->metaField->isRequired()) . '">';
			$return .= Sanitizer::escapeField($field);
			$return .= $this->renderErrors();
			$return .= '</div>';

			return $return;
		}

		return null;
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

        if($this->metaField->getForgedBy() !== null){
            $attr .= ' data-conditional-rules-field-forged-by="'.$this->metaField->getForgedBy()->getId().'"';
        }

		if($this->metaField->hasParent()){
			$attr .= ' data-conditional-rules-field-index="'.$this->getIndex().'"';
		}

		if($this->metaField->hasParentBlock() and $this->getParentBlock() !== null){
			$attr .= ' data-conditional-rules-field-index="'.$this->getIndex().'"';
			$attr .= ' data-conditional-rules-block-index="'.$this->getBlockIndex().'"';
			$attr .= ' data-conditional-rules-block-name="'.$this->getParentBlock()->getName().'"';
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

	/**
	 * Enqueue the nested fields assets
	 * (used only by Repeater and Flexible fields)
	 *
	 * @param array $checks
	 */
	protected function enqueueNestedFieldsAssets($checks = [])
	{
		wp_enqueue_script( 'html5sortable', plugins_url( 'advanced-custom-post-type/assets/vendor/html5sortable/dist/html5sortable.min.js'), [], '2.2.0', true);

		// ADDRESS_TYPE
		if(isset($checks[ MetaFieldModel::ADDRESS_TYPE])){
			if(!empty(Maps::googleMapsKey())){

				// use Google Maps
				wp_register_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key='.Maps::googleMapsKey().'&libraries=places&callback=initAutocomplete', false, '3', true);
				wp_enqueue_script('google-maps');

				wp_register_script('admin_google_maps_js',  plugins_url( 'advanced-custom-post-type/assets/static/js/google-maps.js'), ['jquery'], ACPT_PLUGIN_VERSION );
				wp_enqueue_script('admin_google_maps_js');
			} else {
				// use Leaflet
				wp_enqueue_script( 'leaflet-js', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/leaflet.min.js'), [], '1.9.4', true);
				wp_enqueue_script( 'leaflet-geosearch-js', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/geosearch.bundle.min.js'), [], '4.0.0', true);
				wp_enqueue_style( 'leaflet-css', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/leaflet.min.css'), [], '1.9.4', 'all');
				wp_enqueue_style( 'leaflet-geosearch-css', plugins_url( 'advanced-custom-post-type/assets/vendor/leaflet/geosearch.min.css'), [], '1.9.4', 'all');
				wp_enqueue_script( 'custom-leaflet-js', plugins_url( 'advanced-custom-post-type/assets/static/js/leaflet.js'), [], '1.0.0', true);
			}
		}

		// COUNTRY_TYPE
		if(isset($checks[ MetaFieldModel::COUNTRY_TYPE])){
			wp_enqueue_script( 'countrySelect-js', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/js/countrySelect.min.js'), [], '2.1.1', true);
			wp_enqueue_style( 'countrySelect-css', plugins_url( 'advanced-custom-post-type/assets/vendor/countrySelect/css/countrySelect.min.css'), [], '2.1.1', 'all');
		}

		// DATE_RANGE_TYPE
		if(isset($checks[ MetaFieldModel::DATE_RANGE_TYPE])){
			wp_enqueue_script( 'momentjs', plugins_url( 'advanced-custom-post-type/assets/vendor/moment/moment.min.js'), [], '2.18.1', true);
			wp_enqueue_script( 'daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/js/daterangepicker.min.js'), [], '3.1.0', true);
			wp_enqueue_style( 'daterangepicker-css', plugins_url( 'advanced-custom-post-type/assets/vendor/daterangepicker/css/daterangepicker.min.css'), [], '3.1.0', 'all');
			wp_enqueue_script( 'custom-daterangepicker-js', plugins_url( 'advanced-custom-post-type/assets/static/js/daterangepicker.js'), [], '1.0.0', true);
		}

		// EDITOR_TYPE
		if(isset($checks[ MetaFieldModel::EDITOR_TYPE])){
			global $tinymce_version;

			$js_src = includes_url('js/tinymce/') . 'tinymce.min.js';
			$css_src = includes_url('css/') . 'editor.css?v='.$tinymce_version;

			wp_enqueue_script( 'tinymce_js', $js_src, [], $tinymce_version, true);
			wp_register_style('tinymce_css', $css_src );
			wp_enqueue_style('tinymce_css');
		}

		// ICON_TYPE
		if(isset($checks[ MetaFieldModel::ICON_TYPE])){
			wp_enqueue_style( 'icon-picker-css', plugins_url( 'advanced-custom-post-type/assets/static/css/icon-picker.css'), [], ACPT_PLUGIN_VERSION, 'all');
		}

		// PHONE_TYPE
		if(isset($checks[ MetaFieldModel::PHONE_TYPE])){
			wp_enqueue_script( 'intlTelInput-js', plugins_url( 'advanced-custom-post-type/assets/vendor/intlTelInput/js/intlTelInput.min.js'), [], '1.10.60', true);
			wp_enqueue_style( 'intlTelInput-css', plugins_url( 'advanced-custom-post-type/assets/vendor/intlTelInput/css/intlTelInput.min.css'), [], '1.10.60', 'all');
		}

		// RATING_TYPE
		if(isset($checks[ MetaFieldModel::RATING_TYPE])){
			wp_enqueue_style( 'rating-css', plugins_url( 'advanced-custom-post-type/assets/static/css/rating.css'), [], ACPT_PLUGIN_VERSION, 'all');
		}

		// TABLE_TYPE
		if(isset($checks[ MetaFieldModel::TABLE_TYPE])){
			wp_enqueue_script( 'jquery.modal-js', plugins_url( 'advanced-custom-post-type/assets/vendor/jquery.modal/jquery.modal.min.js'), [], '3.1.0', true);
			wp_enqueue_style( 'jquery.modal-css', plugins_url( 'advanced-custom-post-type/assets/vendor/jquery.modal/jquery.modal.min.css'), [], '3.1.0', 'all');
			wp_enqueue_script( 'sortable-js', plugins_url( 'advanced-custom-post-type/assets/vendor/sortablejs/sortablejs.min.js'), [], '3.1.0', true);
			wp_enqueue_script( 'interact-js', plugins_url( 'advanced-custom-post-type/assets/vendor/interact/interact.min.js'), [], '3.1.0', true);
			wp_enqueue_script( 'acpt-tabulator-js', plugins_url( 'advanced-custom-post-type/assets/static/js/ACPTTabulator.js'), [], '1.0.0', true);
			wp_enqueue_script( 'custom-tabulator-js', plugins_url( 'advanced-custom-post-type/assets/static/js/tabulator.js'), [], '1.0.0', true);
		}
	}

	/**
	 * @param MetaFieldModel[] $fields
	 *
	 * @return array
	 */
	protected function nestedFieldsChecks($fields = []): array
	{
		if(empty($fields)){
			return [];
		}

		$return = [];

		foreach ($fields as $child){
			if($child->getType() === MetaFieldModel::DATE_RANGE_TYPE){
				$return[MetaFieldModel::DATE_RANGE_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::PHONE_TYPE){
				$return[MetaFieldModel::PHONE_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::COUNTRY_TYPE){
				$return[MetaFieldModel::COUNTRY_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::ADDRESS_TYPE or $child->getType() === MetaFieldModel::ADDRESS_MULTI_TYPE){
				$return[MetaFieldModel::ADDRESS_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::RATING_TYPE){
				$return[MetaFieldModel::RATING_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::ICON_TYPE){
				$return[MetaFieldModel::ICON_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::TABLE_TYPE){
				$return[MetaFieldModel::TABLE_TYPE] = true;
			}

			if($child->getType() === MetaFieldModel::EDITOR_TYPE){
				$return[MetaFieldModel::EDITOR_TYPE] = true;
			}
		}

		return $return;
	}

	/**
	 * Get an field attribute value
	 * (ex. lat, lng, label, etc...)
	 *
	 * @param $attribute
	 * @param null $defaultValue
	 *
	 * @return mixed|null
	 */
	protected function getDefaultAttributeValue($attribute, $defaultValue = null)
	{
		if($this->isChild()){
			$data = $this->getParentData();
			$key = Strings::toDBFormat($this->metaField->getName());

			// Field nested in a repeater
			if(
				isset($data[$key]) and
				isset($data[$key][$this->index]) and
				isset($data[$key][$this->index][$attribute])
			){
				return $data[$key][$this->index][$attribute];
			}

			// Field nested in a nested repeater
			$parentFieldKey = $this->metaField->getParentField()->getName();

			if(
				isset($data[$parentFieldKey]) and
				isset($data[$parentFieldKey][$this->getBlockIndex()]) and
				isset($data[$parentFieldKey][$this->getBlockIndex()][$key]) and
				isset($data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index]) and
				isset($data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index][$attribute])
			){
				return $data[$parentFieldKey][$this->getBlockIndex()][$key][$this->index][$attribute];
			}

			return $defaultValue;
		}

		if($this->isNestedInABlock()){
			$data = $this->getParentData();
			$key = Strings::toDBFormat($this->metaField->getName());

			// first level nested field
			if(
				isset($data['blocks']) and
				isset($data['blocks'][$this->getBlockIndex()]) and
				isset($data['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()]) and
				isset($data['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key]) and
				isset($data['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index]) and
				isset($data['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index][$attribute])
			){
				return $data['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index][$attribute];
			}

			// Field nested in a nested block
			$parentName = $this->parentName;

			preg_match_all('/\[(.*?)\]/iu', $parentName, $parentNameMatch);

			if(!empty($parentNameMatch[1]) and count($parentNameMatch[1]) === 5){
				$match = $parentNameMatch[1];

				if(
					isset($data[$match[0]]) and
					isset($data[$match[0]][$match[1]]) and
					isset($data[$match[0]][$match[1]][$match[2]]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks']) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index]) and
					isset($data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index][$attribute])
				){
					return $data[$match[0]][$match[1]][$match[2]][$match[3]][$match[4]]['blocks'][$this->getBlockIndex()][$this->parentBlock->getName()][$key][$this->index][$attribute];
				}
			}

			return $defaultValue;
		}

		$savedValue = $this->getData(esc_attr($this->getIdName()).'_' . $attribute);

		return ($savedValue !== null and $savedValue !== '' and $savedValue !== false) ? $savedValue : $defaultValue;
	}
}