<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class RatingField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$this->enqueueAssets();

		if($this->isChild() or $this->isNestedInABlock()){

			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::RATING_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::RATING_TYPE.'">';
		}

		$field .= '<div class="">';
		$field .= '<fieldset class="acpt-rating">';
		$field .= $this->renderRating();
		$field .= '</fieldset>';
		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @return string
	 */
	private function renderRating()
	{
		$id = esc_attr($this->getIdName());
		$field = '';
		$cssClass = 'rate-input';

		if($this->isLeadingField()){
			$cssClass .= ' acpt-leading-field';
		}

		$ratings = [
			10 => '5/5',
			9 => '4.5/5',
			8 => '4/5',
			7 => '3.5/5',
			6 => '3/5',
			5 => '2.5/5',
			4 => '2/5',
			3 => '1.5/5',
			2 => '1/5',
			1 => '0.5/5',
		];

		foreach ($ratings as $value => $label){
			$checked = ($this->getDefaultValue() == $value) ? 'checked' : '';
			$class = ($value % 2 == 0) ? '' : 'half';

			if($this->isChild()){
				$field .= '<input class="'.$cssClass.'" '.$checked.' type="radio" id="'.$id.'_rating'.$value.'" name="'.esc_attr($this->getIdName()).'[value]" value="'.$value.'" /><label style="width: auto !important;" class="rate-label '.$class.'" for="'.$id.'_rating'.$value.'" title="'.$label.'"></label>';
			} else {
				$field .= '<input class="'.$cssClass.'" '.$checked.' type="radio" id="'.$id.'_rating'.$value.'" name="'.esc_attr($this->getIdName()).'" value="'.$value.'" /><label style="width: auto !important;" class="rate-label '.$class.'" for="'.$id.'_rating'.$value.'" title="'.$label.'"></label>';
			}
		}

		return $field;
	}

	/**
	 * Enqueue needed assets
	 */
	private function enqueueAssets()
	{
		wp_enqueue_style( 'rating-css', plugins_url( 'advanced-custom-post-type/assets/static/css/rating.css'), [], ACPT_PLUGIN_VERSION, 'all');
	}
}
