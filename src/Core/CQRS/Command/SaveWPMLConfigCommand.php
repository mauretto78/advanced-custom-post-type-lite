<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Integrations\WPML\Helper\WPMLConfig;
use ACPT_Lite\Integrations\WPML\Provider\MetaFieldsProvider;

class SaveWPMLConfigCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private $data;

	/**
	 * SaveWPMLConfigCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct($data)
	{
		$this->data = $data;
	}

	/**
	 * @inheritDoc
	 */
	public function execute()
	{
		$data = (isset($this->data['resetDefault']) and $this->data['resetDefault'] === true) ? MetaFieldsProvider::getInstance(true)->getFields() : $this->data;

		WPMLConfig::generate($data);
	}
}