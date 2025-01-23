<?php

namespace ACPT_Lite\Core\Data\Export\Generator;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;

interface MetadataExportGeneratorInterface
{
	/**
	 * @return MetadataExportGeneratorInterface
	 */
	public function getFormatter();

	/**
	 * @param MetadataExportItemDto[] $items
	 *
	 * @return string
	 */
	public function generate($items = []);
}
