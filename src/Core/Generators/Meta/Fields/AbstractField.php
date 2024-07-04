<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Session;

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
	 * @return string
	 */
	protected function generateRandomId()
	{
		return 'id_'.rand(999999,111111);
	}

	/**
	 * @return string
	 */
	protected function displayLabel()
	{
		$label = ($this->metaField->getLabel()) ? $this->metaField->getLabel() : $this->metaField->getName();
		$label = esc_html($label);
		$label = '<span>'.$this->addAsteriskToLabel($label).'</span>';

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
		$css = '';
		$headlineAlignment = 'top';
		$width = '100';
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
		$return .= '</label>';

		if($this->metaField->getDescription()){
			$return .= '<span class="description">';
			$return .= $this->metaField->getDescription();
			$return .= '</span>';
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
	 * @return mixed|null
	 */
	protected function getDefaultValue()
	{
		$value = $this->getData($this->getIdName());

		if($value !== null and $value !== ''){
			return $value;
		}

		return $this->metaField->getDefaultValue();
	}
}