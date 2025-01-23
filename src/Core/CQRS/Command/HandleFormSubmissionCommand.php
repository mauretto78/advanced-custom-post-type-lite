<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\FormAction;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\TaxonomyField;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Core\Models\Form\FormSubmissionModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\ValueObjects\FormSubmissionDatumObject;
use ACPT_Lite\Core\ValueObjects\FormSubmissionErrorObject;
use ACPT_Lite\Utils\Checker\ValidationRulesChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\PhpEval;
use ACPT_Lite\Utils\Settings\Settings;
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
	 * HandleFormSubmissionCommand constructor.
	 *
	 * @param FormModel $formModel
	 * @param null $postId
	 * @param null $termId
	 * @param null $userId
	 * @param array $data
	 * @param array $files
	 */
	public function __construct(
		FormModel $formModel,
		$postId = null,
		$termId = null,
		$userId = null,
		array $data = [],
		array $files = []
	)
	{
		$this->formModel = $formModel;
		$this->data = $this->sanitizeData($data, $files);
		$this->postId = $postId;
		$this->termId = $termId;
		$this->userId = $userId;

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

				if(isset($files[$fieldModel->getName()])){

					$rawFile = $files[$fieldModel->getName()];

					if(!empty($rawFile) and !empty($rawFile['tmp_name'])){

						// gallery field
						if(is_array($rawFile['tmp_name'])){

							$urls = [];
							$ids = [];

							foreach ($rawFile['tmp_name'] as $index => $tmpFile){
								if(!empty($tmpFile)){

									$this->checkFileSize($rawFile['size'][$index], $fieldModel);
									$file = Files::uploadFile($tmpFile, $rawFile['name'][$index]);

									if($file === false){
										$this->errors[$fieldModel->getId()][] = "File upload failed";
									}

									$urls[] = $file['url'];
									$ids[] = $file['attachmentId'];
								}
							}

							$value = $urls;
							$extra['attachment_id'] = implode(",", $ids);

						} else {
							if(!empty($rawFile['tmp_name'])){

								$this->checkFileSize($rawFile['size'], $fieldModel);
								$file = Files::uploadFile($rawFile['tmp_name'], $rawFile['name']);

								if($file === false){
									$this->errors[$fieldModel->getId()][] = "File upload failed";
								}

								$value = $file['url'];
								$extra['attachment_id'] = $file['attachmentId'];
							}
						}
					}
				}

			} else {
				if(isset($data[$fieldModel->getName()])){
					$rawData = $data[$fieldModel->getName()];
					$value = Sanitizer::sanitizeRawData($type, $rawData);
				}
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

		// turnstile
		if(isset($data['cf-turnstile-response'])){
			$sanitized['cf-turnstile-response'] = [
				'type' => FormFieldModel::TURNSTILE_TYPE,
				'value' => Sanitizer::sanitizeRawData(FormFieldModel::TURNSTILE_TYPE, $data['cf-turnstile-response']),
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
			FormFieldModel::WORDPRESS_POST_THUMBNAIL,
			FormFieldModel::FILE_TYPE,
			MetaFieldModel::IMAGE_TYPE,
			MetaFieldModel::VIDEO_TYPE,
			MetaFieldModel::GALLERY_TYPE,
		];

		return in_array($type, $fileTypes);
	}

	/**
	 * @param $size
	 * @param FormFieldModel $fieldModel
	 *
	 * @return bool
	 */
	private function checkFileSize($size, FormFieldModel $fieldModel)
	{
		foreach ($fieldModel->getValidationRules() as $rule){

			switch ($rule->getCondition()){
				case ValidationRuleModel::MAX_SIZE:
					if($size > Strings::convertToBytes($rule->getValue())){
						$this->errors[$fieldModel->getId()][] = str_replace("{{v}}", $rule->getValue(), $rule->getMessage());
					}
					break;

				case ValidationRuleModel::MIN_SIZE:
					if($size < Strings::convertToBytes($rule->getValue())){
						$this->errors[$fieldModel->getId()][] = str_replace("{{v}}", $rule->getValue(), $rule->getMessage());
					}
			}
		}
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
		unset($this->data['cf-turnstile-response']);

		if($this->isValid()){
			$this->validate();
		}

		if($this->isValid()){
			$this->doAction();
			$this->saveFormSubmission();
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
	 * @see https://suleymanozcan.medium.com/how-to-use-cloudflare-turnstile-with-vanilla-php-e409e5addb14
	 * @see https://codeforgeek.com/google-recaptcha-tutorial/
	 * @throws \Exception
	 */
	private function checkCaptcha()
	{
		foreach ($this->formModel->getFields() as $fieldModel){

			switch ($fieldModel->getType()){

				// Google ReCaptcha
				case FormFieldModel::CAPTCHA_TYPE:

					$googleRecaptchaSiteKey = (isset($fieldModel->getExtra()['googleSiteKey']) and !empty($fieldModel->getExtra()['googleSiteKey'])) ? $fieldModel->getExtra()['googleSiteKey'] :  (Settings::get(SettingsModel::GOOGLE_RECAPTCHA_SITE_KEY));
					$googleRecaptchaSecretKey = (isset($fieldModel->getExtra()['googleSecretKey']) and !empty($fieldModel->getExtra()['googleSecretKey'])) ? $fieldModel->getExtra()['googleSecretKey'] : (Settings::get(SettingsModel::GOOGLE_RECAPTCHA_SECRET_KEY));

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

				// Cloudflare turnstile
				case FormFieldModel::TURNSTILE_TYPE:

					$cloudflareTurnstileSiteKey = (isset($fieldModel->getExtra()['turnstileSiteKey']) and !empty($fieldModel->getExtra()['turnstileSiteKey'])) ? $fieldModel->getExtra()['turnstileSiteKey'] :  (Settings::get(SettingsModel::CLOUDFLARE_TURNSTILE_SITE_KEY));
					$cloudflareTurnstileSecretKey = (isset($fieldModel->getExtra()['turnstileSecretKey']) and !empty($fieldModel->getExtra()['turnstileSecretKey'])) ? $fieldModel->getExtra()['turnstileSecretKey'] : (Settings::get(SettingsModel::CLOUDFLARE_TURNSTILE_SECRET_KEY));

					if(empty($cloudflareTurnstileSiteKey) or empty($cloudflareTurnstileSecretKey)){
						$this->errors[$fieldModel->getId()][] = 'Cloudflare Turnstile key and secret are not set';

						return;
					}

					if(!isset($this->data['cf-turnstile-response'])){
						$this->errors[$fieldModel->getId()][] = 'Cloudflare Turnstile response not found';

						return;
					}

					$secretKey         = $cloudflareTurnstileSecretKey;
					$turnstileResponse = $this->data['cf-turnstile-response']['value'];
					$url               = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
					$post_fields       = "secret=$secretKey&response=$turnstileResponse";

					$ch = curl_init($url);
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					curl_setopt($ch, CURLOPT_POST, true);
					curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
					$response = curl_exec($ch);
					curl_close($ch);

					$responseData = json_decode($response);

					if ($responseData->success != 1) {
						$this->errors[$fieldModel->getId()][] = 'Cloudflare Turnstile validation failed';
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

			$value = array_filter($this->data, function ($item) use($fieldModel){
				return $fieldModel->getName() === $item['name'];
			});

			if(empty($value)){
				return;
			}

			$value = array_values($value)[0]['value'];

			if(
				$fieldModel->isRequired() and
				$fieldModel->isTextualField() and
				empty($value)
			){
				$this->errors[$fieldModel->getId()][] = "The field is required";
			}

			if(!empty($fieldModel->getValidationRules())){
				if($fieldModel->isTextualField()){
					$validationRulesChecker = new ValidationRulesChecker($value, $fieldModel->getValidationRules());
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

		if($this->postId !== null){
			$locationItem = (int)$this->postId;
		} elseif($this->termId !== null){
			$locationItem = (int)$this->termId;
		} elseif($this->userId !== null){
			$locationItem = (int)$this->userId;
		}

		// update is not always allowed
		if($locationItem > 0){

			if($locationBelong === MetaTypes::CUSTOM_POST_TYPE){

				if(empty(get_post($locationItem))){
					$this->errors[$this->formModel->getId()] = 'Page object is empty';

					return;
				}

				$postType = get_post_type($locationItem);

				if($locationFind !== $postType){
					$this->errors[$this->formModel->getId()] = 'This page does not belongs to ' . $locationFind;

					return;
				}
			}

			if($locationBelong === MetaTypes::TAXONOMY){
				if(!get_term($locationItem) instanceof \WP_Term){
					$this->errors[$this->formModel->getId()] = 'Term object is empty';

					return;
				}
			}
		}

		$postThumbnailId = null;
		$postDataArray = [];
		$termDataArray = [];
		$userDataArray = [];

		if($locationBelong === MetaTypes::CUSTOM_POST_TYPE){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : get_post()->ID;
            $postDataArray['ID'] = $locationItem;
		}

		if($locationBelong === MetaTypes::TAXONOMY){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : get_queried_object()->term_id;
            $termDataArray['ID'] = $locationItem;
		}

		if($locationBelong === MetaTypes::USER){
			$locationItem = ($locationItem !== null and $locationItem !== '') ? (int)$locationItem : wp_get_current_user()->ID;
            $userDataArray['ID'] = $locationItem;
		}

		foreach ($this->data as $datum){
			if($datum['isPost']){
				$postDataArray = array_merge($postDataArray, $this->addPostData($datum));

				// thumbnail ID
				if($datum['type'] === FormFieldModel::WORDPRESS_POST_THUMBNAIL and isset($datum['extra']['attachment_id'])){
					$postThumbnailId = $datum['extra']['attachment_id'];
				}
			}

			if($datum['isTerm']){
				$termDataArray = array_merge($termDataArray, $this->addTermData($datum));
			}

			if($datum['isUser']){
				$userDataArray = array_merge($userDataArray, $this->addUserData($datum));
			}
		}

		// save posts
		if(!empty($postDataArray) and $locationItem !== null and $locationFind !== null){
			$postDataArray['post_type'] = $locationFind;
			$locationItem = $this->savePost($postDataArray);

			if($locationItem == 0 or $locationItem instanceof \WP_Error){
                $this->errors[$this->formModel->getId()][] = "There was an error during the saving of " . $locationFind . " post";
            }

			// save thumbnail
			if($postThumbnailId !== null and is_numeric($locationItem) and $locationItem != 0){
				set_post_thumbnail( (int)$locationItem, (int)$postThumbnailId );
			}
		}

		// save terms
		if(!empty($termDataArray) and $locationItem !== null and $locationFind !== null){
			if(isset($termDataArray['name'])){
				$locationItem = $this->saveTerm($locationFind, $termDataArray);

                if($locationItem == 0 or $locationItem instanceof \WP_Error){
                    $this->errors[$this->formModel->getId()][] = "There was an error during the saving of " . $locationFind . " term";
                }
			}
		}

		// save users
		if(!empty($userDataArray) and $locationItem !== null){
			$locationItem = $this->saveUser($userDataArray);

            if($locationItem == 0 or $locationItem instanceof \WP_Error){
                $this->errors[$this->formModel->getId()][] = "There was an error during the saving of the user";
            }
		}

		foreach ($this->data as $datum){
			if($datum['isMeta'] and !empty($locationItem)){
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

				case FormFieldModel::WORDPRESS_POST_TAXONOMIES:

					// handle saving single or multiple terms
					if(is_array($datum['value'])){

						$taxInputValue = [];

						foreach ($datum['value'] as $item){
							$value = explode(TaxonomyField::SEPARATOR, $item);

							if(count($value) === 2){
								$taxonomy = (string)$value[0];
								$termId = (int)$value[1];

								if(!isset($taxInputValue[$taxonomy])){
									$taxInputValue[$taxonomy] = [];
								}

								$taxInputValue[$taxonomy][] = $termId;
							}
						}

					} else {
						$value = explode(TaxonomyField::SEPARATOR, $datum['value']);

						if(count($value) === 2){
							$taxonomy = (string)$value[0];
							$termId = (int)$value[1];

							$taxInputValue = [
								$taxonomy => [$termId]
							];
						}
					}

					if(!empty($taxInputValue)){
						return [
							'tax_input' => $taxInputValue,
						];
					}
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

				case FormFieldModel::WORDPRESS_USER_BIO:
					return [
						'description' => $datum['value'],
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

		// if no title is provided, create one
		if(!isset($data['post_title'])){
            $data['post_title'] = 'No title';
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

		// check if the value is different than the saved one
		$savedValue = Meta::fetch($elementId, $locationBelong, $datum['name']);
		$newValue = Sanitizer::sanitizeRawData($datum['type'], $datum['value']);

		if($savedValue === $newValue){
			return;
		}

        if($datum['type'] === MetaFieldModel::PASSWORD_TYPE and isset($datum['extra']['id'])){
            $fieldId = $datum['extra']['id'];

            try {
                $fieldModel = MetaRepository::getMetaFieldById($fieldId);
                $algo = $fieldModel->getAdvancedOption("algorithm") ?? PASSWORD_DEFAULT;

                switch ($algo){
                    default:
                    case "PASSWORD_DEFAULT":
                        $newValue = password_hash($newValue, PASSWORD_DEFAULT);
                        break;
                    case "PASSWORD_BCRYPT":
                        $newValue = password_hash($newValue, PASSWORD_BCRYPT);
                        break;
                    case "PASSWORD_ARGON2I":
                        $newValue = password_hash($newValue, PASSWORD_ARGON2I);
                        break;
                    case "PASSWORD_ARGON2ID":
                        $newValue = password_hash($newValue, PASSWORD_ARGON2ID);
                        break;
                }
            } catch (\Exception $exception){}
        }

		if(
			Meta::save(
				$elementId,
				$locationBelong,
				$datum['name'],
				$newValue
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

	/**
	 * Save form submission
	 */
	private function saveFormSubmission()
	{
		$currentUser = wp_get_current_user();

		try {
			$formSubmission = FormSubmissionModel::hydrateFromArray([
				'formId' => $this->formModel->getId(),
				'action' => $this->formModel->getAction(),
				'callback' => $this->saveFormSubmissionCallback(),
				'uid' => ($currentUser->ID > 0 ? $currentUser->ID : null),
			]);

			foreach ($this->data as $datum){
				if(
					isset($datum['name']) and
					isset($datum['type']) and
					isset($datum['value'])
				){
					$datumObject = new FormSubmissionDatumObject($datum['name'], $datum['type'], $datum['value']);
					$formSubmission->addDatum($datumObject);
				}
			}

			if(!empty($this->errors)){
				foreach($this->errors as $id => $err){
					if(is_array($err)){
						foreach ($err as $key => $errorMessage){
							if(is_string($errorMessage)){
								$error = new FormSubmissionErrorObject($id, $errorMessage);
								$formSubmission->addError($error);
							}
						}
					} elseif(is_string($err)) {
						$error = new FormSubmissionErrorObject($id, $err);
						$formSubmission->addError($error);
					}
				}
			}

			FormRepository::saveSubmission($formSubmission);
		} catch (\Exception $exception){
			$this->errors[$this->formModel->getId()][] = "Save form submission error: " . $exception->getMessage();
		}
	}

	/**
	 * @return string
	 */
	private function saveFormSubmissionCallback()
	{
		switch ($this->formModel->getAction()){
			case FormAction::AJAX:
				if($this->formModel->getMetaDatum('ajax_action') === null){
					return null;
				}

				return $this->formModel->getMetaDatum('ajax_action')->getValue();

			case FormAction::CUSTOM:
				if($this->formModel->getMetaDatum('custom_action') === null){
					return null;
				}

				return $this->formModel->getMetaDatum('custom_action')->getValue();

			case FormAction::PHP:
				if($this->formModel->getMetaDatum('php_action') === null){
					return null;
				}

				return $this->formModel->getMetaDatum('php_action')->getValue();

			case FormAction::FILL_META:

				if(!empty($this->postId)){
					return 'Updating Post with ID#'.$this->postId;
				}

				if(!empty($this->termId)){
					return 'Updating Term with ID#'.$this->termId;
				}

				if(!empty($this->userId)){
					return 'Updating User with ID#'.$this->userId;
				}

				$locationFind = ( $this->formModel->getMetaDatum('fill_meta_location_find') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_find')->getValue() : null; // ---> holiday
				$locationBelong = ( $this->formModel->getMetaDatum('fill_meta_location_belong') !== null) ? $this->formModel->getMetaDatum('fill_meta_location_belong')->getValue() : null; // ---> customPostType

				if($locationBelong === MetaTypes::CUSTOM_POST_TYPE){
					return 'Creating new '.$locationFind.' post';
				}

				if($locationBelong === MetaTypes::TAXONOMY){
					return 'Creating new '.$locationFind.' term';
				}

				if($locationBelong === MetaTypes::USER){
					return 'Creating new User';
				}

				return '';
		}

		return '';
	}
}