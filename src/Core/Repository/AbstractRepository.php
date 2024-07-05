<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Utils\PHP\Arrays;

abstract class AbstractRepository
{
	/**
	 * @param array $mandatoryKeys
	 * @param array $args
	 * @throws \Exception
	 */
	protected static function validateArgs(array $mandatoryKeys = [], array $args = [])
	{
		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate($mandatoryKeys, $args)){
			throw new \Exception('Invalid parameters. Required: ['.Arrays::toPlainText($mandatoryKeys).']. Provided: ['.Arrays::toPlainText($args).']');
		}
	}
}