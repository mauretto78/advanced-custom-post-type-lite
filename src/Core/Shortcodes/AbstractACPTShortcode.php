<?php

namespace ACPT_Lite\Core\Shortcodes;

use ACPT_Lite\Core\Shortcodes\DTO\ShortcodePayload;
use ACPT_Lite\Core\Shortcodes\Fields\AbstractField;

abstract class AbstractACPTShortcode
{
    /**
     * @param string $type
     * @param ShortcodePayload $payload
     * @return AbstractField
     */
    protected function getField($type, ShortcodePayload $payload)
    {
        $className = 'ACPT_Lite\\Core\\Shortcodes\\Fields\\'.$type.'Field';

        return new $className($payload);
    }
}