<?php

namespace ACPT_Lite\Utils\ExportCode\DTO;

class ExportCodeStringsDto
{
	/**
	 * @var string
	 */
	public $acpt;

	/**
	 * @var string
	 */
	public $wordpress;

	/**
	 * @return array
	 */
	public function toArray()
	{
		return [
			'acpt' => $this->acpt,
			'wordpress' => $this->wordpress,
		];
	}
}