<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Core\CQRS\Command\SaveMetaFieldValueCommand;

class FetchMetaFieldValueQuery extends SaveMetaFieldValueCommand implements QueryInterface
{
	/**
	 * @return mixed
	 * @throws \Exception
	 */
	public function execute()
	{
		$saved_field_type = $this->getData('_type');
		$saved_field_value = $this->getData();

		$before = null;
		$after  = null;

		return $before.$saved_field_value.$after;
	}
}