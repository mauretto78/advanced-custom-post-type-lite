<?php

namespace ACPT_Lite\Core\Data\Export\Generator;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportArrayFormatter;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportFormatterInterface;
use ACPT_Lite\Utils\Data\Formatter\Driver\JSONFormatter;

class MetadataExportJsonGenerator implements MetadataExportGeneratorInterface
{
	/**
	 * @param MetadataExportItemDto[] $items
	 *
	 * @return string
	 */
	public function generate($items = [])
	{
		$meta = [];

		foreach ($items as $item){
			$meta[] = $this->getFormatter()->format($item);
		}

		return JSONFormatter::format([
			'acpt_meta' => $meta
		]);
	}

	/**
	 * @return MetadataExportFormatterInterface
	 */
	public function getFormatter()
	{
		return new MetadataExportArrayFormatter();
	}
}