<?php

namespace ACPT_Lite\Utils\ExportCode;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Utils\ExportCode\Exporter\AbstractExportCodeStrings;
use ACPT_Lite\Utils\ExportCode\Exporter\ExportCustomPostTypeCodeStrings;
use ACPT_Lite\Utils\ExportCode\Exporter\ExportOptionPageCodeStrings;
use ACPT_Lite\Utils\ExportCode\Exporter\ExportTaxonomyCodeStrings;

class ExportCodeStrings
{
	/**
	 * @param $belongsTo
	 * @param $find
	 *
	 * @return array
	 * @throws \Exception
	 */
	public static function export($belongsTo, $find)
	{
		$exporter = self::getExporter($belongsTo);
		$exportDto  = $exporter->export($find);

		return $exportDto->toArray();
	}

	/**
	 * @param $belongsTo
	 *
	 * @return AbstractExportCodeStrings
	 * @throws \Exception
	 */
	private static function getExporter($belongsTo)
	{
		switch ($belongsTo){
			case MetaTypes::CUSTOM_POST_TYPE:
				return new ExportCustomPostTypeCodeStrings();

			case MetaTypes::TAXONOMY:
				return new ExportTaxonomyCodeStrings();

			case MetaTypes::OPTION_PAGE:
				return new ExportOptionPageCodeStrings();
		}

		throw new \Exception($belongsTo . ' is not valid `belongsTo` param.');
	}
}

