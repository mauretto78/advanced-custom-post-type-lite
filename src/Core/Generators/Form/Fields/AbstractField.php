<?php

namespace ACPT_Lite\Core\Generators\Form\Fields;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Form\FormGenerator;
use ACPT_Lite\Core\Generators\Validation\DataValidateAttributes;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\Wordpress\Text;

abstract class AbstractField
{
	/**
	 * @var FormFieldModel
	 */
	protected FormFieldModel $fieldModel;

	/**
	 * @var FormModel
	 */
	protected FormModel $formModel;

	/**
	 * @var null
	 */
	protected $postId;

	/**
	 * @var null
	 */
	protected $userId;

	/**
	 * @var null
	 */
	protected $termId;

	/**
	 * AbstractField constructor.
	 *
	 * @param FormModel $formModel
	 * @param FormFieldModel $fieldModel
	 * @param null $postId
	 * @param null $termId
	 * @param null $userId
	 */
	public function __construct(FormModel $formModel, FormFieldModel $fieldModel, $postId = null, $termId = null, $userId = null)
	{
		$this->fieldModel = $fieldModel;
		$this->formModel = $formModel;
		$this->postId = $postId;
		$this->termId = $termId;
		$this->userId = $userId;

		$locationBelong = ( $this->formModel->getMetaDatum('fill_meta_location_belong') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_belong')->getValue() : null; // ---> customPostType
		$locationItem = ( $this->formModel->getMetaDatum('fill_meta_location_item') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_item')->getValue() : null;

		if($this->postId === null and $locationBelong === MetaTypes::CUSTOM_POST_TYPE){
			$this->postId = $locationItem;
		}

		if($this->termId === null and $locationBelong === MetaTypes::TAXONOMY){
			$this->termId = $locationItem;
		}

		if($this->userId === null and $locationBelong === MetaTypes::USER){
			$this->userId = $locationItem;
		}
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function renderElement()
	{
		$this->enqueueFieldAssets();

		$settings = $this->fieldModel->getSettings();
		$layout = isset($settings['layout']) ? $settings['layout'] : "block";
		$cols = isset($settings['cols']) ? $settings['cols'] : 12;
		$label = $this->fieldModel->getLabel();
		$description = $this->fieldModel->getDescription();
		$required = ($this->fieldModel->isRequired()) ? ' <span class="acpt-required">*</span>' : '';
		$element = "<div class='col-".$cols."'>";
		$element .= "<div id=".$this->fieldModel->getId()." class='actp-form-element actp-form-".$layout."'>";

		if(!empty($label)){
			$element .= '<label class="actp-form-label" for="'.esc_attr($this->getIdName()).'">'.$label.$required.'</label>';
		}

		$element .= "<input type='hidden' name='".esc_attr($this->getIdName())."_type' value='".$this->fieldModel->getType()."' />";

		if($this->fieldModel->getMetaField() !== null){
            $element .= "<input type='hidden' name='".esc_attr($this->getIdName())."_id' value='".$this->fieldModel->getMetaField()->getId()."' />";
        }

		$element .= $this->render();
		$element .= $this->renderErrors();

		if(!empty($description)){
			$element .= '<div id="'.esc_attr($this->getIdName()).'_description" class="acpt-form-description">'.$description.'</div>';
		}

		$element .= "</div>";
		$element .= "</div>";

		return $element;
	}

	/**
	 * @return string
	 */
	protected function required()
	{
		return ($this->fieldModel->isRequired()) ? 'required="required"' : '';
	}

	/**
	 * @return string
	 */
	protected function getIdName()
	{
		return $this->fieldModel->getName();
	}

	/**
	 * @return mixed|string
	 */
	protected function cssClass()
	{
		$base = (!empty($this->fieldModel->getSettings()['css'])) ? esc_attr($this->fieldModel->getSettings()['css']) : 'actp-form-control';

		if($this->hasErrors()){
			$base .= ' has-errors';
		}

		return $base;
	}

	/**
	 * @return string|null
	 */
	protected function placeholder()
	{
		return (!empty($this->fieldModel->getExtra()['placeholder'])) ? esc_attr($this->fieldModel->getExtra()['placeholder']) : null;
	}

	/**
	 * @return mixed|null
	 */
	protected function defaultValue()
	{
	    // is an ACPT field
		if($this->fieldModel->getMetaField()){

            $value = null;
			$belong = $this->fieldModel->getBelong();
			$find = $this->fieldModel->getFind();

			if($belong !== null and $belong === MetaTypes::OPTION_PAGE and $find !== null){
				$value = Meta::fetch($find, MetaTypes::OPTION_PAGE, $find.'_'.$this->fieldModel->getMetaField()->getDbName(), true);
			}

			if($this->postId){
				$value = Meta::fetch($this->postId, MetaTypes::CUSTOM_POST_TYPE, $this->fieldModel->getMetaField()->getDbName(), true);
			}

			if($this->termId){
				$value = Meta::fetch($this->termId, MetaTypes::TAXONOMY, $this->fieldModel->getMetaField()->getDbName(), true);
			}

			if($this->userId){
				$value = Meta::fetch($this->userId, MetaTypes::USER, $this->fieldModel->getMetaField()->getDbName(), true);
			}

            if($value === null and !empty($this->fieldModel->getExtra()['defaultValue'])){
                $value = $this->fieldModel->getExtra()['defaultValue'];
            }

            return $value;
		}

		return $this->WordPressFieldCurrentValue();
	}

    /**
     * @param $label
     * @return mixed|null
     */
    protected function defaultExtraValue($label)
    {
        if($this->fieldModel->getMetaField()){

            $belong = $this->fieldModel->getBelong();
            $find = $this->fieldModel->getFind();

            if($belong !== null and $belong === MetaTypes::OPTION_PAGE and $find !== null){
                return Meta::fetch($find, MetaTypes::OPTION_PAGE, $find.'_'.$this->fieldModel->getMetaField()->getDbName()."_".$label, true);
            }

            if($this->postId){
                return Meta::fetch($this->postId, MetaTypes::CUSTOM_POST_TYPE, $this->fieldModel->getMetaField()->getDbName()."_".$label, true);
            }

            if($this->termId){
                return Meta::fetch($this->termId, MetaTypes::TAXONOMY, $this->fieldModel->getMetaField()->getDbName()."_".$label, true);
            }

            if($this->userId){
                return Meta::fetch($this->userId, MetaTypes::USER, $this->fieldModel->getMetaField()->getDbName()."_".$label, true);
            }
        }

        return null;
    }

	/**
	 * This function fetches the current value of a WP field
	 * (ex. Post title, Post content, User email, etc...)
	 *
	 * @return mixed
	 */
	private function WordPressFieldCurrentValue()
	{
		// post field current value
		if(!empty($this->postId)){
			switch ($this->fieldModel->getType()){

				// WORDPRESS_POST_THUMBNAIL
				case FormFieldModel::WORDPRESS_POST_THUMBNAIL:
					return get_the_post_thumbnail_url($this->postId);

				// WORDPRESS_POST_TITLE
				case FormFieldModel::WORDPRESS_POST_TITLE:
					return get_the_title($this->postId);

				// WORDPRESS_POST_CONTENT
				case FormFieldModel::WORDPRESS_POST_CONTENT:
					return get_the_content(null, false, $this->postId);

				// WORDPRESS_POST_EXCERPT
				case FormFieldModel::WORDPRESS_POST_EXCERPT:
					return get_the_excerpt($this->postId);

				// WORDPRESS_POST_DATE
				case FormFieldModel::WORDPRESS_POST_DATE:
					return get_the_date('Y-m-d', $this->postId);

				// WORDPRESS_POST_AUTHOR
				case FormFieldModel::WORDPRESS_POST_AUTHOR:
					return get_post_field( 'post_author', $this->postId );
			}
		}

		if(!empty($this->termId)){
			$term = get_term( $this->termId );

			if($term instanceof \WP_Term){
				switch ($this->fieldModel->getType()){
					case FormFieldModel::WORDPRESS_TERM_NAME:
						return $term->name;

					case FormFieldModel::WORDPRESS_TERM_DESCRIPTION:
						return $term->description;

					case FormFieldModel::WORDPRESS_TERM_SLUG:
						return $term->slug;
				}
			}
		}

		// user field current value
		if(!empty($this->userId)){
			$userData = get_userdata( $this->userId );

			if($userData){
				switch ($this->fieldModel->getType()){

					// WORDPRESS_USER_EMAIL
					case FormFieldModel::WORDPRESS_USER_EMAIL:
						return $userData->user_email;

					// WORDPRESS_USER_FIRST_NAME
					case FormFieldModel::WORDPRESS_USER_FIRST_NAME:
						return $userData->first_name;

					// WORDPRESS_USER_LAST_NAME
					case FormFieldModel::WORDPRESS_USER_LAST_NAME:
						return $userData->last_name;

					// WORDPRESS_USER_USERNAME
					case FormFieldModel::WORDPRESS_USER_USERNAME:
						return $userData->display_name;

					// WORDPRESS_USER_BIO
					case FormFieldModel::WORDPRESS_USER_BIO:
						return $userData->description;
				}
			}
		}

		if(!empty($this->fieldModel->getExtra()['defaultValue'])){
			return esc_attr($this->fieldModel->getExtra()['defaultValue']);
		}

		return null;
	}

	/**
	 * @param $defaultValue
	 * @param $uom
	 * @param $options
	 *
	 * @return string
	 */
	protected function renderUom($defaultValue, $uom, $options)
	{
		$defaultValueUom = $defaultValue;
		$render = '<select 
				id="'.$this->getIdName().'_'.$uom.'"
				name="'.$this->getIdName().'_'.$uom.'"
				class="'.$this->cssClass().'"
			>';

		foreach ($options as $symbol => $data){
			$render .= '<option 
				value="'.esc_attr($symbol).'" 
				'.selected($symbol, $defaultValueUom, false).'
				data-symbol="'.esc_attr($data['symbol']).'" 
				data-placeholder="0.00" 
				>
					'.esc_html($symbol).'
				</option>';
		}

		$render .= '</select>';

		return $render;
	}

	/**
	 * @return string|null
	 */
	protected function appendDataValidateAttributes()
	{
		if($this->fieldModel->canFieldHaveValidationAndLogicRules()){
			return DataValidateAttributes::generate($this->fieldModel->getValidationRules(), $this->fieldModel->isTextualField(), $this->fieldModel->isRequired());
		}

		return null;
	}

	/**
	 * @return bool
	 */
	private function hasErrors()
	{
		if(Session::has(FormGenerator::ERRORS_SESSION_KEY)){
			return array_key_exists($this->fieldModel->getId(), Session::get(FormGenerator::ERRORS_SESSION_KEY));
		}

		return false;
	}

	/**
	 * @return string
	 */
	private function renderErrors()
	{
		$errorsList = '<ul class="acpt-error-list" id="acpt-error-list-'.$this->fieldModel->getName().'">';

		if(Session::has(FormGenerator::ERRORS_SESSION_KEY)){
			foreach (Session::get(FormGenerator::ERRORS_SESSION_KEY) as $id => $errors){
				if($id === $this->fieldModel->getId()) {
					if(is_array($errors)){
						foreach ($errors as $error){
							$errorsList .= '<li>'.$error.'</li>';
						}
					}
				}
			}
		}

		$errorsList .= '</ul>';

		return $errorsList;
	}

	/**
	 * @return string
	 */
	abstract public function render();

	/**
	 * @return mixed
	 */
	abstract public function enqueueFieldAssets();
}