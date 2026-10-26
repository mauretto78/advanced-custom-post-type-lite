<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Weights
 *
 * @since      1.0.0
 * @package    acpt-lite
 * @subpackage acpt-lite/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Weights extends AbstractUnitOfMeasure
{
    /**
     * @return array<string, array{name: string, symbol: string}>
     */
    public static function getList(): array
    {
        return [
            'GRAM' => [
                    'name'   => 'gram',
                    'symbol' => 'g',
            ],
            'KILOGRAM' => [
                    'name'   => 'kilogram',
                    'symbol' => 'kg',
            ],
            'MILLIGRAM' => [
                    'name'   => 'milligram',
                    'symbol' => 'mg',
            ],
            'OUNCE' => [
                    'name'   => 'ounce',
                    'symbol' => 'oz',
            ],
            'POUND' => [
                    'name'   => 'pound',
                    'symbol' => 'lb',
            ],
            'GRAIN' => [
                    'name'   => 'grain',
                    'symbol' => 'gr',
            ],
        ];
    }

    /**
     * @return string
     */
    public static function getDefaultSymbol(): string
    {
        return 'g';
    }

    /**
     * @return string
     */
    public static function getDefaultValue(): string
    {
        return 'GRAM';
    }
}
