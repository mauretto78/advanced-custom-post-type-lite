<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Currencies
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
abstract class AbstractUnitOfMeasure
{
	/**
	 * @param $value
	 *
	 * @return string|null
	 */
	public static function getSymbol($value)
	{
		$list = static::getList();

		if(isset($list[$value]) and isset($list[$value]['symbol'])){
			return $list[$value]['symbol'];
		}

		return null;
	}

	/**
	 * @param $value
	 *
	 * @return string|null
	 */
	public static function getFullName($value)
	{
		$list = static::getList();

		if(isset($list[$value]) and isset($list[$value]['name'])){
			return $list[$value]['name'];
		}

		return null;
	}

	/**
	 * @return array
	 */
	public static function getSymbolList()
	{
		$return = [];

		foreach (array_keys(static::getList()) as $item){
			$return[] = [
				"label" => $item,
				"value" => $item,
			];
		}

		return $return;
	}

	/**
	 * @return array
	 */
	abstract public static function getList();
}