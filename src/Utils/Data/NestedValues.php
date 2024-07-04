<?php

namespace ACPT_Lite\Utils\Data;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\GeoLocation;

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
	 * @param $block_name
	 * @param array $values
	 *
	 * @return array
	 * @throws \Exception
	 */
	public static function formatBlockValues(MetaFieldModel $meta_field_model, $block_name, $values = [])
	{
		$formattedValues = [];

		if(empty($values)){
			return [];
		}

		foreach ($meta_field_model->getBlocks() as $block_model){
			if($block_model->getName() === $block_name){
				foreach ($block_model->getFields() as $nested_field_model){

					$index = 0;
					foreach ($values as $value){
						foreach ($value as $rawIndex => $raw){

							if(is_numeric($rawIndex) or $nested_field_model->getName() === $rawIndex){
								$type = $nested_field_model->getType();

								if($type === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){

									// nested block inside a block
									foreach ($nested_field_model->getBlocks() as $nested_block_index => $nested_block_model){
										foreach ($nested_block_model->getFields() as $deep_nested_field_model){

											$deep_values = $raw[$nested_block_model->getName()];

											foreach ($deep_values as $deep_index => $deep_value){
												foreach ($deep_value as $raw_deep_index => $deep_raw){
													if(is_numeric($raw_deep_index) or $deep_nested_field_model->getName() === $raw_deep_index){
														$type = $deep_nested_field_model->getType();
														$rawDeepValue = self::getRawValue($type, $deep_raw, $deep_nested_field_model->getName());

														$formattedValues
														[$block_model->getNormalizedName()]
														[$nested_field_model->getNormalizedName()]
														[(int)$rawIndex]
														['blocks']
														[$nested_block_index]
														[$nested_block_model->getNormalizedName()]
														[$deep_nested_field_model->getNormalizedName()]
														[$deep_index] = $rawDeepValue;
													}
												}
											}
										}
									}

								} elseif($type === MetaFieldModel::REPEATER_TYPE){

									// nested repeater inside a block
									$rawValue = self::addOrUpdateRawValue($nested_field_model, [], $raw);
									$formattedValues[$block_model->getNormalizedName()][$nested_field_model->getNormalizedName()][$index] = $rawValue;
								} else {
									$rawValue = self::getRawValue($type, $raw, $nested_field_model->getName());
									$formattedValues[$block_model->getNormalizedName()][$nested_field_model->getNormalizedName()][$index] = $rawValue;
								}
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
     * @param array             $savedValues
     * @param array             $value
     * @param int               $index
     *
     * @return array
     * @throws \Exception
     */
    public static function addOrUpdateRawValue(MetaFieldModel $meta_field_model, $savedValues, $value = [], $index = null)
    {
    	if(empty($value)){
    		return [];
	    }

        /** @var  $child MetaFieldModel */
        foreach ($meta_field_model->getChildren() as $childIndex => $child){

        	$type = $child->getType();
        	$i = 0;

        	foreach ($value as $singleValue){
        		if(isset($singleValue[$child->getName()])){

			        $raw = $singleValue[$child->getName()];

			        if($type === MetaFieldModel::REPEATER_TYPE){

			        	foreach ($raw as $c => $item){

					        $rawValue = self::getRawValue($type, $item, $child->getName());

					        // finally append $rawValue to $values
					        if($index !== null){
						        $savedValues[$child->getNormalizedName()][$index] = $rawValue;
					        } else {
						        $savedValues[$child->getNormalizedName()][$c] = $rawValue;
					        }
				        }

			        } elseif($type === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){

				        $rawValue = [];

			        	foreach ($raw['blocks'] as $block_index => $block){
			        		foreach ($block as $block_name => $block_values){
						        $rawValue['blocks'][(int)$block_index] = self::formatBlockValues($child, $block_name, $block_values);
					        }
				        }

						// finally append $rawValue to $values
				        if($index !== null){
					        $savedValues[$child->getNormalizedName()][$index] = $rawValue;
				        } else {
					        $savedValues[$child->getNormalizedName()][$i] = $rawValue;
				        }

			        } else {
				        $rawValue = self::getRawValue($type, $raw, $child->getName());

				        // finally append $rawValue to $values
				        if($index !== null){
					        $savedValues[$child->getNormalizedName()][$index] = $rawValue;
				        } else {
					        $savedValues[$child->getNormalizedName()][$i] = $rawValue;
				        }
			        }

			        $i++;
		        }
	        }
        }

        return $savedValues;
    }

	/**
	 * @param $type
	 * @param $raw
	 * @param $original_name
	 *
	 * @return array
	 * @throws \Exception
	 */
    private static function getRawValue($type, $raw, $original_name)
    {
	    switch ($type){

		    // ADDRESS_TYPE
		    case MetaFieldModel::ADDRESS_TYPE:
			    $coordinates = GeoLocation::getCoordinates($raw);

			    return [
				    'value' => $raw,
				    'lat' => $coordinates['lat'],
				    'lng' => $coordinates['lng'],
				    'original_name' => $original_name,
				    'type' => $type,
			    ];

		    // CURRENCY_TYPE
		    case MetaFieldModel::CURRENCY_TYPE:
			    return [
				    'currency' => $raw['unit'],
				    'value' => $raw['amount'],
				    'original_name' => $original_name,
				    'type' => $type,
			    ];

		    // LENGTH_TYPE
		    case MetaFieldModel::LENGTH_TYPE:
			    return [
				    'length' => $raw['unit'],
				    'value' => $raw['length'],
				    'original_name' => $original_name,
				    'type' => $type,
			    ];

		    // WEIGHT_TYPE
		    case MetaFieldModel::WEIGHT_TYPE:
			    return [
				    'weight' => $raw['unit'],
				    'value' => $raw['weight'],
				    'original_name' => $original_name,
				    'type' => $type,
			    ];

		    // URL_TYPE
		    case MetaFieldModel::URL_TYPE:
			    return [
				    'label' => $raw['label'] ?? null,
				    'value' => $raw['url'] ?? $raw ?? null,
				    'original_name' => $original_name,
				    'type' => $type,
			    ];

		    default:
			    return [
				    'value' => $raw,
				    'original_name' => $original_name,
				    'type' => $type,
			    ];
	    }
    }
}