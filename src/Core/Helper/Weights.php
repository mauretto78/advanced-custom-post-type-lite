<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Weights
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Weights
{
    /**
     * @return array
     */
    public static function getList()
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
}

