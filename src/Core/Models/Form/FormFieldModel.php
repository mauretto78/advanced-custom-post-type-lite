<?php

namespace ACPT_Lite\Core\Models\Form;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\Repository\FormRepository;

class FormFieldModel extends AbstractModel implements \JsonSerializable
{
		const ADDRESS_TYPE = 'Address';
		const BUTTON_TYPE = 'Button';
		const CAPTCHA_TYPE = 'Captcha';
		const CHECKBOX_TYPE = 'Checkbox';
		const COLOR_TYPE = 'Color';
		const COUNTRY_TYPE = 'Country';
		const CURRENCY_TYPE = 'Currency';
		const DATE_TYPE = 'Date';
		const DATE_TIME_TYPE = 'DateTime';
		const DATE_RANGE_TYPE = 'DateRange';
		const EMAIL_TYPE = 'Email';
		const FILE_TYPE = 'File';
		const HIDDEN_TYPE = 'Hidden';
		const HTML_TYPE = 'HTML';
		const ICON_TYPE = 'Icon';
		const LENGTH_TYPE = 'Length';
		const NUMBER_TYPE = 'Number';
		const PASSWORD_TYPE = 'Password';
		const PHONE_TYPE = 'Phone';
		const RADIO_TYPE = 'Radio';
		const RANGE_TYPE = 'Range';
		const RATING_TYPE = 'Rating';
		const SELECT_TYPE = 'Select';
		const TEXT_TYPE = 'Text';
		const TEXTAREA_TYPE = 'Textarea';
		const TIME_TYPE = 'Time';
		const TOGGLE_TYPE = 'Toggle';
		const TURNSTILE_TYPE = 'Turnstile';
		const URL_TYPE = 'Url';
		const WEIGHT_TYPE = 'Weight';

		const WORDPRESS_POST_THUMBNAIL = 'PostThumbnail';
		const WORDPRESS_POST_TITLE = 'PostTitle';
		const WORDPRESS_POST_CONTENT = 'PostContent';
		const WORDPRESS_POST_EXCERPT = 'PostExcerpt';
		const WORDPRESS_POST_DATE = 'PostDate';
		const WORDPRESS_POST_AUTHOR = 'PostAuthor';
		const WORDPRESS_POST_TAXONOMIES = 'PostTaxonomies';

		const WORDPRESS_TERM_NAME = 'TermName';
		const WORDPRESS_TERM_DESCRIPTION = 'TermDescription';
		const WORDPRESS_TERM_SLUG = 'TermSlug';

		const WORDPRESS_USER_EMAIL = 'UserEmail';
		const WORDPRESS_USER_FIRST_NAME = 'UserFirstName';
		const WORDPRESS_USER_LAST_NAME = 'UserLastName';
		const WORDPRESS_USER_USERNAME = 'Username';
		const WORDPRESS_USER_PASSWORD = 'UserPassword';
		const WORDPRESS_USER_BIO = 'UserBio';

	/**
	 * @var null
	 */
	private $metaField = null;

	/**
	 * @var string|null
	 */
	private $belong;

	/**
	 * @var string|null
	 */
	private $find;

	/**
	 * @var string
	 */
	private $key;

	/**
	 * @var string
	 */
	private $group;

	/**
	 * @var string
	 */
	private $name;

	/**
	 * @var string
	 */
	private $type;

	/**
	 * @var null
	 */
	private $label = null;

	/**
	 * @var null
	 */
	private $description = null;

	/**
	 * @var bool
	 */
	private $isRequired;

	/**
	 * @var int
	 */
	private $sort;

	/**
	 * @var array
	 */
	private $extra = [];

	/**
	 * @var array
	 */
	private $settings = [];

	/**
	 * @var ValidationRuleModel[]
	 */
	private $validationRules = [];

	/**
	 * FormFieldModel constructor.
	 *
	 * @param string $id
	 * @param string $key
	 * @param string $group
	 * @param string $name
	 * @param string $type
	 * @param bool $isRequired
	 * @param int $sort
	 * @param string|null $label
	 * @param string|null $description
	 * @param MetaFieldModel|null $metaField
	 * @param array $extra
	 * @param array $settings
	 */
	public function __construct(
		string $id,
		string $key,
		string $group,
		string $name,
		string $type,
		bool $isRequired,
		int $sort,
		?string $label = null,
		?string $description = null,
		?MetaFieldModel $metaField = null,
		array $extra = [],
		array $settings = []
	){
		parent::__construct($id);
		$this->key = $key;
		$this->group = $group;
		$this->name = $name;
		$this->sort = $sort;
		$this->setType($type);
		$this->label = $label;
		$this->isRequired = $isRequired;
		$this->description = $description;
		$this->extra = $extra;
		$this->settings = $settings;
		$this->metaField = $metaField;
		$this->validationRules = [];
	}

	/**
	 * @return string|null
	 */
	public function getBelong(): ?string
	{
		return $this->belong;
	}

	/**
	 * @param string|null $belong
	 */
	public function setBelong( ?string $belong ): void
	{
		$this->belong = $belong;
	}

	/**
	 * @return string|null
	 */
	public function getFind(): ?string
	{
		return $this->find;
	}

	/**
	 * @param string|null $find
	 */
	public function setFind( ?string $find ): void
	{
		$this->find = $find;
	}

	/**
	 * @return MetaFieldModel|null
	 */
	public function getMetaField(): ?MetaFieldModel
	{
		return $this->metaField;
	}

	/**
	 * @return string
	 */
	public function getKey(): string
	{
		return $this->key;
	}

	public function regenerateKey(): void
	{
		$this->key = Strings::randomString(8);
	}

	/**
	 * @param $type
	 */
	private function setType($type)
	{
		if(!in_array($type, $this->getValidTypes())){
			throw new \DomainException($type . ' is not a valid field type for this form field');
		}

		$this->type = $type;
	}

	/**
	 * @return array
	 */
	public function getValidTypes(): array
	{
		return $this->getConstants();
	}

	/**
	 * @return string
	 */
	public function getGroup(): string
	{
		return $this->group;
	}

	/**
	 * @return string
	 */
	public function getName(): string
	{
		return $this->name;
	}

    /**
     * @param string $name
     */
    public function changeName( string $name ): void
    {
        $this->name = $name;
    }

	/**
	 * @return string
	 */
	public function getType(): string
	{
		return $this->type;
	}

	/**
	 * @return null
	 */
	public function getLabel()
	{
		return $this->label;
	}

	/**
	 * @return bool
	 */
	public function isRequired(): bool
	{
		return $this->isRequired;
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @return null
	 */
	public function getDescription()
	{
		return $this->description;
	}

	/**
	 * @param $extra
	 */
	public function setExtra($extra)
	{
		$this->extra = $extra;
	}

	/**
	 * @return array
	 */
	public function getExtra(): array
	{
		return $this->extra;
	}

	/**
	 * @param $settings
	 */
	public function setSettings($settings)
	{
		$this->settings = $settings;
	}

	/**
	 * @return array
	 */
	public function getSettings(): array
	{
		return $this->settings;
	}

	/**
	 * @param ValidationRuleModel $rule
	 */
	public function addValidationRule(ValidationRuleModel $rule)
	{
		if(!$this->existsInCollection($rule->getId(), $this->validationRules)){
			$this->validationRules[] = $rule;
		}
	}

	/**
	 * @param ValidationRuleModel $rule
	 */
	public function removeValidationRule(ValidationRuleModel $rule)
	{
		$this->validationRules = $this->removeFromCollection($rule->getId(), $this->validationRules);
	}

	/**
	 * Clear all validation rules
	 */
	public function clearValidationRules()
	{
		$this->validationRules = [];
	}

	/**
	 * @return ValidationRuleModel[]
	 */
	public function getValidationRules()
	{
		return $this->validationRules;
	}

	/**
	 * @return bool
	 */
	public function canFieldHaveValidationAndLogicRules(): bool
	{
		$allowed = [
			self::NUMBER_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
			self::DATE_TYPE,
			self::TIME_TYPE,
			self::URL_TYPE,
			self::PHONE_TYPE,
			self::EMAIL_TYPE,
			self::COLOR_TYPE,
			self::CURRENCY_TYPE,
			self::WEIGHT_TYPE,
			self::LENGTH_TYPE,
			self::TOGGLE_TYPE,
			self::PASSWORD_TYPE,
			self::WORDPRESS_POST_TITLE,
			self::WORDPRESS_POST_CONTENT,
			self::WORDPRESS_POST_EXCERPT,
			self::WORDPRESS_POST_DATE,
			self::WORDPRESS_POST_AUTHOR,
			self::WORDPRESS_USER_EMAIL,
			self::WORDPRESS_USER_FIRST_NAME,
			self::WORDPRESS_USER_LAST_NAME,
			self::WORDPRESS_USER_USERNAME,
			self::WORDPRESS_USER_PASSWORD,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isMediaField(): bool
	{
		$allowed = [
			self::FILE_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isTextualField(): bool
	{
		$allowed = [
			self::DATE_TYPE,
			self::TIME_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::SELECT_TYPE,
			self::URL_TYPE,
			self::PHONE_TYPE,
			self::EMAIL_TYPE,
			self::WEIGHT_TYPE,
			self::LENGTH_TYPE,
			self::CURRENCY_TYPE,
			self::WORDPRESS_POST_TITLE,
			self::WORDPRESS_POST_CONTENT,
			self::WORDPRESS_POST_EXCERPT,
			self::WORDPRESS_POST_DATE,
			self::WORDPRESS_USER_EMAIL,
			self::WORDPRESS_USER_FIRST_NAME,
			self::WORDPRESS_USER_LAST_NAME,
			self::WORDPRESS_USER_USERNAME,
			self::WORDPRESS_USER_PASSWORD,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isWordPressPostField(): bool
	{
		$allowed = [
			self::WORDPRESS_POST_THUMBNAIL,
			self::WORDPRESS_POST_TITLE,
			self::WORDPRESS_POST_CONTENT,
			self::WORDPRESS_POST_EXCERPT,
			self::WORDPRESS_POST_DATE,
			self::WORDPRESS_POST_AUTHOR,
			self::WORDPRESS_POST_TAXONOMIES,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isWordPressUserField(): bool
	{
		$allowed = [
			self::WORDPRESS_USER_EMAIL,
			self::WORDPRESS_USER_FIRST_NAME,
			self::WORDPRESS_USER_LAST_NAME,
			self::WORDPRESS_USER_USERNAME,
			self::WORDPRESS_USER_PASSWORD,
			self::WORDPRESS_USER_BIO,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isWordPressTermField(): bool
	{
		$allowed = [
			self::WORDPRESS_TERM_DESCRIPTION,
			self::WORDPRESS_TERM_NAME,
			self::WORDPRESS_TERM_SLUG,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function isACPTMetaField(): bool
	{
		$allowed = [
			self::ADDRESS_TYPE,
			self::BUTTON_TYPE,
			self::CAPTCHA_TYPE,
			self::CHECKBOX_TYPE,
			self::COUNTRY_TYPE,
			self::COLOR_TYPE,
			self::CURRENCY_TYPE,
			self::DATE_TYPE,
			self::DATE_RANGE_TYPE,
			self::EMAIL_TYPE,
			self::FILE_TYPE,
			self::HIDDEN_TYPE,
			self::HTML_TYPE,
			self::ICON_TYPE,
			self::LENGTH_TYPE,
			self::NUMBER_TYPE,
			self::PASSWORD_TYPE,
			self::PHONE_TYPE,
			self::RADIO_TYPE,
			self::RANGE_TYPE,
			self::RATING_TYPE,
			self::SELECT_TYPE,
			self::TEXT_TYPE,
			self::TEXTAREA_TYPE,
			self::TIME_TYPE,
			self::TOGGLE_TYPE,
			self::TURNSTILE_TYPE,
			self::URL_TYPE,
			self::WEIGHT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

	/**
	 * @return bool
	 */
	public function canHaveAfterAndBefore(): bool
	{
		if($this->metaField === null){
			return false;
		}

		$allowed = [
			self::COLOR_TYPE,
			self::COUNTRY_TYPE,
			self::CURRENCY_TYPE,
			self::DATE_TYPE,
			self::DATE_RANGE_TYPE,
			self::DATE_TIME_TYPE,
			self::EMAIL_TYPE,
			self::FILE_TYPE,
			self::HTML_TYPE,
			self::LENGTH_TYPE,
			self::NUMBER_TYPE,
			self::PHONE_TYPE,
			self::SELECT_TYPE,
			self::TEXTAREA_TYPE,
			self::TEXT_TYPE,
			self::TIME_TYPE,
			self::URL_TYPE,
			self::WEIGHT_TYPE,
		];

		return in_array($this->getType(), $allowed);
	}

    /**
     * @param FormModel $formModel
     * @return FormFieldModel
     */
    public function duplicateFrom(FormModel $formModel)
    {
        $duplicate = clone $this;
        $duplicate->id = Uuid::v4();
        $duplicate->regenerateKey();
        $duplicate->changeName(Strings::getTheFirstAvailableName($duplicate->getName(), FormRepository::getFieldNames()));

        $validationRules = $duplicate->getValidationRules();
        $duplicate->validationRules = [];

        foreach ($validationRules as $validationRule){
            $duplicate->validationRules[] = $validationRule->duplicate();
        }

        return $duplicate;
    }

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'metaField' => $this->getMetaField() ?? null,
			'metaFieldId' => $this->getMetaField() ?  $this->getMetaField()->getId() : null,
			'find' => $this->getFind(),
			'belong' => $this->getBelong(),
			'key' => $this->getKey(),
			'group' => $this->getGroup(),
			'name' => $this->getName(),
			'label' => $this->getLabel(),
			'type' => $this->getType(),
			'description' => $this->getDescription(),
			'isRequired' => (bool)$this->isRequired(),
			'validation' => (bool)($this->canFieldHaveValidationAndLogicRules() or $this->isMediaField()),
			'isTextual' => (bool)$this->isTextualField(),
			'canHaveAfterAndBefore' => (bool)$this->canHaveAfterAndBefore(),
			'isMedia' => (bool)$this->isMediaField(),
			'sort' => (int)$this->getSort(),
			'extra' => $this->getExtra(),
			'settings' => $this->getSettings(),
			'validationRules' => $this->getValidationRules(),
		];
	}

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'group' => [
				'required' => true,
				'type' => 'string',
			],
			'name' => [
				'required' => true,
				'type' => 'string',
			],
			'key' => [
				'required' => true,
				'type' => 'string',
			],
			'label' => [
				'required' => false,
				'type' => 'string',
			],
			'type' => [
				'required' => true,
				'type' => 'string',
				'enum' => [
					self::ADDRESS_TYPE,
					self::BUTTON_TYPE,
					self::CAPTCHA_TYPE,
					self::CHECKBOX_TYPE,
					self::COLOR_TYPE,
					self::COUNTRY_TYPE,
					self::CURRENCY_TYPE,
					self::DATE_TYPE,
					self::DATE_TIME_TYPE,
					self::DATE_RANGE_TYPE,
					self::EMAIL_TYPE,
					self::FILE_TYPE,
					self::HIDDEN_TYPE,
					self::HTML_TYPE,
					self::ICON_TYPE,
					self::LENGTH_TYPE,
					self::NUMBER_TYPE,
					self::PASSWORD_TYPE,
					self::PHONE_TYPE,
					self::RADIO_TYPE,
					self::RANGE_TYPE,
					self::RATING_TYPE,
					self::SELECT_TYPE,
					self::TEXT_TYPE,
					self::TEXTAREA_TYPE,
					self::TIME_TYPE,
					self::TOGGLE_TYPE,
					self::TURNSTILE_TYPE,
					self::URL_TYPE,
					self::WEIGHT_TYPE,
					self::WORDPRESS_POST_THUMBNAIL,
					self::WORDPRESS_POST_TITLE,
					self::WORDPRESS_POST_CONTENT,
					self::WORDPRESS_POST_EXCERPT,
					self::WORDPRESS_POST_DATE,
					self::WORDPRESS_POST_AUTHOR,
					self::WORDPRESS_POST_TAXONOMIES,
					self::WORDPRESS_TERM_NAME,
					self::WORDPRESS_TERM_DESCRIPTION,
					self::WORDPRESS_TERM_SLUG,
					self::WORDPRESS_USER_EMAIL,
					self::WORDPRESS_USER_FIRST_NAME,
					self::WORDPRESS_USER_LAST_NAME,
					self::WORDPRESS_USER_USERNAME,
					self::WORDPRESS_USER_PASSWORD,
					self::WORDPRESS_USER_BIO,
				],
			],
			'metaField' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => MetaFieldModel::class
			],
			'metaFieldId' => [
				'required' => false,
				'type' => 'string',
			],
			'description' => [
				'required' => false,
				'type' => 'string',
			],
			'isRequired' => [
				'required' => true,
				'type' => 'boolean',
			],
			'extra' => [
				'required' => false,
				'type' => 'array',
			],
			'settings' => [
				'required' => false,
				'type' => 'array',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
		];
	}
}