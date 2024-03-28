<?php

namespace ACPT_Lite\Core\CQRS\Query;

interface QueryInterface
{
	/**
	 * @return mixed
	 */
	public function execute();
}