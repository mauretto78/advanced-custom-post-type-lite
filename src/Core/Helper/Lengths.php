<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Lengths
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Lengths extends AbstractUnitOfMeasure
{
    /**
     * @return array
     */
    public static function getList()
    {
        return [
            'KILOMETER' => [
                    'name'   => 'kilometer',
                    'symbol' => 'km',
            ],
            'METER' => [
                    'name'   => 'meters',
                    'symbol' => 'm',
            ],
            'CENTIMETER' => [
                    'name'   => 'centimeter',
                    'symbol' => 'cm',
            ],
            'MILLIMETER' => [
                    'name'   => 'millimeter',
                    'symbol' => 'mm',
            ],
            'FOOT' => [
                    'name'   => 'foot',
                    'symbol' => 'ft',
            ],
            'INCH' => [
                    'name'   => 'inches',
                    'symbol' => 'in',
            ],
            'MILE' => [
                    'name'   => 'mile',
                    'symbol' => 'mile',
            ],
            'YARD' => [
                    'name'   => 'yard',
                    'symbol' => 'yd',
            ],
        ];
    }
}

