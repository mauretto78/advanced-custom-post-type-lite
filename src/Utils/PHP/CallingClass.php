<?php

namespace ACPT_Lite\Utils\PHP;

class CallingClass
{
    /**
     * @see https://gist.github.com/hamstar/1122679
     * @return string|null
     */
    public static function get(): ?string
    {
        //get the trace
        $trace = debug_backtrace();

        if (!isset($trace[1]['class'])) {
            return null;
        }

        // Get the class that is asking for who awoke it
        $class = $trace[1]['class'];

        // +1 to i cos we have to account for calling this function
        for ($i=1; $i<count($trace); $i++) {
            if (isset($trace[$i]['class']) && $class != $trace[$i]['class']) {
                return $trace[$i]['class'];
            }
        }

        return null;
    }
}
