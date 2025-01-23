<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;

class IconField extends AbstractField
{
	public function render()
	{
		$this->enqueueAssets();

		if($this->isChild() or $this->isNestedInABlock()){
			$id = Strings::generateRandomId();
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::ICON_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<input type="hidden" class="acpt-icon-picker-value" data-target-id="'. $id.'" id="'.$this->getIdName().'" name="'. esc_attr($this->getIdName()).'[value]" value="'.htmlspecialchars($this->getDefaultValue()).'"/>';
			$field .= $this->renderIconPicker($id);
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::ICON_TYPE.'">';
			$field .= '<input type="hidden" class="acpt-icon-picker-value" data-target-id="'. $this->getIdName().'" id="'.$this->getIdName().'" name="'. esc_attr($this->getIdName()).'" value="'.htmlspecialchars($this->getDefaultValue()).'"/>';
			$field .= $this->renderIconPicker($this->getIdName());
		}

		return $this->renderField($field);
	}

	/**
	 * @param $id
	 *
	 * @return string
	 */
	protected function renderIconPicker($id)
	{
		$settingsButtonCssClass = (!empty($this->getDefaultValue())) ? '': ' hidden';

		$field  = $this->iconPickerModal($id);
		$field .= '<div class="acpt-icon-picker-wrapper" data-target-id="'.$id.'">';
		$field .= '<div class="acpt-icon-picker-preview-wrapper '.$settingsButtonCssClass .'" data-target-id="'.$id.'">';
		$field .= '<div class="acpt-icon-picker-preview" data-target-id="'.$id.'">';

		$fill = "#777777";
		$stroke = "#777777";
		$size = 24;

		if(!empty($this->getDefaultValue())){
			$extractColorAndSize = $this->extractColorAndSize($this->getDefaultValue());
			$fill = $extractColorAndSize['fill'];
			$stroke = $extractColorAndSize['stroke'];
			$size = $extractColorAndSize['size'];
			$field .= $this->getDefaultValue();
		}


		$field .= '</div>';

		$field .= '<div class="acpt-icon-picker-settings-buttons" data-target-id="'.$this->getIdName().'">';

		// fill
		$field .= '<div class="acpt-icon-picker-fill '.$settingsButtonCssClass .'" data-target-id="'.$id.'">';
		$field .= '<span class="acpt-icon-picker-label">'.Translator::translate("Fill").'</span>';
		$field .= '<input type="text" class="acpt-admin-meta-field-input acpt-icon-picker-fill acpt-color-picker" data-target-id="'.$id.'" value="'.$fill.'" />';
		$field .= '</div>';

		// stroke
		$field .= '<div class="acpt-icon-picker-stroke '.$settingsButtonCssClass .'" data-target-id="'.$id.'">';
		$field .= '<span class="acpt-icon-picker-label">'.Translator::translate("Stroke").'</span>';
		$field .= '<input type="text" class="acpt-admin-meta-field-input acpt-icon-picker-stroke acpt-color-picker" data-target-id="'.$id.'" value="'.$stroke.'" />';
		$field .= '</div>';

		// size
		$field .= '<div class="acpt-icon-picker-size '.$settingsButtonCssClass .'" data-target-id="'.$id.'">';
		$field .= '<span class="acpt-icon-picker-label">'.Translator::translate("Size").'</span>';
		$field .= '<input type="number" step="1" max="512" min="12" data-target-id="'.$id.'" class="acpt-admin-meta-field-input" value="'.$size.'" />';
		$field .= '</div>';

		$field .= '</div>';
		$field .= '</div>';

		// buttons
		$field .= '<div class="acpt-icon-picker-buttons" data-target-id="'.$this->getIdName().'">';
		$field .= '<a data-target-id="'.$id.'" class="acpt-icon-picker-button button button-secondary" href="#">'.Translator::translate("Choose an icon").'</a>';
		$field .= '<a data-target-id="'.$id.'" class="acpt-icon-picker-delete button button-danger '.$settingsButtonCssClass .'" href="#">'.Translator::translate("Clear").'</a>';
		$field .= '</div>';

		$field .= '</div>';

		return $field;
	}

	/**
	 * @param $svg
	 *
	 * @return array
	 */
	protected function extractColorAndSize($svg)
	{
		preg_match( '/width="(.*?)"/', $svg, $matchesWidth);
		preg_match( '/fill="(.*?)"/', $svg, $matchesFill);
		preg_match( '/stroke="(.*?)"/', $svg, $matchesStroke);

		$size = 24;
		$fill = "#777777";
		$stroke = "#777777";

		if(!empty($matchesWidth) and !empty($matchesWidth[0])){
			if($matchesWidth[1] !== "1em"){
				$size =$matchesWidth[1];
			}
		}

		if(!empty($matchesFill) and !empty($matchesFill[0])){
			if($matchesFill[1] !== "currentColor" and $matchesFill[1] !== "none"){
				$fill = $matchesFill[1];
			}
		}

		if(!empty($matchesStroke) and !empty($matchesStroke[0])){
			if($matchesStroke[1] !== "currentColor" and $matchesStroke[1] !== "none"){
				$stroke = $matchesStroke[1];
			}
		}

		return [
			'fill' => (string) $fill,
			'stroke' => (string) $stroke,
			'size'  => (int)$size,
		];
	}

	/**
	 * @param $id
	 *
	 * @return string
	 */
	protected function iconPickerModal($id)
	{
		$idModal = $id.'_modal';

		$picker = '<div class="acpt-icon-picker-bg hidden" id="'.$idModal.'">';
		$picker .= '<div class="acpt-icon-picker">';
		$picker .= '<div class="acpt-icon-picker-header">';
		$picker .= '<h3>'.Translator::translate("Choose an icon").'</h3>';
		$picker .= '<button data-target-id="'.$idModal.'" type="button" class="components-button has-icon close-acpt-icon-picker" aria-label="Close this modal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg></button>';
		$picker .= '</div>';

		// back to selection
		$picker .= '<a class="acpt-icon-picker-back hidden" href="#">'.Translator::translate("Back to the selection").'</a>';

		// choose between upload or browse icons
		$picker .= '<ul class="acpt-icon-picker-selector">';
		$picker .= '<li data-value="upload">'.Translator::translate("Upload a SVG file").'</li>';
		$picker .= '<li data-value="browse">'.Translator::translate("Browse icons").'</li>';
		$picker .= '</ul>';

		// upload
		$picker .= '<div class="acpt-icon-picker-upload hidden">';
		$picker .= '<input class="regular-text acpt-icon-picker-upload" data-target-id="'.$id.'" type="file" accept="image/svg+xml" >';
		$picker .= '</div>';

		// browse icons from iconify
		$picker .= '<div class="acpt-icon-picker-browse hidden">';
		$picker .= '<p>'.Translator::translate("Type at least 3 characters to start searching.").'</p>';
		$picker .= '<input class="regular-text acpt-icon-picker-search" type="text" placeholder="'.Translator::translate("Example: heart").'">';
		$picker .= '<div class="acpt-icon-picker-results" data-target-id="'.$id.'"></div>';
		$picker .= '</div>';

		$picker .= '</div>';
		$picker .= '</div>';

		return $picker;
	}

	/**
	 * Enqueue needed assets
	 */
	private function enqueueAssets()
	{
		wp_enqueue_style( 'icon-picker-css', plugins_url( 'advanced-custom-post-type/assets/static/css/icon-picker.css'), [], ACPT_PLUGIN_VERSION, 'all');
	}
}