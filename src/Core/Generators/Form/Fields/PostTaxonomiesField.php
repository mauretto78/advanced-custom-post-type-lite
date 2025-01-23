<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Constants\TaxonomyField;
use ACPT_Lite\Utils\Wordpress\Terms;
use ACPT_Lite\Utils\Wordpress\Translator;

class PostTaxonomiesField extends AbstractField
{
	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$empty = (!empty($this->fieldModel->getExtra()['empty'])) ? $this->fieldModel->getExtra()['empty'] : false;
		$options = Terms::getForPostType($this->fieldModel->getFind());
		$isMulti = (!empty($this->fieldModel->getExtra()['isMulti'])) ? $this->fieldModel->getExtra()['isMulti'] : false;
		$name = esc_attr($this->getIdName());

		if($isMulti){
			$name = $name.'[]';
		}

		$field = "<select
			".($isMulti ? "multiple" : "")."
			id='".esc_attr($this->getIdName())."'
			name='".$name."'
			placeholder='".$this->placeholder()."'
			class='".$this->cssClass()."'
			".$this->required()."
		>";

		if($empty){
			$field .= '
				<option value="">
			        '.Translator::translate("Select").'
				</option>';
		}

		foreach ($options as $taxonomy => $terms){

			$savedTerms = [];
			$postId = $this->postId;

			if($postId === null and (is_single() or is_page())){
				$page = get_post();
				$postId = $page->ID;
			}

			if($postId !== null){
				foreach (get_the_terms($postId, $taxonomy) as $t){
					$savedTerms[] = $t->term_id;
				}
			}

			$field .= '<optgroup label="'.$taxonomy.'">';

			foreach ($terms as $id => $term){

				$realId = explode(TaxonomyField::SEPARATOR, $id);

				$field .= '
					<option
				        value="'.esc_attr($id).'"
				        '.(in_array($realId[1], $savedTerms) ? "selected" : "").'
			        >
				        '.esc_attr($term).'
					</option>';
			}

			$field .= '</optgroup>';
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
