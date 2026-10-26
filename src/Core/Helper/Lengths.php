<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Lengths
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Lengths extends AbstractUnitOfMeasure
{
    /**
     * @return array<string, array{name: string, symbol: string}>
     */
    public static function getList(): array
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

    public static function getDefaultSymbol(): string
    {
        return 'KILOMETER';
    }

    public static function getDefaultValue(): string
    {
        return 'KI';
    }
}
