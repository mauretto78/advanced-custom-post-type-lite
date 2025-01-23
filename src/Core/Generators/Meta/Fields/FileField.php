<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class FileField extends AbstractField
{
	/**
	 * @return mixed|string
	 */
	public function render()
	{
		if(!is_admin()){
			return $this->renderOnFrontEnd();
		}

		$hideLabel = $this->getAdvancedOption('hide_url_label');
		$accepts = ($this->getAdvancedOption('accepts') and is_array($this->getAdvancedOption('accepts'))) ? implode(", ", $this->getAdvancedOption('accepts')) : "application";
		$maxSize = $this->getAdvancedOption('max_size') ?? null;
		$minSize = $this->getAdvancedOption('min_size') ?? null;

		$attachmentId = (isset($this->getAttachments()[0])) ? $this->getAttachments()[0]->getId() : '';

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::FILE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
		} else {
			$id = esc_attr($this->getIdName());
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::FILE_TYPE.'">';
		}

        $field .= '<div class="file-upload-wrapper">';
        $field .= '<div class="file-preview"><div class="file">'. $this->preview($id, $hideLabel) .'</div></div>';
		$field .= '<div class="btn-wrapper">';

		if($this->isChild() or $this->isNestedInABlock()){
            $targetId = $id.'[label]['.$this->getIndex().']';
            $labelName = esc_attr($this->getIdName()).'[label]';
			$field .= '<input id="'.$id.'[attachment_id]['.$this->getIndex().']" name="'. esc_html($this->getIdName()).'[attachment_id]" type="hidden" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'['.$this->getIndex().']" name="'. esc_html($this->getIdName()).'[value]" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'" '.$this->appendDataValidateAndLogicAttributes().'>';
		} else {
            $targetId = $id.'_label';
            $labelName = $id.'_label';
			$field .= '<input id="'.$id.'_attachment_id" name="'. esc_html($this->getIdName()).'_attachment_id" type="hidden" value="' .$attachmentId.'">';
			$field .= '<input readonly '.$this->required().' id="'.$id.'" name="'. esc_html($this->getIdName()).'" type="text" class="hidden" value="' .esc_attr($this->getDefaultValue()) .'" '.$this->appendDataValidateAndLogicAttributes().'>';
		}

		$field .= '<button
				class="upload-file-btn button button-primary"
				data-accepts="'.$accepts.'"
				data-max-size="'.$maxSize.'"
				data-min-size="'.$minSize.'"
				data-label-name="'.$labelName.'"
				data-target-id="'.$targetId.'"
				data-hide-label="'.(empty($hideLabel) ? '0' : '1').'"
				data-id="'.esc_attr($this->getIdName()).'"
			>
				'.Translator::translate("Upload").'
			</button>';
		$field .= '<button data-target-id="'.$id.'" class="file-delete-btn button button-secondary">'.Translator::translate("Delete").'</button>';

		$field .= '</div>';
		$field .= '<div class="acpt-error" id="file-errors-'.esc_attr($this->getIdName()).'"></div>';

		if(!empty($accepts)){
			$field .= '<div class="file-accepts"><i>'.Translator::translate("Input file accepts").': '. $accepts .'</i></div>';
		}

        $field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function getDefaultLabel()
	{
		$hideLabel = $this->getAdvancedOption('hide_url_label');
		$after = $this->getAdvancedOption('after');
		$before = $this->getAdvancedOption('before');

		// If hide label is ON
		if(!empty($hideLabel)){
		    return $this->getFileName($before, $after);
        }

        $label = $this->getDefaultAttributeValue('label', 'Enter download text link');

        if(empty($label) or $label === 'Enter download text link'){
            return $this->getFileName($before, $after);
        }

		return $label;
	}

    /**
     * @param null $before
     * @param null $after
     * @return string
     */
	protected function getFileName($before = null, $after = null)
    {
        $id = $this->getDefaultAttributeValue('attachment_id');
        $attachment = WPAttachment::fromId($id);

        if(!$attachment->isEmpty()){
            return $before.$attachment->getTitle().$after;
        }

        return $before.$this->getData(esc_attr($this->getIdName())).$after;
    }

    /**
     * @param $id
     * @param bool $hideLabel
     * @return string
     */
	private function preview($id, $hideLabel = false)
	{
        if($this->getDefaultValue() !== ''){

            $after = $this->getAdvancedOption('after');
            $before = $this->getAdvancedOption('before');
            $label = (!empty($this->getDefaultLabel())) ? $this->getDefaultLabel() : $this->getDefaultValue();
            $label = $before.$label.$after;
            $url = esc_url($this->getDefaultValue());

            $preview = '<div class="preview-file">';
            $preview .= '<a title="'.$url.'" class="acpt-text-truncate" target="_blank" href="'.$url.'">'.$label.'</a>';

            if(empty($hideLabel)){

                if($this->isChild() or $this->isNestedInABlock()){
                    $targetId = $id.'[label]['.$this->getIndex().']';
                    $preview .= '<input id="'.$targetId.'" name="'. esc_attr($this->getIdName()).'[label]" type="text" class="hidden file-label-input" value="'.esc_attr($this->getDefaultLabel()) .'" placeholder="'.Translator::translate("Enter download text link").'">';
                } else {
                    $targetId = $id.'_label';
                    $preview .= '<input id="'.$targetId.'" name="'. $id.'_label" type="text" class="hidden file-label-input" value="'.esc_attr($this->getDefaultLabel()) .'" placeholder="'.Translator::translate("Enter download text link").'">';
                }

                $preview .= '<a href="#" data-target-id="'.$targetId.'" class="edit-file-label" title="'.Translator::translate("Edit label").'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21a1 1 0 0 0 .24 0l4-1a1 1 0 0 0 .47-.26L21 7.41a2 2 0 0 0 0-2.82L19.42 3a2 2 0 0 0-2.83 0L4.3 15.29a1.06 1.06 0 0 0-.27.47l-1 4A1 1 0 0 0 3.76 21A1 1 0 0 0 4 21M18 4.41L19.59 6L18 7.59L16.42 6zM5.91 16.51L15 7.41L16.59 9l-9.1 9.1l-2.11.52z"/></svg>
                </a>';

                $preview .= '<a href="#" data-target-id="'.$targetId.'" class="save-file-label hidden" title="'.Translator::translate("Save label").'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15.586l-3.293-3.293l-1.414 1.414L10 18.414l9.707-9.707l-1.414-1.414z"/></svg>
                </a>';
            }

            $preview .= '</div>';

            return $preview;
        }

        return '<span>No file selected</span>';
	}

	/**
	 * Used only in comment form
	 *
	 * @return string
	 */
	private function renderOnFrontEnd()
	{
		$accept = (!empty($this->getAdvancedOption('accept'))) ? $this->getAdvancedOption('accept') : '*';
		$multiple = (!empty($this->getAdvancedOption('multiple'))) ? $this->getAdvancedOption('multiple') : '';
		$name = ($multiple) ? esc_attr($this->getIdName()).'[]' : esc_attr($this->getIdName());

		return "
			<input
				id='".esc_attr($this->getIdName())."'
				name='".$name."'
				type='file'
				".($multiple ? 'multiple' : '')."
				accept='".$accept."'
				".$this->required()."
			/>";
	}
}