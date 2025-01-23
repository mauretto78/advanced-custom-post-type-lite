<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class EditorField extends AbstractField
{
	public function render()
	{
        $id = Strings::generateRandomId();
		$this->enqueueAssets($id);
		$rows = $this->getAdvancedOption('rows') ? ceil($this->getAdvancedOption('rows')) : 20;
		$defaultValue = $this->getDefaultValue() !== '' ? esc_attr($this->getDefaultValue()) : '';

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::EDITOR_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$textareaName =  esc_attr($this->getIdName()). '[value]';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::EDITOR_TYPE.'">';
			$textareaName =  esc_attr($this->getIdName());
		}

        $field .= '<div class="acpt-wp-editor-buttons hide-if-no-js" id="buttons_'.$id.'"></div>';
		$field .= '<div class="acpt-wp-editor-wrapper">';
        $field .= '<div id="loading_'.$id.'" class="loading">TinyMCE is loading...</div>';
		$field .= '<textarea name="'.$textareaName.'" id="'.$id.'" contentEditable="true" class="hidden regular-text acpt-admin-meta-field-input acpt-wp-editor" rows="'.$rows.'">'. $defaultValue.'</textarea>';
		$field .= '</div>';

		return $this->renderField($field);
	}

	private function enqueueAssets($id)
	{
        if ( ! function_exists( 'media_buttons' ) ) {
            require ABSPATH . 'wp-admin/includes/media.php';
        }

        global $tinymce_version;

        $js_src = includes_url('js/tinymce/') . 'tinymce.min.js';
        $css_src = includes_url('css/') . 'editor.css?v='.$tinymce_version;

        if ( ! class_exists( '_WP_Editors', false ) ) {
            require ABSPATH . WPINC . '/class-wp-editor.php';

            \_WP_Editors::enqueue_default_editor();
        }

        wp_enqueue_script( 'tinymce_js', $js_src, [], $tinymce_version, true);
        wp_register_style('tinymce_css', $css_src );
        wp_enqueue_style('tinymce_css');
	}
}
