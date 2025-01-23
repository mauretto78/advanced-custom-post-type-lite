<?php

namespace ACPT_Lite\Core\Generators\Form;

use ACPT_Lite\Constants\FormAction;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\HandleFormSubmissionCommand;
use ACPT_Lite\Core\Generators\Form\Fields\AbstractField;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\Wordpress\Nonce;

class FormGenerator
{
	const SUCCESS_SESSION_KEY = 'acpt_form_success';
	const ERRORS_SESSION_KEY = 'acpt_form_errors';

	/**
	 * @var FormModel
	 */
	private $formModel;

	/**
	 * @var null
	 */
	private $postId;

	/**
	 * @var null
	 */
	private $userId;

	/**
	 * @var null
	 */
	private $termId;

	/**
	 * FormGenerator constructor.
	 *
	 * @param FormModel $formModel
	 * @param null $postId
	 * @param null $termId
	 * @param null $userId
	 */
	public function __construct(FormModel $formModel, $postId = null, $termId = null, $userId = null)
	{
		$this->formModel = $formModel;
		$this->postId    = $postId;
		$this->userId    = $userId;
		$this->termId    = $termId;

		$locationBelong = ( $formModel->getMetaDatum('fill_meta_location_belong') !== null) ? $formModel->getMetaDatum('fill_meta_location_belong')->getValue() : null; // ---> customPostType
		$locationItem = ( $formModel->getMetaDatum('fill_meta_location_item') !== null) ? $formModel->getMetaDatum('fill_meta_location_item')->getValue() : null;

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
	public function render()
	{
		ob_start();
		Session::start();

		if(isset($_POST['acpt_form_submission']) and $_POST['acpt_form_submission'] == 1){

			$redirectTo = $_POST['_wp_http_referer'];

			unset($_POST['acpt_form_submission']);
			unset($_POST['acpt_form_id']);
			unset($_POST['_wp_http_referer']);

			$command = new HandleFormSubmissionCommand($this->formModel, $this->postId, $this->termId, $this->userId, $_POST, $_FILES);
			$submission = $command->execute();

			if($submission['success']){
				$outcomeMessage = ($this->formModel->getMetaDatum('outcome_message') !== null) ? $this->formModel->getMetaDatum('outcome_message')->getValue() : "The form was successfully submitted";
				Session::set(self::SUCCESS_SESSION_KEY, [$outcomeMessage]);
			} else {
				Session::set(self::ERRORS_SESSION_KEY, $submission['errors']);
			}

			$this->safeRedirect($redirectTo);
		}

		$this->enqueueAssets();

		$form = $this->showGenericFormErrors();
		$form .= $this->renderOpeningFormTag();
		$form .= Nonce::field($this->formModel->getId());
		$form .= '<input type="hidden" name="acpt_form_submission" value="1" />';
		$form .= '<input type="hidden" name="acpt_form_id" value="'.$this->formModel->getId().'" />';
		$form .= '<input type="hidden" name="redirect_to" value="'.$this->formModel->getId().'" />';
		$form .= '<div class="acpt-form">';
		$form .= '<div class="acpt-container">';

		foreach ($this->formModel->getFields() as $field){
			$form .= $this->renderField($field);
		}

		$form .= '</div>';
		$form .= '</div>';
		$form .= '</form>';

		$this->flushSession();

		ob_end_clean();

		return $form;
	}

	/**
	 * @param $redirectTo
	 */
	private function safeRedirect($redirectTo)
	{
		wp_safe_redirect( esc_url(site_url($redirectTo)) );

		exit();
	}

	/**
	 * Display general errors and success messages
	 *
	 * @return string
	 */
	private function showGenericFormErrors()
	{
		$messages = '<div class="acpt-form-messages">';

		if(Session::has(self::SUCCESS_SESSION_KEY)){
			foreach (Session::get(self::SUCCESS_SESSION_KEY) as $successMessage){
				$messages .= '<div class="acpt-message acpt-success-message">' .$successMessage. '</div>';
			}
		}

		if(Session::has(self::ERRORS_SESSION_KEY)){
			foreach (Session::get(self::ERRORS_SESSION_KEY) as $id => $errorMessages){
				if($id === $this->formModel->getId()){
					if(is_array($errorMessages)){
						foreach ($errorMessages as $errorMessage){
							$messages .= '<div id="'.$id.'" class="acpt-message acpt-error-message">' .$errorMessage. '</div>';
						}
					}
				}
			}
		}

		$messages .= '</div>';

		return $messages;
	}

	/**
	 * Flush the session
	 */
	private function flushSession()
	{
		Session::flush(self::SUCCESS_SESSION_KEY);
		Session::flush(self::ERRORS_SESSION_KEY);
	}

	/**
	 * @return string
	 */
	private function renderOpeningFormTag()
	{
		switch ($this->formModel->getAction()){
			case FormAction::FILL_META:
			case FormAction::PHP:
				return '<form id="'.$this->formModel->getKey().'" action="" method="post" enctype="multipart/form-data">';

			case FormAction::CUSTOM:
				$action = $this->formModel->getMetaDatum('custom_action') !== null ? $this->formModel->getMetaDatum('custom_action')->getValue() : '';
				$method = $this->formModel->getMetaDatum('custom_method') !== null ? $this->formModel->getMetaDatum('custom_method')->getValue() :  'POST';

				return '<form id="'.$this->formModel->getKey().'" data-acpt-custom-form action="'.$action.'" method="'.$method.'" enctype="multipart/form-data">';

			case FormAction::AJAX:
				return '<form id="'.$this->formModel->getKey().'" data-acpt-ajax-form action="">';
		}
	}

	/**
	 * @param FormFieldModel $fieldModel
	 *
	 * @return string
	 * @throws \Exception
	 */
	private function renderField(FormFieldModel $fieldModel)
	{
		$class = 'ACPT\\Core\\Generators\\Form\\Fields\\'.$fieldModel->getType().'Field';

		if(class_exists($class)){
			/** @var AbstractField $field */
			$field = new $class($this->formModel, $fieldModel, $this->postId, $this->termId, $this->userId);

			return $field->renderElement();
		}
	}

	/**
	 * Enqueue necessary assets
	 *
	 * @param null $action
	 */
	private function enqueueAssets($action = null)
	{
		wp_register_style( 'front-end-css', plugins_url( 'advanced-custom-post-type/assets/static/css/front-end.css'), [], ACPT_PLUGIN_VERSION );
		wp_enqueue_style( 'front-end-css' );

		wp_register_script('front-end-js',  plugins_url( 'advanced-custom-post-type/assets/static/js/front-end.js') );
		wp_enqueue_script('front-end-js');

		wp_scripts()->add_data('front-end-js', 'type', 'module');

		wp_register_script('ACPTFormValidator',  plugins_url( 'advanced-custom-post-type/assets/static/js/ACPTFormValidator.js') );
		wp_enqueue_script('ACPTFormValidator');

		wp_register_script( 'ACPTFormValidator-run', '', [], '', true );
		wp_enqueue_script('ACPTFormValidator-run');
		wp_add_inline_script( 'ACPTFormValidator-run', '
				const validator = new ACPTFormValidator("'.$action.'");
				validator.run();
			');

		// Custom action form handling
		if($this->formModel->getAction() === FormAction::CUSTOM){

			wp_register_script( 'custom-form-handling', '', [], '', true );
			wp_enqueue_script('custom-form-handling');
			wp_add_inline_script( 'custom-form-handling', '
					 '.$this->wpAjaxRequest().'
				
					// Custom form submission
					const forms = document.body.querySelectorAll("[data-acpt-custom-form]");
					forms.forEach((form) => {
						form.addEventListener("submit", (e) => {
							e.preventDefault();
							e.stopPropagation();
							
							const formData = new FormData(e.target);
							const dataObject = Object.fromEntries(formData.entries());
							
							// save form submission
							wpAjaxRequest("saveFormSubmissionAction", dataObject);
							
							form.submit();
						});
					});
				');
		}

		// Ajax form handling
		if($this->formModel->getAction() === FormAction::AJAX){

			$ajaxAction = $this->formModel->getMetaDatum("ajax_action") !== null ? $this->formModel->getMetaDatum("ajax_action")->getValue() : null;
			$ajaxHandling = $this->formModel->getMetaDatum("ajax_handling") !== null ? $this->formModel->getMetaDatum("ajax_handling")->getValue() : null;

			if($ajaxAction !== null and $ajaxHandling !== null){
				wp_register_script( 'ajax-form-handling', '', [], '', true );
				wp_enqueue_script('ajax-form-handling');
				wp_add_inline_script( 'ajax-form-handling', '
					 '.$this->wpAjaxRequest().'
				
					// AJAX form submission
					const forms = document.body.querySelectorAll("[data-acpt-ajax-form]");
					forms.forEach((form) => {
						form.addEventListener("submit", (e) => {
							e.preventDefault();
							e.stopPropagation();
							
							const formData = new FormData(e.target);
							const dataObject = Object.fromEntries(formData.entries());
							
							// save form submission
							wpAjaxRequest("saveFormSubmissionAction", dataObject);
							
							// call custom AJAX route
							wpAjaxRequest("'.$ajaxAction.'", dataObject)
				                .then(data => {
				                    '.$ajaxHandling.'
				                })
				            ;
						});
					});
				');
			}
		}
	}

	/**
	 * @return string
	 */
	private function wpAjaxRequest()
	{
		return '
			/**
		     *
		     * @param action
		     * @param data
		     * @return {Promise<any>}
		     */
		    const wpAjaxRequest = async (action, data) => {
		
		        let formData;
		        formData = (data instanceof FormData) ? data : new FormData();
		        formData.append("action", action);
		        formData.append("data", JSON.stringify(data));
		
		        const baseAjaxUrl = (typeof ajaxurl === "string") ? ajaxurl : "/wp-admin/admin-ajax.php";
		
		        let response = await fetch(baseAjaxUrl, {
		            method: "POST",
		            body: formData
		        });
		
		        return await response.json();
		    };
		';
	}
}