<?php

namespace ACPT_Lite\Utils\Checker;

use ACPT_Lite\Core\Repository\MetaRepository;

class FieldsVisibilityLiveChecker
{
	/**
	 * @param $visibility
	 * @param $elementId
	 * @param $belongsTo
	 * @param $liveData
	 *
	 * @return array
	 * @throws \Exception
	 */
	public static function check(
		$visibility,
		$elementId,
		$belongsTo,
		$liveData
	)
	{
		$check = [];

		foreach ($liveData as $rawDatum){

			$formId = $rawDatum['formId'];
			$metaField = MetaRepository::getMetaFieldById($formId);

			if($metaField->hasParent() and isset($rawDatum['fieldIndex']) and $rawDatum['fieldIndex'] !== null){
				$check[$formId][(int)$rawDatum['fieldIndex']] = FieldVisibilityChecker::check(
					$visibility,
					$elementId,
					$belongsTo,
					$metaField,
					$liveData,
					(int)$rawDatum['fieldIndex']
				);
			} else {
				$check[$formId] = FieldVisibilityChecker::check(
					$visibility,
					$elementId,
					$belongsTo,
					$metaField,
					$liveData
				);
			}
		}

		return $check;
	}
}