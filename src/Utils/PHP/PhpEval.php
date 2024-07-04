<?php

namespace ACPT_Lite\Utils\PHP;

class PhpEval
{
    /**
     * Substitutes PHP eval()
     *
     * @param $phpCode
     *
     * @return mixed
     */
    public static function evaluate($phpCode)
    {
        $tmpfname = tempnam("/tmp", "PhpEval");
        $handle = fopen($tmpfname, "w+");
        fwrite($handle,  $phpCode);
        fclose($handle);
        $php = include $tmpfname;
        unlink($tmpfname);

        return $php;
    }
}