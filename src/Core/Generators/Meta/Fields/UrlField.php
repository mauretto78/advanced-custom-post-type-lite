<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class UrlField extends AbstractField
{
	public function render()
	{
		$id = esc_attr($this->getIdName());
		$style = "";
		$cssClass = 'regular-text acpt-admin-meta-field-input';

		if($this->hasErrors()){
			$cssClass .= ' has-errors';
		}

		$after = $this->getAdvancedOption('after');
		$before = $this->getAdvancedOption('before');

		if(!empty($after) or !empty($before)){
			$style = "width: 50%";
		}

		$hideLabel = $this->getAdvancedOption('hide_url_label');
		$field =  '<div class="acpt-flex gap-10">';

		if(empty($hideLabel)){
			$labelId =  ( $this->isChild() or $this->isNestedInABlock() ) ? $id.'[label]' : $id.'_label' ;

			$field .= (new AfterAndBeforeFieldGenerator())->generate($this->metaField, '<input 
				id="'. $labelId .'" 
				name="'. $labelId .'" 
				type="text" 
				class="acpt-admin-meta-field-input" 
				value="'.$this->getDefaultLabelValue().'" 
				placeholder="'.Translator::translate('Enter text link').'"
			>', 'width: 50%');
		}

		if($this->isChild() or $this->isNestedInABlock()){

			if($this->isLeadingField()){
				$cssClass .= ' acpt-leading-field';
			}

			$field .= '<input type="hidden" name="'. $id.'[type]" value="'.MetaFieldModel::URL_TYPE.'">';
			$field .= '<input type="hidden" name="'. $id.'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input type="hidden" name="meta_fields[]" value="'.$id.'[label]">';
			$field .= '<input style="'.$style.'" '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. $id.'[value]" type="url" class="'.$cssClass.'" value="'. esc_attr($this->getDefaultURLValue()) .'" placeholder="'.Translator::translate('Enter the URL').'"';
		} else {
			$field .= '<input type="hidden" name="'. $id.'_type" value="'.MetaFieldModel::URL_TYPE.'">';
			$field .= '<input style="'.$style.'" '.$this->required().' id="'.$id.'" name="'. $id.'" type="url" class="'.$cssClass.'" value="'.esc_attr($this->getDefaultURLValue()) .'" placeholder="'.Translator::translate('Enter the URL').'"';
		}

		$min = $this->getAdvancedOption('min');
		$max = $this->getAdvancedOption('max');
		$pattern = $this->getAdvancedOption('pattern');

		if($min){
			$field .= ' minlength="'.$min.'"';
		}

		if($max){
			$field .= ' maxlength="'.$max.'"';
		}

		if($pattern){
			$field .= ' pattern="'.$pattern.'"';
		}

		$field .= $this->appendDataValidateAndLogicAttributes();
		$field .= '>';

		$field .= '</div>';
		$field .= '<div class="file-preview"><div class="file">'. $this->preview() .'</div></div>';

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function preview()
	{
		if($this->getDefaultValue() !== ''){

			$after = $this->getAdvancedOption('after');
			$before = $this->getAdvancedOption('before');
			$label = (!empty($this->getDefaultLabelValue())) ? $this->getDefaultLabelValue() : $this->getDefaultURLValue();
			$label = $before.$label.$after;
            $url = esc_url($this->getDefaultURLValue());

			return '<div class="preview-file">
						<span>'.Translator::translate("Preview").'</span>
						<a title="'.$url.'" class="acpt-text-truncate" target="_blank" href="'.$url.'">'.$label.'</a>
					</div>';
		}

		return '';
	}

	/**
	 * @return string
	 */
	private function getDefaultURLValue()
	{
		if(is_string($this->getDefaultValue())){
			return $this->getDefaultValue();
		}

		$defaultValue = $this->getDefaultValue();

		if(isset($defaultValue['url']) and is_string($defaultValue['url'])){
			return $defaultValue['url'];
		}

		return null;
	}

	/**
	 * @return string
	 */
	private function getDefaultLabelValue()
	{
		$defaultValue = (is_array($this->getDefaultValue()) and isset($this->getDefaultValue()['urlLabel'])) ? $this->getDefaultValue()['urlLabel'] : '';

		return $this->getDefaultAttributeValue('label', $defaultValue);
	}
}
