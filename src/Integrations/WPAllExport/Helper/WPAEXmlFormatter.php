<?php

namespace ACPT_Lite\Integrations\WPAllExport\Helper;

use ACPT_Lite\Core\Data\Export\DTO\MetadataExportItemDto;
use ACPT_Lite\Core\Data\Export\Formatter\MetadataExportXMLFormatter;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;

class WPAEXmlFormatter
{
	/**
	 * @param $itemId
	 * @param $belongsTo
	 * @param $find
	 * @param MetaGroupModel[] $metaGroups
	 *
	 * @return string
	 */
	public static function formatMetadata($itemId, $belongsTo, $find = null, array $metaGroups = [])
	{
		$dto             = new MetadataExportItemDto();
		$dto->id         = $itemId;
		$dto->belongsTo  = $belongsTo;
		$dto->find       = $find;
		$dto->metaGroups = $metaGroups;

		$formatter = new MetadataExportXMLFormatter();

		$xml = '<acpt_meta>';
		$xml .= $formatter->format($dto);
		$xml .= '</acpt_meta>';

		return $xml;
	}

	/**
	 * @see https://www.wpallimport.com/documentation/custom-wordpress-export-php/
	 * @param $string
	 *
	 * @return string
	 */
	public static function removeCDATA($string)
	{
		$replacementMap = [
			'<![CDATA[' => 'CDATABEGIN',
			']]>' => 'CDATACLOSE',
			'[' => '**OPENSHORTCODE**',
			']' => '**CLOSESHORTCODE**',
			'{' => '**OPENCURVE**',
			'}' => '**CLOSECURVE**',
			'(' => '**OPENCIRCLE**',
			')' => '**CLOSECIRCLE**',
			'"' => '**SINGLEQUOT**',
			"<" => '**LT**',
			">" => '**GT**',
		];

		foreach ($replacementMap as $toBeReplaced => $replace){
			$string = str_replace($toBeReplaced, $replace, $string);
		}

		return $string;
	}
}