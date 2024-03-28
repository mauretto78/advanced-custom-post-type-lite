<?php

namespace ACPT_Lite\Utils;

class FS
{
	/**
	 * @param $dir
	 *
	 * @return array
	 */
	public static function getDirClasses($dir)
	{
		$predeclaredClasses = get_declared_classes();

		try {
			$files = iterator_to_array(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS | \FilesystemIterator::UNIX_PATHS), true);
			ksort($files);

			foreach ($files as $file){
				require_once $file->getPathName();
			}

			return array_diff(get_declared_classes(), $predeclaredClasses);
		} catch (\Exception $exception){
			return [];
		}
	}
}