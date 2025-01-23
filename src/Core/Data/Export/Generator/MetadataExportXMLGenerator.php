<?php

namespace ACPT_Lite\Core\Data\Export\Generator;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportFormatterInterface;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportXMLFormatter;
use ACPT_Lite\Utils\Data\Formatter\Driver\XMLFormatter;

class MetadataExportXMLGenerator implements MetadataExportGeneratorInterface
{
	/**
	 * @param MetadataExportItemDto[] $items
	 *
	 * @return string
	 */
	public function generate($items = [])
	{
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		$xml .= '<acpt_meta>';

		foreach ($items as $item){
			$xml .= $this->getFormatter()->format($item);
		}

		$xml .= '</acpt_meta>';

		return XMLFormatter::beautify($xml);
	}

	/**
	 * @return MetadataExportFormatterInterface
	 */
	public function getFormatter()
	{
		return new MetadataExportXMLFormatter();
	}
}
