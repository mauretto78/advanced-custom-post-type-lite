<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;

class UrlField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$extra = $this->fieldModel->getExtra();
		$hideLabel = (isset($extra['hideLabel'])) ? $extra['hideLabel'] : false;
		$labelPlaceholder = (isset($extra['labelPlaceholder'])) ? $extra['labelPlaceholder'] : false;

		if($hideLabel){
			return "
				<input
					id='".esc_attr($this->getIdName())."'
					name='".esc_attr($this->getIdName())."'
					placeholder='".$this->placeholder()."'
					value='".$this->defaultUrlValue()."'
					type='url'
					class='".$this->cssClass()."'
					".$this->required()."
					".$this->appendDataValidateAttributes()."
				/>
			";
		}

		$label = "
			<input
					id='".esc_attr($this->getIdName())."_label'
					name='".esc_attr($this->getIdName())."_label'
					placeholder='".$labelPlaceholder."'
					value='".$this->defaultUrlLabel()."'
					type='text'
					class='".$this->cssClass()."'
					".$this->required()."
					".$this->appendDataValidateAttributes()."
				/>";

		if($this->fieldModel->getMetaField() !== null){
			$label = (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $label, "width: 50%");
		}

		return "
			<div class='actp-form-inline'>
				<input
					style='width: 50%'
					id='".esc_attr($this->getIdName())."'
					name='".esc_attr($this->getIdName())."'
					placeholder='".$this->placeholder()."'
					value='".$this->defaultUrlValue()."'
					type='url'
					class='".$this->cssClass()."'
					".$this->required()."
					".$this->appendDataValidateAttributes()."
				/>
				".$label."
			</div>
			";
	}

    /**
     * @return string
     */
    private function defaultUrlValue()
    {
        $defaultValue = $this->defaultValue();

        if(is_scalar($defaultValue)){
            return $defaultValue;
        }

        if(is_array($defaultValue) and isset($defaultValue['url'])){
            return $defaultValue['url'];
        }

        return null;
    }

    /**
     * @return string
     */
    private function defaultUrlLabel()
    {
        $savedLabel = $this->defaultExtraValue("label");

        if(!empty($savedLabel)){
            return $savedLabel;
        }

        if(isset($this->fieldModel->getExtra()['defaultValue']) and isset($this->fieldModel->getExtra()['defaultValue']['urlLabel'])){
            return $this->fieldModel->getExtra()['defaultValue']['urlLabel'];
        }

        return (isset($this->fieldModel->getExtra()['labelDefaultValue'])) ? $this->fieldModel->getExtra()['labelDefaultValue'] : '';
    }

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
