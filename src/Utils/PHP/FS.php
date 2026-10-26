<?php

namespace ACPT_Lite\Utils\PHP;

class FS
{
    /**
     * @param string $dir
     *
     * @return array<string>
     */
    public static function getDirClasses(string $dir): array
    {
        $predeclaredClasses = get_declared_classes();

        try {
            $files = iterator_to_array(new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS | \FilesystemIterator::UNIX_PATHS), true);
            ksort($files);

            foreach ($files as $file) {
                if ($file instanceof \SplFileInfo) {
                    require_once $file->getPathName();
                }
            }

            return array_diff(get_declared_classes(), $predeclaredClasses);
        } catch (\Exception $exception) {
            return [];
        }
    }
}
