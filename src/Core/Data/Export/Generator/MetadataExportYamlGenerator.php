<?php

namespace ACPT_Lite\Core\Data\Export\Generator;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportArrayFormatter;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportFormatterInterface;
use Symfony\Component\Yaml\Yaml;

class MetadataExportYamlGenerator implements MetadataExportGeneratorInterface
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

		return Yaml::dump([
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