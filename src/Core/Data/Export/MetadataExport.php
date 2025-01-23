<?php

namespace ACPT_Lite\Core\Data\Export;

use ACPT_Lite\Constants\FormatterFormat;
use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Data\Export\Generator\MetadataExportGeneratorInterface;
use ACPT_Lite\Core\Data\Export\Generator\MetadataExportJsonGenerator;
use ACPT_Lite\Core\Data\Export\Generator\MetadataExportXMLGenerator;
use ACPT_Lite\Core\Data\Export\Generator\MetadataExportYamlGenerator;

class MetadataExport
{
	/**
	 * This function exports the metadata items into a file
	 *
	 * @param string $format
	 * @param MetadataExportItemDto[] $items $items
	 *
	 * @return string
	 * @throws \Exception
	 */
	public static function export($format, $items = [])
	{
		if(!in_array($format, FormatterFormat::ALLOWED_FORMATS)){
			throw new \Exception($format . ' is not supported format');
		}

		$generator = self::getGeneratorInstance($format);

		return $generator->generate($items);
	}

	/**
	 * @param $format
	 *
	 * @return MetadataExportGeneratorInterface
	 */
	private static function getGeneratorInstance($format)
	{
		switch ($format){
			case FormatterFormat::JSON_FORMAT:
				return new MetadataExportJsonGenerator();

			case FormatterFormat::XML_FORMAT;
				return new MetadataExportXMLGenerator();

			case FormatterFormat::YAML_FORMAT:
				return new MetadataExportYamlGenerator();
		}
	}
}