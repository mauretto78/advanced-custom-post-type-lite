<?php

namespace ACPT_Lite\Core\Helper;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class Fields
{
    /**
     * @param MetaFieldModel[] $fields
     *
     * @return array
     */
    public static function extractFieldRows($fields)
    {
        $rows = [];
        $sum = 0;
        $sumRows = [];

        /** @var MetaFieldModel $field */
        foreach($fields as $index => $field){

            $width = $field->getAdvancedOption('width') ? $field->getAdvancedOption('width') : 100;
            $sum = $sum + $width;
            $sumRows[] = $field;

            if($sum == 100){
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            } elseif($sum > 100){
                array_pop($sumRows);
                $rows[] = $sumRows;
                $rows[] = [$field];
                $sum = 0;
                $sumRows = [];
            }

            if($sum > 0 and $index === (count($fields)-1)){
                $rows[] = $sumRows;
                $sum = 0;
                $sumRows = [];
            }
        }

        return $rows;
    }
}