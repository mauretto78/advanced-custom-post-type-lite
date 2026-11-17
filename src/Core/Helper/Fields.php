<?php

namespace ACPT_Lite\Core\Helper;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

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

        foreach ($fields as $field) {
            $width = self::fieldWidth($field);

            // A field that doesn't fit starts the next row. It used to be put alone
            // in a row of its own, so with 33% fields (3 x 33 = 99) every row after
            // the first was off by one (#1467)
            if (!empty($sumRows) && $sum + $width > 100) {
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            }

            $sum += $width;
            $sumRows[] = $field;

            if ($sum >= 100) {
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            }
        }

        if (!empty($sumRows)) {
            $rows[] = $sumRows;
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
