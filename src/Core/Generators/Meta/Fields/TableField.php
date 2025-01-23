<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class TableField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$this->enqueueAssets();
		$buttonLabel = $this->hasNoValue() ? "Create table" : "Edit table settings";

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$dataTargetId = esc_attr($this->getIdName()).'[value]';
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::TABLE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input '.$this->required().' name="'. esc_attr($this->getIdName()).'[value]" type="hidden" value="' .esc_attr(Strings::escapeForJSON($this->getDefaultValue())) .'">';
		} else {
			$id = esc_attr($this->getIdName());
			$dataTargetId = $id;
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::TABLE_TYPE.'">';
			$field .= '<input '.$this->required().' name="'. esc_attr($this->getIdName()).'" type="hidden" value="' .esc_attr(Strings::escapeForJSON($this->getDefaultValue())) .'">';
		}

		$field .= $this->saveTemplateModal($id);
		$field .= $this->importTemplateModal($id);
		$field .= $this->createTableModal($id);

		$field .= '<div class="acpt-tabulator" id="'.$id.'" data-target-id="'. $dataTargetId .'" style="margin-bottom: 10px;">';

		if($this->hasNoValue()){
			$field .= '<p class="update-nag notice notice-warning" style="margin: 0;">'.Translator::translate("No table already created.").'</p>';
		} else {
			$field .= Translator::translate("Loading...");
		}

		$field .= '</div>';

		$field .= '<div class="btn-wrapper" style="margin-top: 20px;">';
		$field .= '<a class="acpt-open-table-settings button button-primary" href="#acpt-create-table-'.$id.'" rel="modal:open" >'.Translator::translate($buttonLabel).'</a>';
		$field .= '<a class="acpt-open-import-template button button-secondary" href="#acpt-import-template-'.$id.'" rel="modal:open" >'.Translator::translate("Import template").'</a>';

		if(!$this->hasNoValue()){
			$field .= '<a class="acpt-open-save-template button button-secondary" href="#acpt-save-template-'.$id.'" rel="modal:open" >'.Translator::translate("Save as template").'</a>';
		}

		$field .= '<a data-target-id="'.$id.'" class="acpt-clear-table button button-danger" href="#">'.Translator::translate("Clear").'</a>';
		$field .= '</div>';

		$field .= '<div class="outcome">';
		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @param $id
	 *
	 * @return string
	 */
	private function saveTemplateModal($id)
	{
		$modal = '<div id="acpt-save-template-'.$id.'" class="modal">';
		$modal .= '<h3>'.Translator::translate("Save this table as template").'</h3>';
		$modal .= '<div class="errors" style="color: #b02828;"></div>';
		$modal .= '<div class="acpt-admin-meta-label" style="margin-bottom: 10px; width: 100%">';
		$modal .= '<label for="acpt-save-template-name-'.$id.'">'.Translator::translate("Name").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-save-template-name-'.$id.'" class="regular-text" type="text"/>';
		$modal .= '</div>';

		$modal .= '<div class="acpt-flex gap-10">';
		$modal .= '<a href="#" class="acpt-save-template-name button button-primary disabled"  data-target-id="'.$id.'">'.Translator::translate("Save").'</a>';
		$modal .= '<a href="#" rel="modal:close" class="button button-danger">'.Translator::translate("Close").'</a>';
		$modal .= '</div>';

		$modal .= '</div>';

		return $modal;
	}

	/**
	 * @param $id
	 *
	 * @return string
	 */
	private function importTemplateModal($id)
	{
		$modal = '<div id="acpt-import-template-'.$id.'" class="modal">';
		$modal .= '<h3>'.Translator::translate("Import template").'</h3>';
		$modal .= '<div class="errors" style="color: #b02828;"></div>';
		$modal .= '<div class="acpt-admin-meta-label" style="margin-bottom: 10px; width: 100%">';
		$modal .= '<p>'.Translator::translate("Choose the template").':</p>';
		$modal .= '<ul id="acpt-import-template-name-'.$id.'" class="acpt-table-templates">';
		$modal .= '<li>Loading...</li>';
		$modal .= '</ul>';
		$modal .= '</div>';
		$modal .= '</div>';

		return $modal;
	}

	/**
	 * @param $id
	 *
	 * @return string
	 */
	private function createTableModal($id)
	{
		$modal = '<div id="acpt-create-table-'.$id.'" class="modal">';
		$modal .= '<h3>'.Translator::translate("Create new table").'</h3>';

		// rows and cols
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 50%">';
		$modal .= '<label for="acpt-create-table-columns-'.$id.'">'.Translator::translate("Columns").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-columns-'.$id.'" class="regular-text" value="2" type="number" min="1" max="20" step="1"/>';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 50%">';
		$modal .= '<label for="acpt-create-table-rows-'.$id.'">'.Translator::translate("Rows").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-rows-'.$id.'" class="regular-text" value="2" type="number" min="1" max="20" step="1" />';
		$modal .= '</div>';
		$modal .= '</div>';

		// layout, alignment
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 50%">';
		$modal .= '<label for="acpt-create-table-layout-'.$id.'">'.Translator::translate("Layout").'</label>';
		$modal .= '<select class="regular-text" id="acpt-create-table-layout-'.$id.'" style="width: 100%"><option value="horizontal">horizontal</option><option value="vertical">vertical</option></select>';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 50%">';
		$modal .= '<label for="acpt-create-table-alignment-'.$id.'">'.Translator::translate("Alignment").'</label>';
		$modal .= '<select class="regular-text" id="acpt-create-table-alignment-'.$id.'" style="width: 100%"><option value="left">left</option><option value="center">center</option><option value="right">right</option></select>';
		$modal .= '</div>';
		$modal .= '</div>';

		// border
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-border-style-'.$id.'">'.Translator::translate("Border style").'</label>';
		$modal .= '<select class="regular-text" id="acpt-create-table-border-style-'.$id.'" style="width: 100%">
				<option value="solid">Solid</option>
				<option value="dotted">Dotted</option>
				<option value="dashed">Dashed</option>
				<option value="double">Double</option>
				<option value="groove">Groove</option>
				<option value="ridge">Ridge</option>
				<option value="inset">Inset</option>
				<option value="outset">Outset</option>
				<option value="none">None</option>
				<option value="hidden">Hidden</option>
			</select>';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-border-thickness-'.$id.'">'.Translator::translate("Border weight").' (px)</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-border-thickness-'.$id.'" class="regular-text" value="1" type="number" min="1" max="20" step="1" />';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-border-color-'.$id.'">'.Translator::translate("Border color").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-border-color-'.$id.'" class="acpt-color-picker regular-text" value="#cccccc" type="text" />';
		$modal .= '</div>';
		$modal .= '</div>';

		// colors
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-color-'.$id.'">'.Translator::translate("Text color").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-color-'.$id.'" class="acpt-color-picker regular-text" value="#777777" type="text" />';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-background-color-'.$id.'">'.Translator::translate("Main background").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-background-color-'.$id.'" class="acpt-color-picker regular-text" value="#ffffff" type="text" />';
		$modal .= '</div>';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 33%">';
		$modal .= '<label for="acpt-create-table-zebra-background-'.$id.'">'.Translator::translate("Alt background").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-zebra-background-'.$id.'" class="acpt-color-picker regular-text" value="#ffffff" type="text" />';
		$modal .= '</div>';
		$modal .= '</div>';

		// CSS
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-admin-meta-label" style="width: 100%">';
		$modal .= '<label for="acpt-create-table-css-'.$id.'">'.Translator::translate("CSS classes").'</label>';
		$modal .= '<input style="width: 100%" id="acpt-create-table-css-'.$id.'" class="regular-text" type="text" />';
		$modal .= '</div>';
		$modal .= '</div>';

		// header and footer
		$modal .= '<div class="acpt-flex gap-10" style="margin-bottom: 10px;">';
		$modal .= '<div class="acpt-flex gap-5"><input style="margin: 0" type="checkbox" value="1" checked id="acpt-create-table-header-'.$id.'" /> <label for="acpt-create-table-header-'.$id.'">'.Translator::translate("Add header").'</label></div>';
		$modal .= '<div class="acpt-flex gap-5"><input style="margin: 0" type="checkbox" value="1" id="acpt-create-table-footer-'.$id.'" /> <label for="acpt-create-table-footer-'.$id.'">'.Translator::translate("Add footer").'</label></div>';
		$modal .='</div>';

		// buttons
		$modal .= '<a href="#" rel="modal:close" class="acpt-create-table button button-primary" data-target-id="'.$id.'">'.Translator::translate("Create").'</a>';
		$modal .= '</div>';

		return $modal;
	}

	/**
	 * @return bool
	 */
	private function hasNoValue()
	{
		return (empty($this->getDefaultValue()) or $this->getDefaultValue() == "{}");
	}

	/**
	 * Enqueue assets
	 */
	private function enqueueAssets()
	{
		wp_enqueue_script( 'jquery.modal-js', plugins_url( 'advanced-custom-post-type/assets/vendor/jquery.modal/jquery.modal.min.js'), [], '3.1.0', true);
		wp_enqueue_style( 'jquery.modal-css', plugins_url( 'advanced-custom-post-type/assets/vendor/jquery.modal/jquery.modal.min.css'), [], '3.1.0', 'all');
		wp_enqueue_script( 'sortable-js', plugins_url( 'advanced-custom-post-type/assets/vendor/sortablejs/sortablejs.min.js'), [], '3.1.0', true);
		wp_enqueue_script( 'interact-js', plugins_url( 'advanced-custom-post-type/assets/vendor/interact/interact.min.js'), [], '3.1.0', true);
		wp_enqueue_script( 'acpt-tabulator-js', plugins_url( 'advanced-custom-post-type/assets/static/js/ACPTTabulator.js'), [], '1.0.0', true);
		wp_enqueue_script( 'custom-tabulator-js', plugins_url( 'advanced-custom-post-type/assets/static/js/tabulator.js'), [], '1.0.0', true);
	}
}