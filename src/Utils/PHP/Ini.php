<?php

namespace ACPT_Lite\Utils\PHP;

class Ini
{
	/**
	 * @param $file
	 *
	 * @return array|null
	 */
	public static function read($file)
	{
		if(!file_exists($file)){
			return null;
		}

		$read = parse_ini_file($file, true);

		if(is_array($read)){
			return $read;
		}

		return null;
	}

	/**
	 * @param array $array
	 * @param $file
	 */
	public static function write($array, $file)
	{
		$res = [];

		foreach($array as $key => $val) {
			if(is_array($val)) {
				$res[] = "[$key]";
				foreach($val as $skey => $sval) {
					$res[] = "$skey = ".(is_numeric($sval) ? $sval : '"'.$sval.'"');
				}
			} else {
				$res[] = "$key = ".(is_numeric($val) ? $val : '"'.$val.'"');
			}
		}

		self::safeFileRewrite($file, implode("\r\n", $res));
	}

	/**
	 * @param $fileName
	 * @param $dataToSave
	 */
	private static function safeFileRewrite($fileName, $dataToSave)
	{
		if ($fp = fopen($fileName, 'w')) {
			$startTime = microtime(TRUE);

			do{ $canWrite = flock($fp, LOCK_EX);
				if(!$canWrite) usleep(round(rand(0, 100)*1000));
			} while ((!$canWrite)and((microtime(TRUE)-$startTime) < 5));

			if ($canWrite) {
				fwrite($fp, $dataToSave);
				flock($fp, LOCK_UN);
			}

			fclose($fp);
		}
	}
}