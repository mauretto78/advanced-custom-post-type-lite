<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\Users;

class PostAuthorField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$empty = (!empty($this->fieldModel->getExtra()['empty'])) ? $this->fieldModel->getExtra()['empty'] : false;
		$value = $this->defaultValue();
		$users = Users::getList();

		$field = "<select
			id='".esc_attr($this->getIdName())."'
			name='".esc_attr($this->getIdName())."'
			placeholder='".$this->placeholder()."'
			class='".$this->cssClass()."'
			".$this->required()."
			".$this->appendDataValidateAttributes()."
		>";

		if($empty){
			$field .= '
				<option value="">
			        '.Translator::translate("Select").'
				</option>';
		}

		foreach ($users as $id => $user){
			$field .= '
				<option 
			        value="'.esc_attr($id).'"
			        '.($id == $value ? "selected" : "").'
		        >
			        '.esc_attr($user).'
				</option>';
		}

		$field .= '</select>';

		return $field;
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets() {
		// TODO: Implement enqueueFieldAssets() method.
	}
}
