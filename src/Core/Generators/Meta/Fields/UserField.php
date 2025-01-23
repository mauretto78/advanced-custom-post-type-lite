<?php

namespace ACPT_Lite\Core\Generators\Meta\Fields;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Wordpress\Translator;
use ACPT_Lite\Utils\Wordpress\Users;

class UserField extends AbstractField
{
	public function render()
	{
		$layout = $this->getAdvancedOption('layout');

		if($this->isChild() or $this->isNestedInABlock()){
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'[type]" value="'.MetaFieldModel::USER_TYPE.'">';
			$field .= '<input type="hidden" name="'. esc_attr($this->getIdName()).'[original_name]" value="'.$this->metaField->getName().'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'[value]" name="'. esc_attr($this->getIdName()).'[value]" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 acpt-admin-meta-field-input">';
		} else {
			$field = '<input type="hidden" name="'. esc_attr($this->getIdName()).'_type" value="'.MetaFieldModel::USER_TYPE.'">';
			$field .= '<select '.$this->required().' id="'.esc_attr($this->getIdName()).'" name="'. esc_attr($this->getIdName()).'" '.$this->appendDataValidateAndLogicAttributes() . ' class="acpt-select2 regular-text">';
		}

		$field .= '<option value="">'.Translator::translate("--Select--").'</option>';

		foreach(self::userList() as $id => $user){
			$selected = ($id === (int)$this->getDefaultValue()) ? 'selected="selected"' : '';
			$image = ($layout === 'image') ? 'data-image="'.get_avatar_url($id, ['size' => '40']).'"' : null;
			$field .= '<option '.$image.' '.$selected.' value="'.$id.'">'.esc_html($user).'</option>';
		}

		$field .= '</select>';

		return $this->renderField($field);
	}

	/**
	 * @return array
	 */
	protected function userList()
	{
		$userQuery = [];

		if($this->getAdvancedOption('filter_role')){
			$userQuery['role'] = $this->getAdvancedOption('filter_role');
		}

		return Users::getList($userQuery);
	}
}