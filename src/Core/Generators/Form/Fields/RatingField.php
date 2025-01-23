<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

class RatingField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$defaultValue = $this->getDefaultValue() * 2;
		$id = esc_attr($this->getIdName());
		$field = '';

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

		$field .= '<fieldset class="acpt-rating">';

		foreach ($ratings as $value => $label){
			$checked = ($defaultValue == $value) ? 'checked' : '';
			$class = ($value % 2 == 0) ? '' : 'half';
			$field .= '<input class="rate-input" '.$checked.' type="radio" id="'.$id.'_rating'.$value.'" name="'.esc_attr($this->getIdName()).'" value="'.$value.'" />
			<label class="rate-label '.$class.'" for="'.$id.'_rating'.$value.'" title="'.$label.'"></label>';
		}

		$field .= '</fieldset>';



		return $field;
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets()
	{
		// TODO: Implement enqueueFieldAssets() method.
	}

	/**
	 * @return int
	 */
	private function getDefaultValue(): int
	{
		if(!empty($this->defaultValue())){
			$defaultValue = $this->defaultValue();

			if($defaultValue < 0){
				$defaultValue = 0;
			}

			if($defaultValue > 5){
				$defaultValue = 5;
			}

			$defaultValue = floor($defaultValue);

			return (int)$defaultValue;
		}

		return 5;
	}
}
