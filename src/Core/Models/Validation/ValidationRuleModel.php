<?php

namespace ACPT_Lite\Core\Models\Validation;

use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class ValidationRuleModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * Supported conditions
	 */
	const IS_BLANK = 'blank';
	const IS_NOT_BLANK = 'not_blank';
	const EQUALS = '=';
	const NOT_EQUALS = '!=';
	const GREATER_THAN = '>';
	const GREATER_THAN_EQUALS = '>=';
	const LOWER_THAN = '<';
	const LOWER_THAN_EQUALS = '<=';
	const MAX_LENGTH = 'max';
	const MIN_LENGTH = 'min';
	const REGEX = 'regex';
	const MAX_SIZE = 'max_size';
	const MIN_SIZE = 'min_size';

	/**
	 * @var string
	 */
	private string $condition;

    /**
     * @var string|null
     */
	private ?string $value = null;

	/**
	 * @var string
	 */
	private string $message;

	/**
	 * @var int
	 */
	private int $sort;

	/**
	 * ValidationRuleModel constructor.
	 *
	 * @param string $id
	 * @param string $condition
	 * @param int $sort
	 * @param string $message
	 * @param string|null $value
	 *
	 * @throws \ReflectionException
	 */
	public function __construct(
		string $id,
		string $condition,
		int $sort,
		string $message,
		?string $value = null
	)
	{
		parent::__construct($id);
		$this->setCondition($condition);
		$this->setValue($value);
		$this->message = $message;
		$this->sort = $sort;
	}

	/**
	 * @param $condition
	 *
	 * @throws \ReflectionException
	 */
	private function setCondition($condition)
	{
		if(!in_array($condition, $this->getValidConditions())){
			throw new \DomainException($condition . ' is not a valid rule');
		}

		$this->condition = $condition;
	}

	/**
	 * @return string
	 */
	public function getCondition(): string
	{
		return $this->condition;
	}

	/**
	 * @param null $value
	 */
	private function setValue($value = null)
	{
		$allowedNullValueConditions = [
			self::IS_BLANK,
			self::IS_NOT_BLANK,
		];

		if(!in_array($this->condition, $allowedNullValueConditions) and $value === null){
			throw new \DomainException('Validation value cannot be null');
		}

		$this->value = $value;
	}

	/**
	 * @return string|null
	 */
	public function getValue(): ?string
	{
		return $this->value;
	}

	/**
	 * @return array
	 */
	public function getValidConditions(): array
	{
		return $this->getConstants();
	}

	/**
	 * @return int
	 */
	public function getSort(): int
	{
		return $this->sort;
	}

	/**
	 * @return string
	 */
	public function getMessage(): string
	{
		return $this->message;
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'condition' => $this->getCondition(),
			'value' => $this->getValue(),
			'validConditions' => $this->getValidConditions(),
			'message' => $this->getMessage(),
			'sort' => $this->getSort(),
		];
	}

	/**
	 * @return ValidationRuleModel
	 */
	public function duplicate(): ValidationRuleModel
	{
		$duplicate = clone $this;
		$duplicate->id = Uuid::v4();

		return $duplicate;
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
			'condition' => [
				'required' => true,
				'type' => 'string',
			],
			'value' => [
				'required' => false,
				'type' => 'string',
			],
			'message' => [
				'required' => false,
				'type' => 'string',
			],
			'sort' => [
				'required' => false,
				'type' => 'string|integer',
			],
		];
	}
}