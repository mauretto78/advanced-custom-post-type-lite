<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Utils\PHP\Arrays;

/**
 * Class RepeaterDataAggregator
 * @package ACPT_Lite\Utils\Data
 */
class DataAggregator
{
    /**
     * Aggregate saved nested fields
     *
     * @param array<mixed, mixed> $data
     * @return array<int, array<int, array<string, mixed>>>
     */
    public static function aggregateNestedFieldsData(array $data): array
    {
        if (empty($data)) {
            return [];
        }

        $dataToRender = [];
        $keys = array_keys($data);

        $firstKey = $keys[0];
        $firstElement = $data[$firstKey];

        if (empty($firstElement)) {
            return [];
        }

        if (!is_array($firstElement)) {
            return [];
        }

        // filter only numeric indexes
        // (get rid of dirty data)
        $filteredFirstElement = array_filter(array_keys($firstElement), function ($key) {
            return is_numeric($key);
        });

        for ($i=0; $i < Arrays::count($filteredFirstElement); $i++) {
            $element = [];

            foreach (array_keys($data) as $index => $key) {
                $el = [
                        'key' => $key,
                        'type' => isset($data[$key][$i]['type']) ? $data[$key][$i]['type'] : null,
                        'value' => isset($data[$key][$i]['value']) ? $data[$key][$i]['value'] : null,
                    ];

                // Add extra data here
                foreach (ExtraFields::ALLOWED_VALUES as $e) {
                    if (isset($data[$key][$i][$e]) && !isset($el[$e])) {
                        $el[$e] = $data[$key][$i][$e];
                    }
                }

                $element[] = $el;
            }

            $dataToRender[] = $element;
        }

        return $dataToRender;
    }
}
