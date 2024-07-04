<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\FormAction;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Utils\Wordpress\Users;

class FetchFormFieldsQuery implements QueryInterface
{
	/**
	 * @var
	 */
	private $id;

	/**
	 * @var FormModel|null
	 */
	private $formModel;

	/**
	 * FetchFormFieldsQuery constructor.
	 *
	 * @param $id
	 *
	 * @throws \Exception
	 */
	public function __construct($id)
	{
		$this->id = $id;
		$this->formModel = FormRepository::getById($this->id);
	}

	/**
	 * @return array|mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		return [
			'saved' => $this->savedFields(),
			'fields' => $this->availableFields(),
		];
	}

	/**
	 * @return array
	 */
	private function savedFields(): array
	{
		return $this->formModel->getFields();
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function availableFields(): array
	{
		return array_merge(
			$this->standardFields(),
			$this->WordPressPostFields(),
			$this->WordPressTaxonomyFields(),
			$this->WordPressUserFields(),
			$this->ACPTFields(),
		);
	}

	/**
	 * @return array
	 */
	private function standardFields(): array
	{
		if($this->formModel->getAction() === FormAction::FILL_META){
			return [
				[
					"id" => Uuid::v4(),
					"metaFieldId" => null,
					"group" => "Standard fields",
					"name" => "captcha",
					"label" => "label",
					"description" => null,
					"type" => FormFieldModel::CAPTCHA_TYPE,
					"isRequired" => true,
					"validation" => false,
					"isTextual" => false,
					"isReusable" => true,
					"extra" => [
						"defaultValue" => null,
						"placeholder" => null,
					],
				],
				[
					"id" => Uuid::v4(),
					"metaFieldId" => null,
					"group" => "Standard fields",
					"name" => "button",
					"label" => null,
					"description" => null,
					"type" => FormFieldModel::BUTTON_TYPE,
					"isRequired" => false,
					"validation" => false,
					"isTextual" => false,
					"isReusable" => true,
					"extra" => [
						"defaultValue" => null,
						"placeholder" => null,
						"type" => "submit",
						"label" => "Button"
					],
				],
			];
		}

		return [
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "text",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::TEXT_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => "placeholder"
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "email",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::EMAIL_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => "noreply@gmail.com"
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "number",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::NUMBER_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => 1,
					"min" => 1,
					"max" => 100,
					"step" => 1,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "phone",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::PHONE_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => "+44000000"
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "color",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::COLOR_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => "#202020",
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "country",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::COUNTRY_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "date",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::DATE_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => "2023-06-01"
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "url",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::URL_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => 'https://acpt.io'
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "range",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::RANGE_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => 50,
					"placeholder" => null,
					"min" => 1,
					"max" => 100,
					"step" => 1,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "checkbox",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::CHECKBOX_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"options" => [
						[
							"label" => "label",
							"value" => "value",
						],
						[
							"label" => "label",
							"value" => "value",
						]
					]
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "radio",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::RADIO_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"options" => [
						[
							"label" => "label",
							"value" => "value",
						],
						[
							"label" => "label",
							"value" => "value",
						]
					]
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "select",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::SELECT_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"isMulti" => false,
					"empty" => false,
					"options" => [
						[
							"id" => Uuid::v4(),
							"label" => "label",
							"value" => "value",
						],
						[
							"id" => Uuid::v4(),
							"label" => "label",
							"value" => "value",
						]
					]
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "textarea",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::TEXTAREA_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => "Textarea",
					"rows" => 6,
					"cols" => 30,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "file",
				"label" => "label",
				"description" => "description",
				"type" => FormFieldModel::FILE_TYPE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "hidden",
				"label" => null,
				"description" => null,
				"type" => FormFieldModel::HIDDEN_TYPE,
				"isRequired" => false,
				"validation" => false,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "captcha",
				"label" => "label",
				"description" => null,
				"type" => FormFieldModel::CAPTCHA_TYPE,
				"isRequired" => false,
				"validation" => false,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "Standard fields",
				"name" => "button",
				"label" => null,
				"description" => null,
				"type" => FormFieldModel::BUTTON_TYPE,
				"isRequired" => false,
				"validation" => false,
				"isTextual" => false,
				"isReusable" => true,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"type" => "submit",
					"label" => "Button"
				],
			],
		];
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function WordPressPostFields(): array
	{
		if($this->showWordPressPostFields() === false){
			return [];
		}

		$users = [];

		foreach(array_slice(Users::getList(),0,3) as $id => $user){
			$users[] = [
				"id" => Uuid::v4(),
				"label" => $user,
				"value" => $id,
			];
		}

		return [
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress post fields",
				"name" => "post-title",
				"label" => "Post title",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_POST_TITLE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress post fields",
				"name" => "post-content",
				"label" => "Post content",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_POST_CONTENT,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"wysiwyg" => false,
					"rows" => 6,
					"cols" => 30,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress post fields",
				"name" => "post-excerpt",
				"label" => "Post excerpt",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_POST_EXCERPT,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"rows" => 6,
					"cols" => 30,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress post fields",
				"name" => "post-date",
				"label" => "Post date",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_POST_DATE,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress post fields",
				"name" => "post-author",
				"label" => "Post author",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_POST_AUTHOR,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => false,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"empty" => false,
					"options" => $users
				],
			]
		];
	}

	/**
	 * @return bool
	 * @throws \Exception
	 */
	private function showWordPressPostFields(): bool
	{
		return $this->metaGroupBelongsTo(MetaTypes::CUSTOM_POST_TYPE);
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function WordPressUserFields(): array
	{
		if($this->showWordPressUserFields() === false){
			return [];
		}

		return [
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress user fields",
				"name" => "user-email",
				"label" => "User email",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_USER_EMAIL,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress user fields",
				"name" => "user-first-name",
				"label" => "User first name",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_USER_FIRST_NAME,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"rows" => 6,
					"cols" => 30,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress user fields",
				"name" => "user-last-name",
				"label" => "User last name",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_USER_LAST_NAME,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress user fields",
				"name" => "username",
				"label" => "Username",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_USER_USERNAME,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress user fields",
				"name" => "user-password",
				"label" => "User password",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_USER_PASSWORD,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
		];
	}

	/**
	 * @return bool
	 * @throws \Exception
	 */
	private function showWordPressTaxonomyFields(): bool
	{
		return $this->metaGroupBelongsTo(MetaTypes::TAXONOMY);
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function WordPressTaxonomyFields(): array
	{
		if($this->showWordPressTaxonomyFields() === false){
			return [];
		}

		return [
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress taxonomy fields",
				"name" => "tax-name",
				"label" => "Taxonomy name",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_TERM_NAME,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress taxonomy fields",
				"name" => "tax-description",
				"label" => "Taxonomy description",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_TERM_DESCRIPTION,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
					"rows" => 6,
					"cols" => 30,
				],
			],
			[
				"id" => Uuid::v4(),
				"metaFieldId" => null,
				"group" => "WordPress taxonomy fields",
				"name" => "tax-slug",
				"label" => "Taxonomy slug",
				"description" => null,
				"type" => FormFieldModel::WORDPRESS_TERM_SLUG,
				"isRequired" => false,
				"validation" => true,
				"isTextual" => true,
				"isReusable" => false,
				"extra" => [
					"defaultValue" => null,
					"placeholder" => null,
				],
			],
		];
	}

	/**
	 * @return bool
	 * @throws \Exception
	 */
	private function showWordPressUserFields(): bool
	{
		return $this->metaGroupBelongsTo(MetaTypes::USER);
	}

	/**
	 * @param $belongsTo
	 *
	 * @return bool
	 * @throws \Exception
	 */
	private function metaGroupBelongsTo($belongsTo)
	{
		if($this->formModel->getAction() !== FormAction::FILL_META){
			return false;
		}

		foreach ($this->formModel->getMeta() as $metadataModel){
			if($metadataModel->getKey() === 'fill_meta_fields'){
				$fieldIds = $metadataModel->getFormattedValue();
				$ids = [];

				foreach ($fieldIds as $fieldId){
					if(is_string($fieldId)){
						$ids[] = $fieldId;
					}
				}
			}
		}

		if(empty($ids)){
			return false;
		}

		$metaGroup = MetaRepository::getMetaFieldById($ids[0])->getBox()->getGroup();

		if($metaGroup === null){
			return false;
		}

		if($metaGroup->getBelongs()[0]->getBelongsTo() === $belongsTo){
			return true;
		}

		return false;
	}

	/**
	 * @return array
	 * @throws \Exception
	 */
	private function ACPTFields(): array
	{
		$fields = [];

		$belong = $this->formModel->getMetaDatum('fill_meta_location_belong');
		$find = $this->formModel->getMetaDatum('fill_meta_location_find');

		foreach ($this->formModel->getMeta() as $metadataModel){
			if($metadataModel->getKey() === 'fill_meta_fields'){
				$fieldIds = $metadataModel->getFormattedValue();

				foreach ($fieldIds as $fieldId){
					if(is_string($fieldId)){
						$fieldModel = MetaRepository::getMetaFieldById($fieldId);

						// disable relational and nestable fields
						if($fieldModel !== null and !$fieldModel->isRelational() and !$fieldModel->isNestable()){

							$fieldName = '';

							if($belong !== null and $find !== null and $belong->getValue() === MetaTypes::OPTION_PAGE){
								$fieldName .= $find->getValue() . '_';
							}

							$fieldName .= $fieldModel->getDbName();

							$field = [
								"id" => Uuid::v4(),
								"metaFieldId" => $fieldModel->getId(),
								"group" => "ACPT fields",
								"belong" => $belong ? $belong->getValue() : null,
								"find" => $find ? $find->getValue() : null,
								"name" => $fieldName,
								"label" => $fieldModel->getLabel() ? $fieldModel->getLabel() : $fieldModel->getName(),
								"description" => $fieldModel->getDescription() !== '' ? $fieldModel->getDescription() : 'description',
								"type" => $this->resolveFieldType($fieldModel->getType()),
								"isRequired" =>  $fieldModel->isRequired(),
								"validation" => $fieldModel->canFieldHaveValidationAndLogicRules(),
								"isTextual" => $fieldModel->isTextual(),
								"isReusable" => false,
								"extra" => [
									"defaultValue" => $fieldModel->getDefaultValue(),
									"placeholder" => null,
								],
							];

							// add extra
							switch ($fieldModel->getType()){

								case MetaFieldModel::CURRENCY_TYPE:
									$field['extra']['uom'] = 'USD';
									break;

								case MetaFieldModel::WEIGHT_TYPE:
									$field['extra']['uom'] = 'KILOGRAM';
									break;

								case MetaFieldModel::LENGTH_TYPE:
									$field['extra']['uom'] = 'METER';
									break;

								case MetaFieldModel::TEXT_TYPE:
									$field['extra']['placeholder'] = 'placeholder';
									break;

								case MetaFieldModel::EMAIL_TYPE:
									$field['extra']['placeholder'] = 'noreply@gmail.com';
									break;

								case MetaFieldModel::URL_TYPE:
									$field['extra']['placeholder'] = 'https://acpt.io';
									break;

								case MetaFieldModel::NUMBER_TYPE:
								case MetaFieldModel::RANGE_TYPE:
									$field['extra']['min'] = 1;
									$field['extra']['max'] = 100;
									$field['extra']['step'] = 1;
									break;

								case MetaFieldModel::EDITOR_TYPE:
									$field['extra']['placeholder'] = 'Editor';
									$field['extra']['wysiwyg'] = true;
									$field['extra']['rows'] = 6;
									$field['extra']['cols'] = 30;
									break;

								case MetaFieldModel::HTML_TYPE:
								case MetaFieldModel::TEXTAREA_TYPE:
									$field['extra']['placeholder'] = 'Textarea';
									$field['extra']['wysiwyg'] = false;
									$field['extra']['rows'] = 6;
									$field['extra']['cols'] = 30;
									break;

								case MetaFieldModel::RADIO_TYPE:
								case MetaFieldModel::SELECT_TYPE:
									$field['extra']["isMulti"] = false;

									foreach ($fieldModel->getOptions() as $optionModel){
										$field['extra']["options"][] = [
											"id" => $optionModel->getId(),
											"label" => $optionModel->getLabel(),
											"value" => $optionModel->getValue(),
										];
									}

									break;

								case MetaFieldModel::CHECKBOX_TYPE:
								case MetaFieldModel::SELECT_MULTI_TYPE:
									$field['extra']["isMulti"] = true;

									foreach ($fieldModel->getOptions() as $optionModel){
										$field['extra']["options"][] = [
											"id" => $optionModel->getId(),
											"label" => $optionModel->getLabel(),
											"value" => $optionModel->getValue(),
										];
									}

									break;

								case MetaFieldModel::GALLERY_TYPE:
									$field['extra']["multiple"] = true;
									$field['extra']["accept"] = "image/*";
									break;

								case MetaFieldModel::IMAGE_TYPE:
									$field['extra']["multiple"] = false;
									$field['extra']["accept"] = "image/*";
									break;

								case MetaFieldModel::VIDEO_TYPE:
									$field['extra']["multiple"] = false;
									$field['extra']["accept"] = "video/*";
									break;
							}

							$fields[] = $field;
						}
					}
				}
			}
		}

		return $fields;
	}

	/**
	 * @param $type
	 *
	 * @return mixed
	 */
	private function resolveFieldType($type)
	{
		if($type === MetaFieldModel::EDITOR_TYPE){
			return MetaFieldModel::TEXTAREA_TYPE;
		}

		if($type === MetaFieldModel::SELECT_MULTI_TYPE){
			return MetaFieldModel::SELECT_TYPE;
		}

		if(in_array($type, [
			MetaFieldModel::GALLERY_TYPE,
			MetaFieldModel::IMAGE_TYPE,
			MetaFieldModel::VIDEO_TYPE,
		])){
			return MetaFieldModel::FILE_TYPE;
		}

		return $type;
	}
}