<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Posts;
use ACPT_Lite\Utils\Wordpress\Translator;

class PostObjectField extends AbstractField
{
	public function render()
	{
		$layout = $this->getAdvancedOption('layout');

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::POST_OBJECT_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 acpt-admin-meta-field-input">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::POST_OBJECT_TYPE.'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 regular-text">';
		}

		$field .= '<option value="">'.Translator::translate("--Select--").'</option>';
		$posts = $this->postTypeList();

		if(is_array($posts)){
			foreach($posts as $element){
				$field .= '<optgroup label="'.$element['postType'].'">';

				foreach ($element['posts'] as $id => $post){
					$selected = ($id === (int)$this->getDefaultValue()) ? 'selected="selected"' : '';
					$field .= '<option '.$this->dataImage($layout, $id).' '.$selected.' value="'.$id.'">'.esc_html($post).'</option>';
				}

				$field .= '</optgroup>';
			}
		}

		$field .= '</select>';

		return $this->renderField($field);
	}

	/**
	 * @return array
	 */
	protected function postTypeList()
	{
		$postQuery = [];

		if($this->getAdvancedOption('filter_post_type')){
			$postQuery['post_type'] = $this->getAdvancedOption('filter_post_type');
		}

		if($this->getAdvancedOption('filter_post_status')){
			$postQuery['post_status'] = $this->getAdvancedOption('filter_post_status');
		}

		if($this->getAdvancedOption('filter_taxonomy')){
			$postQuery['taxonomy'] = $this->getAdvancedOption('filter_taxonomy');
		}

		return Posts::getList($postQuery);
	}

	/**
	 * @param $layout
	 * @param $postId
	 *
	 * @return string|null
	 */
	protected function dataImage($layout, $postId)
	{
		if($layout === 'image'){
			$thumbnailUrl = get_the_post_thumbnail_url($postId);

			return ($thumbnailUrl) ? 'data-image="'.$thumbnailUrl.'"' : 'data-image="https://placehold.co/40x40"';
		}

		return null;
	}
}