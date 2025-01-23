<?php

namespace ACPT_Lite\Core\JSON;

use ACPT_Lite\Utils\Data\Normalizer;

abstract class AbstractJSONSchema
{
    /**
     * @return array
     */
    abstract function toArray();

    /**
     * @return \stdClass
     */
    public function toObject()
    {
        return Normalizer::arrayToObject(static::toArray());
    }
}
