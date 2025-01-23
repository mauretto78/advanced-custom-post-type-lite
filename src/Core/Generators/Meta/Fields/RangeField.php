<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class RangeField extends AbstractField
{
	public function render()
	{
		$data = $this->data();

		$min = $data['min'];
		$max = $data['max'];
		$step = $data['step'];
		$defaultValue = (!empty($this->getDefaultValue() and is_numeric($this->getDefaultValue()))) ? $this->getDefaultValue() : $data['oneHalf'];

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::RANGE_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::RANGE_TYPE.'">';
		}

		$field .= '<div class="acpt-range-wrapper">';
		$field .= '<div class="">';
		$field .= '<input '.$this->required().' id="'.esc_attr($this->getIdName()).'" list="'.esc_attr($this->getIdName()).'_markers" name="'. esc_attr($this->getIdName()).'" type="range" class="acpt-admin-meta-field-input acpt-range" value="'. esc_attr($defaultValue).'"';

		if($min){
			$field .= ' min="'.$min.'"';
		}

		if($max){
			$field .= ' max="'.$max.'"';
		}

		if($step){
			$field .= ' step="'.$step.'"';
		}

		$field .= '>';

		$field .= '<datalist class="acpt-datalist" id="'.esc_attr($this->getIdName()).'_markers">';

		foreach ($data['datalist'] as $datum){
			$field .= '<option value="'.$datum.'" label="'.$datum.'">'.$datum.'</option>';
		}

		$field .= '</datalist>';
		$field .= '</div>';
		$field .= '<span id="'.esc_attr($this->getIdName()).'_value" class="acpt-range-value">'.esc_attr($defaultValue).'</span>';
		$field .= '</div>';

		return $this->renderField($field);
	}

	/**
	 * @return array
	 */
	private function data(): array
	{
		$min = ($this->getAdvancedOption('min') and is_numeric($this->getAdvancedOption('min'))) ? $this->getAdvancedOption('min') : 0;
		$max = ($this->getAdvancedOption('max') and is_numeric($this->getAdvancedOption('max'))) ? $this->getAdvancedOption('max') : 100;
		$step = ($this->getAdvancedOption('step') and is_numeric($this->getAdvancedOption('step'))) ? $this->getAdvancedOption('step') : 1;

		$delta = $max - $min;
		$segment = $delta/4;
		$oneFourth = number_format($min+$segment, 2);
		$oneHalf = number_format($min+($segment*2), 2);
		$threeFourths = number_format($min+($segment*3), 2);

		$min = number_format($min, 2);
		$max = number_format($max, 2);
		$step = number_format($step, 2);

		$datalist = [
			$min,
			$oneFourth,
			$oneHalf,
			$threeFourths,
			$max,
		];

		return [
			'min' => $min,
			'max' => $max,
			'step' => $step,
			'oneHalf' => $oneHalf,
			'datalist' => $datalist
		];
	}
}