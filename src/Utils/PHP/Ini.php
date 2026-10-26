<?php

namespace ACPT_Lite\Utils\PHP;

class Ini
{
    /**
     * @param string $file
     *
     * @return array<mixed>|null
     */
    public static function read($file)
    {
        if (!file_exists($file)) {
            return null;
        }

        $read = parse_ini_file($file, true);

        if (is_array($read)) {
            return $read;
        }

        return null;
    }

    /**
     * @param array<mixed> $array
     * @param string $file
     * @return void
     */
    public static function write($array, $file)
    {
        $res = [];

        foreach ($array as $key => $val) {
            if (is_array($val)) {
                $res[] = "[$key]";
                foreach ($val as $skey => $sval) {
                    $res[] = "$skey = ".(is_numeric($sval) ? $sval : '"'.$sval.'"');
                }
            } else {
                $res[] = "$key = ".(is_numeric($val) ? $val : '"'.$val.'"');
            }
        }

        self::safeFileRewrite($file, implode("\r\n", $res));
    }

    /**
     * @param string $fileName
     * @param string $dataToSave
     * @return void
     */
    private static function safeFileRewrite($fileName, $dataToSave)
    {
        if ($fp = fopen($fileName, 'w')) {
            $startTime = microtime(true);

            do {
                $canWrite = flock($fp, LOCK_EX);
                if (!$canWrite) {
                    usleep((int)round(rand(0, 100)*1000));
                }
            } while ((!$canWrite)&&((microtime(true)-$startTime) < 5));

            if ($canWrite) {
                fwrite($fp, $dataToSave);
                flock($fp, LOCK_UN);
            }

            fclose($fp);
        }
    }
}
