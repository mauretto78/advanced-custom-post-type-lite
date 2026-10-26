<?php

namespace ACPT_Lite\Core\Helper;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Arrays;

class Fields
{
    /**
      * @template T of MetaFieldModel
     * @param array<int, T> $fields
     * @return array<int, array<int, T>>
     */
    public static function extractFieldRows(array $fields = [])
    {
        $rows = [];
        $sum = 0;
        $sumRows = [];

        foreach ($fields as $index => $field) {
            $width = self::fieldWidth($field);
            $sum = $sum + $width;
            $sumRows[] = $field;

            if ($sum == 100) {
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            } elseif ($sum > 100) {
                array_pop($sumRows);
                $rows[] = $sumRows;
                $rows[] = [$field];
                $sum = 0;
                $sumRows = [];
            }

            if ($sum > 0 && $index === (Arrays::count($fields)-1)) {
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            }
        }

        return $rows;
    }

    /**
      * @param MetaFieldModel $field
     *
     * @return int
     */
    private static function fieldWidth($field): int
    {
        return $field->getAdvancedOption('width') ? (int)$field->getAdvancedOption('width') : 100;
    }
}
