<?php

namespace ACPT_Lite\Integrations\Zion\Provider\Utils;

use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Integrations\Zion\Provider\Constants\ZionConstants;

class FieldSettings
{
	/**
	 * @param $fieldKey
	 *
	 * @return array|bool
	 * @throws \Exception
	 */
	public static function get($fieldKey)
	{
		$field = explode(ZionConstants::FIELD_KEY_SEPARATOR, $fieldKey);

		if(empty($field)){
			return false;
		}

		$belongsTo = $field[0];
		$find = $field[1];
		$fieldId = $field[2];

		$metaFieldSettings = MetaRepository::getMetaFieldById($fieldId);
		$metaFieldSettings->setBelongsToLabel($belongsTo);
		$metaFieldSettings->setFindLabel($find);

		if ($metaFieldSettings === null){
			return false;
		}

		return [
			'id' => $fieldId,
			'belongsTo' => $belongsTo,
			'find' => $find,
			'model' => $metaFieldSettings,
		];
	}
}