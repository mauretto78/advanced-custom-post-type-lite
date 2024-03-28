<?php

namespace ACPT_Lite\Utils\ExportCode\Exporter;

use ACPT_Lite\Utils\ExportCode\DTO\ExportCodeStringsDto;

abstract class AbstractExportCodeStrings
{
	/**
	 * @param $find
	 *
	 * @return ExportCodeStringsDto
	 */
	public abstract function export($find);
}
