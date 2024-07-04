<?php

namespace ACPT_Lite\Integrations\WPML\Helper;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Integrations\WPML\Constants\WPMLConstants;
use ACPT_Lite\Utils\Data\Meta;

/**
 * Not in use now, maybe could be useful in the future
 */
class WPMLStrings
{
	/**
	 * Delete a package
	 *
	 * @param string $packageName
	 */
	public static function deletePackage($packageName)
	{
		do_action( 'wpml_delete_package', $packageName,  WPMLConstants::KIND_NAME );
	}

	/**
	 * Delete unused package
	 *
	 * @param $packageName
	 * @param $packageTitle
	 */
	public static function deleteUnusedPackage($packageName, $packageTitle)
	{
		do_action( 'wpml_delete_unused_package_strings', [
			'kind' => WPMLConstants::KIND_NAME,
			'name' => $packageName,
			'title' => $packageTitle,
		] );
	}

	/**
	 * Register a string
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $contextId
	 * @param $belongsTo
	 * @param null $find
	 */
	public static function registerString(MetaFieldModel $fieldModel, $contextId, $belongsTo, $find = null)
	{
		do_action(
			'wpml_register_string',
			self::value($fieldModel, $contextId, $belongsTo),
			self::name($fieldModel, $contextId, $belongsTo, $find),
			self::package($fieldModel),
			self::title($fieldModel),
			self::type($fieldModel),
		);
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param $contextId
	 * @param $belongsTo
	 *
	 * @return mixed|void|null
	 */
	private static function value(MetaFieldModel $fieldModel, $contextId, $belongsTo)
	{
		return Meta::fetch($contextId, $belongsTo, $fieldModel->getDbName());
	}

	/**
	 * Generate unique key
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $contextId
	 * @param $belongsTo
	 * @param null $find
	 *
	 * @return string
	 */
	private static function name(MetaFieldModel $fieldModel, $contextId, $belongsTo, $find = null)
	{
		$key = $fieldModel->getDbName() . '_' . $contextId . '_' . $belongsTo;

		if($find !== null){
			$key .= '_' . $find;
		}

		return md5($key);
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return array
	 */
	private static function package(MetaFieldModel $fieldModel)
	{
		return [
			'kind' => WPMLConstants::KIND_NAME,
			'name' => $fieldModel->getBox()->getGroup()->getName(),
			'title' => $fieldModel->getBox()->getGroup()->getUIName(),
		];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function title(MetaFieldModel $fieldModel)
	{
		return $fieldModel->getUiName();
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return string
	 */
	private static function type(MetaFieldModel $fieldModel)
	{
		switch ($fieldModel->getType()){

			case MetaFieldModel::HTML_TYPE:
			case MetaFieldModel::TEXTAREA_TYPE:
				return WPMLConstants::TYPE_AREA;

			case MetaFieldModel::EDITOR_TYPE:
				return WPMLConstants::TYPE_VISUAL;

			default:
				return WPMLConstants::TYPE_LINE;
		}
	}

	/**
	 * Get a translated string
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $contextId
	 * @param $belongsTo
	 * @param null $find
	 *
	 * @return mixed|void
	 */
	public static function translateString(MetaFieldModel $fieldModel, $contextId, $belongsTo, $find = null)
	{
		return apply_filters( 'wpml_translate_string',
			self::value($fieldModel, $contextId, $belongsTo),
			self::name($fieldModel, $contextId, $belongsTo, $find),
			self::package($fieldModel)
		);
	}

	/**
	 * @param $name
	 * @param $value
	 */
	public static function registerSimpleString($name, $value)
	{
		do_action( 'wpml_register_single_string', WPMLConstants::KIND_NAME, $name, $value);
	}

	/**
	 * @param $original_value
	 * @param $name
	 * @param null $language_code
	 *
	 * @return mixed|void
	 */
	public static function translateSimpleString($original_value, $name, $language_code = null)
	{
		return apply_filters( 'wpml_translate_single_string', $original_value, WPMLConstants::KIND_NAME, $name, $language_code );
	}
}