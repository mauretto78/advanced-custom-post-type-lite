<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class ImageField extends AbstractField
{
	public function render()
	{
		$attachmentId = (isset($this->getAttachments()[0])) ? $this->getAttachments()[0]->getId() : '';
        $preview = (!empty($this->getDefaultValue())) ? '<img src="'.esc_url($this->getDefaultValue()).'"/>' : '<span class="placeholder">'.Translator::translate("No image selected").'</span>';

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::IMAGE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
		} else {
			$id = esc_attr($this->getIdName());
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::IMAGE_TYPE.'">';
		}

        $field .= '<div class="file-upload-wrapper">';
        $field .= '<div class="image-preview"><div class="image">'. $preview .'</div></div>';
		$field .= '<div class="btn-wrapper">';

		if($this->isChild() or $this->isNestedInABlock()){
			$field .= '<input id="'.$id.'[attachment_id]['.$this->getIndex().']" name="'. esc_html($this->getIdName()).'[attachment_id]" type="hidden" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'" name="'. esc_attr($this->getIdName()).'[value]" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'" '.$this->appendDataValidateAndLogicAttributes().'>';
		} else {
			$field .= '<input id="'.$id.'_attachment_id" name="'. esc_html($this->getIdName()).'_attachment_id" type="hidden" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'" name="'. esc_attr($this->getIdName()).'" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'" '.$this->appendDataValidateAndLogicAttributes().'>';
		}

		$field .= '<a class="upload-image-btn button button-primary">'.Translator::translate("Upload").'</a>';
		$field .= '<button data-target-id="'.$id.'" class="upload-delete-btn button button-secondary">'.Translator::translate("Delete").'</button>';

		$field .= '</div>';
		$field .= '</div>';


		return $this->renderField($field);
	}
}