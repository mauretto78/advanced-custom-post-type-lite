<?php

namespace ACPT_Lite\Utils\PHP;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;

class Arrays
{
	/**
	 * @param array $array
	 * @param $indexString
	 *
	 * @return mixed|null
	 */
	public static function valueFromIndex(array $array, $indexString)
	{
		$indexArray = str_replace(["]","["], ".", $indexString);
		$indexArray = explode(".", $indexArray );

		$next = null;
		$prev = $array;

		foreach ( $indexArray as $key ) {
			self::valueFromIndexPipeline($key, $prev, $next);
		}

		return $next;
	}

	/**
	 * @param $key
	 * @param $prev
	 * @param $next
	 */
	private static function valueFromIndexPipeline($key, &$prev, &$next)
	{
		if(is_numeric($key)){
			$key = (int)$key;
		}

		if(!isset($prev[$key])){
			$prev = null;
			$next = null;
		} else {
			$next = $prev[$key];
			$prev = $prev[$key];
		}
	}

	/**
	 * @see https://gist.github.com/ArneGockeln/d2b210456770d306407ff3b6fe9a8cbc
	 * @param string|int $needle
	 * @param string $key
	 * @param array $haystack
	 *
	 * @return bool|string
	 */
	public static function path($needle, $key, array $haystack)
	{
		foreach ( $haystack as $k => $value ) {
			if ( $value == $needle && $key == $k ) {
				return null;
			} else if ( is_array( $value ) ) {
				// multi search
				$key_result = self::path( $needle, $key, $value );
				if ( $key_result !== false ) {
					$return = '';
					$return .= '['.$k.']';
					$return .= $key_result;

					return $return;
				}
			}
		}

		return false;
	}

	/**
	 * Reindex an indexed array
	 *
	 * @param $array
	 * @return array
	 */
	public static function reindex($array)
	{
		$index = 0;
		$return = [];

		foreach ($array as $key => $value) {
			if (is_string($key)) {
				$newKey = $key;
			} else {
				$newKey = $index;
				++$index;
			}

			$return[$newKey] = is_array($value) ? self::reindex($value) : $value;
		}

		// Sort alphabetically, numeric first then alpha
		ksort($return, SORT_NATURAL);

		return $return;
	}

	/**
	 * @param $array
	 * @param $columnName
	 * @param $value
	 *
	 * @return false|int|string
	 */
	public static function findIndex($array, $columnName, $value)
	{
		return array_search($value, array_column($array, $columnName));
	}

	/**
	 * @param array $array
	 * @param string $prefix
	 *
	 * @return string
	 */
	public static function toPlainText($array, $prefix = '')
	{
		$arrayFlat = self::arrayFlat($array, $prefix);
		$arrayToPlainText = '';

		foreach ($arrayFlat as $key => $value){
			$arrayToPlainText .= "'".$key."': '".$value."'";

			if($key !== array_key_last($arrayFlat)){
				$arrayToPlainText .= ', ';
			}
		}

		return $arrayToPlainText;
	}

	/**
	 * @param $array
	 * @param string $prefix
	 *
	 * @return array
	 */
	public static function arrayFlat($array, $prefix = '')
	{
		$result = array();

		foreach ($array as $key => $value)
		{
			$new_key = $prefix . (empty($prefix) ? '' : '.') . $key;

			if (is_array($value))
			{
				$result = array_merge($result, self::arrayFlat($value, $new_key));
			}
			else
			{
				$result[$new_key] = $value;
			}
		}

		return $result;
	}

	/**
	 * This function removes duplicated entities in an array
	 *
	 * @param AbstractModel[] $models
	 *
	 * @return array
	 */
	public static function arrayUniqueOfEntities(array $models = [])
	{
		$unique = [];

		foreach ($models as $index => $model){
			if(!in_array($model->getId(), $unique)) {
				$unique[] = $model->getId();
			} else {
				unset($models[$index]);
			}
		}

		return $models;
	}

	/**
	 * @param array $array
	 * @param $uniqueKey
	 *
	 * @return array
	 */
	public static function arrayUniqueByKey(array $array, $uniqueKey)
	{
		$unique = [];

		foreach ($array as $index => $entry){
			if(!in_array($entry[$uniqueKey], $unique)) {
				$unique[] = $entry[$uniqueKey];
			} else {
				unset($array[$index]);
			}
		}

		return $array;
	}
}