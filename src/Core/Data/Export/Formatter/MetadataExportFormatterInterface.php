<?php

namespace ACPT_Lite\Core\Data\Export\Formatter;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;

interface MetadataExportFormatterInterface
{
	/**
	 * This function formats a single metadata item
	 *
	 * @param MetadataExportItemDto $dto
	 *
	 * @return mixed
	 */
	public function format(MetadataExportItemDto $dto);
}
