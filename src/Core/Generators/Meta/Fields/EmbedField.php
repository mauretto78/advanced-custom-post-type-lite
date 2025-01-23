<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class EmbedField extends AbstractField
{
	public function render()
	{
		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::EMBED_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" value="'.esc_attr($this->getDefaultValue()).'" type="url" class="acpt-form-control embed">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::EMBED_TYPE.'">';
			$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" type="url" class="acpt-form-control embed" value="'.esc_attr($this->getDefaultValue()).'">';
		}

		$field .= $this->getPreview();

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function getPreview()
	{
		if( empty($this->getDefaultValue())){
			return '';
		}

		$preview = '<div class="embed-preview">';
		$preview .= '<div class="embed">';
		$preview .= (new \WP_Embed())->shortcode([
			'width' => 180,
			'height' => 135,
		], esc_attr($this->getDefaultValue()));
		$preview .= '</div>';
		$preview .= '</div>';

		return $preview;
	}
}