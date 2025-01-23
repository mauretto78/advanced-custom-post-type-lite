<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Core\Generators\Meta\AfterAndBeforeFieldGenerator;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;

class TextareaField extends AbstractField
{
	protected $wysiwyg = false;

	/**
	 * @var int
	 */
	protected $cols;

	/**
	 * @var int
	 */
	protected $rows;

	/**
	 * TextareaField constructor.
	 *
	 * @param FormModel $formModel
	 * @param FormFieldModel $fieldModel
	 * @param null $postId
	 * @param null $termId
	 * @param null $userId
	 */
	public function __construct( FormModel $formModel, FormFieldModel $fieldModel, $postId = null, $termId = null, $userId = null)
	{
		parent::__construct( $formModel, $fieldModel, $postId, $termId, $userId );
		$this->wysiwyg = (!empty($this->fieldModel->getExtra()['wysiwyg'])) ? $this->fieldModel->getExtra()['wysiwyg'] : false;
		$this->rows = (!empty($this->fieldModel->getExtra()['rows'])) ? $this->fieldModel->getExtra()['rows'] : 6;
		$this->cols = (!empty($this->fieldModel->getExtra()['cols'])) ? $this->fieldModel->getExtra()['cols'] : 30;
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		$defaultValue = $this->defaultValue();

		// render Quill editor
		if($this->wysiwyg){
			return '
				<input 
					type="hidden" 
					value="'.htmlspecialchars($defaultValue).'" 
					name="'.esc_attr($this->getIdName()).'"
					id="'.esc_attr($this->getIdName()).'_hidden"
				/>
				<div class="acpt-quill" id="'.esc_attr($this->getIdName()).'">
					'.$defaultValue.'
				</div>
			';
		}

		$field = "
			<textarea
				id='".esc_attr($this->getIdName())."'
				name='".esc_attr($this->getIdName())."'
				placeholder='".$this->placeholder()."'
				class='".esc_attr($this->cssClass())."'
				rows='".$this->rows."'
				cols='".$this->cols."'
				".$this->required()."
				".$this->appendDataValidateAttributes()."
			>".htmlspecialchars($defaultValue)."</textarea>";

		if($this->fieldModel->getMetaField() !== null){
			return (new AfterAndBeforeFieldGenerator())->generate($this->fieldModel->getMetaField(), $field);
		}

		return $field;
	}

	/**
	 * @inheritDoc
	 */
	public function enqueueFieldAssets()
	{
		if($this->wysiwyg){
			wp_enqueue_script( 'quill-js', plugins_url( 'advanced-custom-post-type/assets/vendor/quill/quill.min.js'), [], '3.1.0', true);
			wp_enqueue_style( 'quill-css', plugins_url( 'advanced-custom-post-type/assets/vendor/quill/quill.snow.css'), [], '3.1.0', 'all');
		}
	}
}
