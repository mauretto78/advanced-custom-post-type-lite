<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class NestedValues
{
    /**
     * This returns sometimes like that:
     *
     * [
     *      "block" => [
     *            "text" => [
     *                  0 => [...],
     *                  1 => [...]
     *              ],
     *          "url" => [
     *              0 => [...],
     *              1 => [...]
     *          ]
     *      ]
     * ]
     *
     * @param MetaFieldModel $meta_field_model
     * @param string $block_name
     * @param array<mixed> $values
     *
     * @return array<mixed>
     * @throws \Exception
     */
    public static function formatBlockValues(MetaFieldModel $meta_field_model, string $block_name, array $values = [])
    {
        $formattedValues = [];

        if (empty($values)) {
            return [];
        }

        foreach ($meta_field_model->getBlocks() as $block_model) {
            if ($block_model->getName() === $block_name) {
                foreach ($block_model->getFields() as $nested_field_model) {
                    $index = 0;
                    foreach ($values as $value) {
                        foreach ($value as $rawIndex => $raw) {
                            if (is_numeric($rawIndex) || $nested_field_model->getName() === $rawIndex) {
                                $type = $nested_field_model->getType();
                                $rawValue = self::getRawValue($type, $raw, $nested_field_model->getName());
                                $formattedValues[$block_model->getNormalizedName()][$nested_field_model->getNormalizedName()][$index] = $rawValue;
                            }
                        }

                        $index++;
                    }
                }
            }
        }

        return $formattedValues;
    }

    /**
     * This function adds or update a raw value ($value) in the $values array (representation of DB)
     * Used both by add_acpt_meta_field_row_value and edit_acpt_meta_field_row_value functions.
     * It returns the updated $values array
     *
     * @param MetaFieldModel $meta_field_model
     * @param array<mixed>   $savedValues
     * @param array<mixed>   $value
     * @param int|null       $index
     *
     * @return array<mixed>
     * @throws \Exception
     */
    public static function addOrUpdateRawValue(MetaFieldModel $meta_field_model, array $savedValues, array $value = [], ?int $index = null)
    {
        if (empty($value)) {
            return [];
        }

        foreach ($meta_field_model->getChildren() as $childIndex => $child) {
            $type = $child->getType();
            $i = 0;

            foreach ($value as $singleValue) {
                if (isset($singleValue[$child->getName()])) {
                    $raw = $singleValue[$child->getName()];
                    $rawValue = self::getRawValue($type, $raw, $child->getName());
                    // finally append $rawValue to $values
                    if ($index !== null) {
                        $savedValues[$child->getNormalizedName()][$index] = $rawValue;
                    } else {
                        $savedValues[$child->getNormalizedName()][$i] = $rawValue;
                    }

                    $i++;
                }
            }
        }

        return $savedValues;
    }

    /**
     * @param string $type
     * @param mixed  $raw
     * @param string $original_name
     *
     * @return array<mixed>
     * @throws \Exception
     */
    private static function getRawValue(string $type, $raw, string $original_name)
    {
        switch ($type) {

            default:
                return [
                    'value' => $raw,
                    'original_name' => $original_name,
                    'type' => $type,
                ];
        }
    }
}
