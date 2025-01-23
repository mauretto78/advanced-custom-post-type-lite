<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Constants\TableField;
use ACPT_Lite\Utils\Data\Meta;

class SaveTableTemplateCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $name;

	/**
	 * @var array
	 */
	private $json;

	/**
	 * SaveTableTemplateCommand constructor.
	 *
	 * @param $name
	 * @param $json
	 */
	public function __construct($name, $json)
	{
		$this->name = $name;
		$this->json = $json;
	}

	/**
	 * @return bool|int|mixed|\WP_Error
	 */
	public function execute()
	{
		$key = TableField::DB_KEY . "_" . $this->name;

		return Meta::save($key, MetaTypes::OPTION_PAGE, $key, $this->json);
	}
}