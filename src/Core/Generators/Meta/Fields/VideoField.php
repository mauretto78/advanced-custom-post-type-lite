<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class VideoField extends AbstractField
{
	public function render()
	{
		$attachmentId = (isset($this->getAttachments()[0])) ? $this->getAttachments()[0]->getId() : '';
        $preview = (!empty($this->getDefaultValue())) ? $this->getPreviewVideo() : '<span class="placeholder">'.Translator::translate("No video selected").'</span>';

        $field = '<div class="file-upload-wrapper">';

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::VIDEO_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
            $field .= '<div class="image-preview"><div class="image">'. $preview .'</div></div>';
			$field .= '<div class="btn-wrapper">';
			$field .= '<input id="'.$id.'[attachment_id]['.$this->getIndex().']" type="hidden" name="'. esc_attr($this->getIdName()).'[attachment_id]" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'['.$this->getIndex().']" name="'. esc_attr($this->getIdName()).'[value]" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'">';
		} else {
			$id = esc_attr($this->getIdName());
			$field .= '<input type="hidden" name="'. $id.'_type" value="'.MetaFieldModel::VIDEO_TYPE.'">';
            $field .= '<div class="image-preview"><div class="image">'. $preview .'</div></div>';
			$field .= '<div class="btn-wrapper">';
			$field .= '<input id="'.$id.'_attachment_id" name="'. esc_html($this->getIdName()).'_attachment_id" type="hidden" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'" name="'. esc_attr($this->getIdName()).'" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'">';
		}

		$field .= '<a class="upload-video-btn button button-primary">'.Translator::translate("Upload").'</a>';
		$field .= '<a data-target-id="'.esc_attr($this->getIdName()).'" class="upload-delete-btn delete-video-btn button button-secondary">'.Translator::translate("Delete").'</a>';

		$field .= '</div>';
		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function getPreviewVideo()
	{
		return '<video controls>
              <source src="'.esc_url($this->getDefaultValue()).'" type="video/mp4">
            Your browser does not support the video tag.
            </video>';
	}
}
