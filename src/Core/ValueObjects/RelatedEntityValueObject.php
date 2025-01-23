<?php

namespace ACPT_Lite\Core\ValueObjects;

use ACPT_Lite\Constants\MetaTypes;

class RelatedEntityValueObject implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private $type;

	/**
	 * @var mixed
	 */
	private $value;

	/**
	 * RelatedEntityValueObject constructor.
	 *
	 * @param $type
	 * @param $value
	 *
	 * @throws \Exception
	 */
	public function __construct($type, $value)
	{
		$this->setType($type);
		$this->value = $value;
	}

	/**
	 * @param $type
	 *
	 * @throws \Exception
	 */
	private function setType($type)
	{
		$allowedTypes = [
			MetaTypes::CUSTOM_POST_TYPE,
			MetaTypes::TAXONOMY,
			MetaTypes::OPTION_PAGE,
			MetaTypes::USER,
			MetaTypes::META,
		];

		if(!in_array($type, $allowedTypes)){
			throw new \Exception($type . ' is not a valid RelatedEntityValueObject type');
		}

		$this->type = $type;
	}

	/**
	 * @return string
	 */
	public function getType()
	{
		return $this->type;
	}

	/**
	 * @return mixed
	 */
	public function getValue()
	{
		return $this->value;
	}

	/**
	 * @return false|string
	 */
	public function humanReadableJsonFormat()
	{
		return json_encode([
			'type' => $this->type,
			'value' => $this->value,
		]);
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'type' => $this->type,
			'value' => $this->value,
		];
	}

	/**
	 * @return array
	 */
	public function arrayRepresentation(): array
	{
		return [
			'type' => $this->type,
			'value' => $this->value,
		];
	}
}