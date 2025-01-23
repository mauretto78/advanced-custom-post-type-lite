<?php

namespace ACPT_Lite\Core\ValueObjects;

class FormSubmissionErrorObject implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private $key;

	/**
	 * @var string
	 */
	private $error;

	/**
	 * FormSubmissionErrorObject constructor.
	 *
	 * @param $key
	 * @param $error
	 */
	public function __construct(
		$key,
		$error = null
	)
	{
		$this->key = $key;
		$this->error = $error;
	}

	/**
	 * @return string
	 */
	public function getKey(): string {
		return $this->key;
	}

    /**
     * @return string|null
     */
	public function getError(): ?string
	{
		return $this->error;
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'key' => $this->getKey(),
			'error' => $this->getError(),
		];
	}
}
