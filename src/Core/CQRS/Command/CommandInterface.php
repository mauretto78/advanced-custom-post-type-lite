<?php

namespace ACPT_Lite\Core\CQRS\Command;

interface CommandInterface
{
	/**
	 * @return mixed
	 */
	public function execute();
}