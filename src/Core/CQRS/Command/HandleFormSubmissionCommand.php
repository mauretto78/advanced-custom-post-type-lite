<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\FormAction;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Repository\SettingsRepository;
use ACPT_Lite\Utils\Checker\ValidationRulesChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\PhpEval;
use ACPT_Lite\Utils\Wordpress\Files;
use ACPT_Lite\Utils\Wordpress\Nonce;

class HandleFormSubmissionCommand implements CommandInterface
{
	/**
	 * @var FormModel
	 */
	private FormModel $formModel;

	/**
	 * @var array
	 */
	private $data;

	/**
	 * @var array
	 */
	private $errors = [];

	/**
	 * HandleFormSubmissionCommand constructor.
	 *
	 * @param FormModel $formModel
	 * @param array $data
	 * @param array $files
	 */
	public function __construct(FormModel $formModel, array $data = [], array $files = [])
	{
		$this->formModel = $formModel;
		$this->data = $this->sanitizeData($data, $files);

		$this->checkTheNonce($data[$this->formModel->getId()]);

		// for PHP handling
		$_POST = $this->data;
	}

	/**
	 * @return array
	 */
	private function extra()
	{
		return [
			'id',
			'type',
			'label',
			'currency',
			'weight',
			'length',
			'lat',
			'lng',
		];
	}

	/**
	 * @param $data
	 * @param $files
	 *
	 * @return mixed
	 */
	private function sanitizeData(array $data = [], array $files = [])
	{
		$sanitized = [];

		foreach ($this->formModel->getFields() as $fieldModel){

			// file handling
			$type = $data[$fieldModel->getName().'_type'];
			$value = null;
			$extra = [];

			if($this->isAFileField($type)){

				$rawFile = $files[$fieldModel->getName()];

				if(!empty($rawFile) and !empty($rawFile['tmp_name'])){

					// gallery field
					if(is_array($rawFile['tmp_name'])){

						$urls = [];
						$ids = [];

						foreach ($rawFile['tmp_name'] as $index => $tmpFile){
							$file = Files::uploadFile($tmpFile, $rawFile['name'][$index]);

							if($file === false){
								$this->errors[$fieldModel->getId()][] = "File upload failed";
							}

							$urls[] = $file['url'];
							$ids[] = $file['attachmentId'];
						}

						$value = $urls;
						$extra['id'] = implode(",", $ids);

					} else {
						$file = Files::uploadFile($rawFile['tmp_name'], $rawFile['name']);

						if($file === false){
							$this->errors[$fieldModel->getId()][] = "File upload failed";
						}

						$value = $file['url'];
						$extra['id'] = $file['attachmentId'];
					}
				}

			} else {
				$rawData = $data[$fieldModel->getName()];
				$value = Sanitizer::sanitizeRawData($type, $rawData);
			}

			foreach ($this->extra() as $e){
				if(isset($data[$fieldModel->getName().'_'.$e])){
					$extra[$e] = $data[$fieldModel->getName().'_'.$e];
				}
			}

			$sanitized[] = [
				'id' => $fieldModel->getId(),
				'type' => $type,
				'value' => $value,
				'name' => $fieldModel->getName(),
				'required' => $fieldModel->isRequired(),
				'isMeta' => $fieldModel->isACPTMetaField(),
				'isPost' => $fieldModel->isWordPressPostField(),
				'isTerm' => $fieldModel->isWordPressTermField(),
				'isUser' => $fieldModel->isWordPressUserField(),
				'extra' => $extra,
			];
		}

		// captcha
		if(isset($data['g-recaptcha-response'])){
			$sanitized['g-recaptcha-response'] = [
				'type' => FormFieldModel::CAPTCHA_TYPE,
				'value' => Sanitizer::sanitizeRawData(FormFieldModel::CAPTCHA_TYPE, $data['g-recaptcha-response']),
			];
		}

		return $sanitized;
	}

	/**
	 * @param $type
	 *
	 * @return bool
	 */
	private function isAFileField($type): bool
	{
		$fileTypes = [
			FormFieldModel::FILE_TYPE,
			MetaFieldModel::IMAGE_TYPE,
			MetaFieldModel::VIDEO_TYPE,
			MetaFieldModel::GALLERY_TYPE,
		];

		return in_array($type, $fileTypes);
	}

	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		if($this->isValid()){
			$this->checkCaptcha();
		}

		unset($this->data['g-recaptcha-response']);

		if($this->isValid()){
			$this->validate();
		}

		if($this->isValid()){
			$this->doAction();
		}

		return [
			'success' => $this->isValid(),
			'errors' => $this->errors
		];
	}

	/**
	 * @return bool
	 */
	private function isValid()
	{
		return empty($this->errors);
	}

	/**
	 * Verify nonce value
	 *
	 * @param $nonce
	 */
	private function checkTheNonce($nonce)
	{
		if(!Nonce::verify($nonce)){
			$this->errors[$this->formModel->getId()][] = 'Nonce not valid';
		}
	}

	/**
	 * @see https://codeforgeek.com/google-recaptcha-tutorial/
	 * @throws \Exception
	 */
	private function checkCaptcha()
	{
		foreach ($this->formModel->getFields() as $fieldModel){
			if($fieldModel->getType() === FormFieldModel::CAPTCHA_TYPE){
				$googleRecaptchaSiteKey = (isset($fieldModel->getExtra()['googleSiteKey']) and !empty($fieldModel->getExtra()['googleSiteKey'])) ? $fieldModel->getExtra()['googleSiteKey'] :  (SettingsRepository::getSingle(SettingsModel::GOOGLE_RECAPTCHA_SITE_KEY))->getValue();
				$googleRecaptchaSecretKey = (isset($fieldModel->getExtra()['googleSecretKey']) and !empty($fieldModel->getExtra()['googleSecretKey'])) ? $fieldModel->getExtra()['googleSecretKey'] : (SettingsRepository::getSingle(SettingsModel::GOOGLE_RECAPTCHA_SECRET_KEY))->getValue();

				if(empty($googleRecaptchaSiteKey) or empty($googleRecaptchaSecretKey)){
					$this->errors[$fieldModel->getId()][] = 'ReCaptcha key and secret are not set';

					return;
				}

				if(!isset($this->data['g-recaptcha-response'])){
					$this->errors[$fieldModel->getId()][] = 'ReCaptcha response not found';

					return;
				}

				$secretKey = $googleRecaptchaSecretKey;
				$captcha = $this->data['g-recaptcha-response']['value'];

				$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
				$response = file_get_contents($url);
				$responseKeys = json_decode($response,true);

				if(!$responseKeys["success"]){
					$this->errors[$fieldModel->getId()][] = 'ReCaptcha validation failed';
				}

				return;
			}
		}
	}

	/**
	 * BE validation
	 */
	private function validate()
	{
		foreach ($this->formModel->getFields() as $fieldModel){
			if(!empty($fieldModel->getValidationRules())){
				$validationRulesChecker = new ValidationRulesChecker($this->data[$fieldModel->getName()], $fieldModel->getValidationRules());
				$validationRulesChecker->validate();

				if(!$validationRulesChecker->isValid()){

					$errors = [];

					foreach ($validationRulesChecker->getErrors() as $error){
						$errors[] = $error;
					}

					$this->errors[$fieldModel->getId()] = $errors;

					return;
				}
			}
		}
	}

	/**
	 * Executes the form action
	 */
	private function doAction()
	{
		switch ($this->formModel->getAction()){
			case FormAction::AJAX:
				// do nothing here
				break;

			case FormAction::PHP:
				$action = $this->formModel->getMetaDatum('php_action');

				if($action !== null){
					PhpEval::evaluate($action->getValue());
				}

				break;

			case FormAction::FILL_META:
				$this->handleFillMetaAction();
				break;
		}
	}

	/**
	 * Handle fill meta action
	 */
	private function handleFillMetaAction()
	{
		$locationFind = ( $this->formModel->getMetaDatum('fill_meta_location_find') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_find')->getValue() : null; // ---> holiday
		$locationBelong = ( $this->formModel->getMetaDatum('fill_meta_location_belong') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_belong')->getValue() : null; // ---> customPostType
		$locationItem = ( $this->formModel->getMetaDatum('fill_meta_location_item') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_item')->getValue() : null; // ---> create_new oppure un post id (19529) può essere null

		// update is not always allowed
		if($locationItem > 0){

			if($locationBelong === MetaTypes::CUSTOM_POST_TYPE){

				if(empty(get_post())){
					$this->errors[$this->formModel->getId()] = 'Page object is empty';

					return;
				}

				$postType = get_post_type(get_post()->ID);

				if($locationFind !== $postType){
					$this->errors[$this->formModel->getId()] = 'This page does not belongs to ' . $locationFind;

					return;
				}
			}

			if($locationBelong === MetaTypes::TAXONOMY){

				$queriedObject = get_queried_object();

				if(!$queriedObject instanceof \WP_Term){
					$this->errors[$this->formModel->getId()] = 'Term object is empty';

					return;
				}

				$tid = $queriedObject->term_id;
				// @TODO check term page here
			}
		}

		$postDataArray = [];
		$termDataArray = [];
		$userDataArray = [];

		if($locationBelong === MetaTypes::CUSTOM_POST_TYPE){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : get_post()->ID;
		}

		if($locationBelong === MetaTypes::TAXONOMY){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : get_queried_object()->term_id;
		}

		if($locationBelong === MetaTypes::USER){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : wp_get_current_user()->ID;
		}

		foreach ($this->data as $datum){
			if($datum['isPost']){
				$postDataArray = array_merge($postDataArray, $this->addPostData($datum));
			}

			if($datum['isTerm']){
				$termDataArray = array_merge($postDataArray, $this->addTermData($datum));
			}

			if($datum['isUser']){
				$userDataArray = array_merge($userDataArray, $this->addUserData($datum));
			}
		}

		if(!empty($postDataArray) and $locationItem !== null){
			$postDataArray['ID'] = $locationItem;
			$postDataArray['post_type'] = $locationFind;
			$locationItem = $this->savePost($postDataArray);
		}

		if(!empty($termDataArray) and $locationItem !== null){
			$termDataArray['ID'] = $locationItem;

			if(isset($termDataArray['name'])){
				$locationItem = $this->saveTerm($locationFind, $termDataArray);
			}
		}

		if(!empty($userDataArray) and $locationItem !== null){
			$userDataArray['ID'] = $locationItem;
			$locationItem = $this->saveUser($userDataArray);
		}

		foreach ($this->data as $datum){
			if($datum['isMeta']){
				$this->saveMetaData($datum, $locationFind, $locationBelong, $locationItem);
			}
		}
	}

	/**
	 * @param array $datum
	 *
	 * @return array
	 */
	private function addPostData($datum = [])
	{
		if(!empty($datum['value'])){
			switch ($datum['type']){
				case FormFieldModel::WORDPRESS_POST_TITLE:
					return [
						'post_title' => $datum['value']
					];

				case FormFieldModel::WORDPRESS_POST_CONTENT:
					return [
						'post_content' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_POST_EXCERPT:
					return [
						'post_excerpt' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_POST_AUTHOR:
					return [
						'post_author' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_POST_DATE:
					return [
						'post_date' => $datum['value'],
					];
			}
		}

		return [];
	}

	/**
	 * @param array $datum
	 *
	 * @return array
	 */
	private function addTermData($datum = [])
	{
		if(!empty($datum['value'])){
			switch ($datum['type']){
				case FormFieldModel::WORDPRESS_TERM_NAME:
					return [
						'name' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_TERM_DESCRIPTION:
					return [
						'description' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_TERM_SLUG:
					return [
						'slug' => $datum['value'],
					];
			}
		}

		return [];
	}

	/**
	 * @param array $datum
	 *
	 * @return array
	 */
	private function addUserData($datum = [])
	{
		if(!empty($datum['value'])){
			switch ($datum['type']){
				case FormFieldModel::WORDPRESS_USER_EMAIL:
					return [
						'user_email' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_USER_PASSWORD:
					return [
						'user_pass' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_USER_USERNAME:
					return [
						'user_login' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_USER_FIRST_NAME:
					return [
						'first_name' => $datum['value'],
					];

				case FormFieldModel::WORDPRESS_USER_LAST_NAME:
					return [
						'last_name' => $datum['value'],
					];
			}
		}
	}

	/**
	 * @param array $data
	 *
	 * @return int|\WP_Error
	 */
	private function savePost($data = [])
	{
		if($data['ID'] > 0){
			return wp_update_post($data);
		}

		return wp_insert_post($data);
	}

	/**
	 * @param array $data
	 *
	 * @return int|\WP_Error
	 */
	private function saveUser($data = [])
	{
		if($data['ID'] > 0){
			return wp_update_user($data);
		}

		if(!isset($data['user_login'])){
			if(isset($data['first_name'])){
				$data['user_login'] = Strings::generateUsername($data['first_name']);
			} else {
				$data['user_login'] = Strings::randomString();
			}
		}

		return wp_insert_user($data);
	}

	/**
	 * @param $taxonomy
	 * @param array $data
	 *
	 * @return mixed
	 */
	private function saveTerm($taxonomy, $data = [])
	{
		$array = [];

		if(isset($data['description'])){
			$array['description'] = $data['description'];
		}

		if(isset($data['slug'])){
			$array['slug'] = $data['slug'];
		}

		if($data['ID'] > 0){

			if(isset($data['name'])){
				$array['name'] = $data['name'];
			}

			$term = wp_update_term( $data['ID'], $taxonomy, $array);

			return $term['term_id'];
		}

		$term = wp_insert_term(
			$data['name'],
			$taxonomy,
			$array
		);

		return $term['term_id'];
	}

	/**
	 * @param array $datum
	 * @param null $locationFind
	 * @param null $locationBelong
	 * @param null $locationItem
	 */
	private function saveMetaData($datum = [], $locationFind = null, $locationBelong = null, $locationItem = null)
	{
		if(empty($datum['value'])){
			return;
		}

		// @TODO $datum['name'] is correct for OP ?
		$elementId = ($locationBelong === MetaTypes::OPTION_PAGE) ? $datum['name'] : $locationItem;

		if(
			Meta::save(
				$elementId,
				$locationBelong,
				$datum['name'],
				Sanitizer::sanitizeRawData($datum['type'], $datum['value'])
			) === false
		){
			$this->errors[$datum['id']] = "Error saving field " . $datum['name'];
		}

		foreach ($datum['extra'] as $key => $value){
			Meta::save(
				$elementId,
				$locationBelong,
				$datum['name'].'_'.$key,
				Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $value )
			);
		}
	}
}