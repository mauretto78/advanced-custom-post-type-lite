<?php

namespace ACPT_Lite\Core\Validators;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\PHP\Assert;

class MetaDataValidator
{
	/**
	 * @param string $type
	 * @param mixed $rawData
	 * @param bool $isRequired
	 */
	public static function validate($type, $rawData, $isRequired = false)
	{
		if($isRequired){
			Assert::notEmpty($rawData);
		}

		if(!$isRequired and empty($rawData)){
			return;
		}

		switch ($type){
			case MetaFieldModel::COLOR_TYPE:
				Assert::color($rawData);
				break;

			case MetaFieldModel::CHECKBOX_TYPE:
			case MetaFieldModel::LIST_TYPE:
			case MetaFieldModel::SELECT_MULTI_TYPE:
				foreach ($rawData as $item){
					Assert::string($item);
				}
				break;

			case MetaFieldModel::CURRENCY_TYPE:
			case MetaFieldModel::LENGTH_TYPE:
			case MetaFieldModel::NUMBER_TYPE:
			case MetaFieldModel::USER_TYPE:
			case MetaFieldModel::WEIGHT_TYPE:
				Assert::numeric($rawData);
				break;

			case MetaFieldModel::DATE_TIME_TYPE:
			case MetaFieldModel::DATE_TYPE:
				Assert::date($rawData);
				break;

			case MetaFieldModel::EMAIL_TYPE:
				Assert::email($rawData);
				break;

			case MetaFieldModel::IMAGE_TYPE:
				Assert::url($rawData);
				break;

			case MetaFieldModel::URL_TYPE:

				if(isset($rawData['label'])){
					Assert::string($rawData['label']);
				}

				if(isset($rawData['url'])){
					Assert::url($rawData['url']);
				}

				break;

			case MetaFieldModel::GALLERY_TYPE:
				foreach ($rawData as $image){
					Assert::url($image);
				}
				break;

			case MetaFieldModel::POST_TYPE:
				if(is_array($rawData)){
					foreach ($rawData as $rawDatum){

						// can be an id or uuid (for pages)
						try {
							Assert::numeric($rawDatum);
						} catch (\Exception $exception){
							Assert::uuid($rawDatum);
						}
					}
				} else {
					$rawData = explode(",", $rawData);
					if(is_array($rawData)){
						foreach ($rawData as $rawDatum){

							// can be an id or uuid (for pages)
							try {
								Assert::numeric($rawDatum);
							} catch (\Exception $exception){
								Assert::uuid($rawDatum);
							}
						}
					}
				}

				break;

			case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
				foreach ($rawData as $blockRawData){
					foreach ($blockRawData as $nestedFieldsRawData){
						foreach ($nestedFieldsRawData as $nestedRawData){
							if(is_string($nestedRawData)){
								self::validate(MetaFieldModel::TEXT_TYPE, $nestedRawData);
							} elseif(is_array($nestedRawData) and isset($nestedRawData['type']) and is_array($nestedRawData['type'])){
								foreach ($nestedRawData['type'] as $nestedIndex => $nestedType){
									$nestedValue = @$nestedRawData['value'][$nestedIndex];

									if(isset($nestedValue) and !empty($nestedValue)){
										self::validate($nestedType, $nestedValue);
									}
								}
							}
						}
					}
				}
				break;

			case MetaFieldModel::REPEATER_TYPE:
				foreach ($rawData as $fieldRawData){
					foreach ($fieldRawData as $nestedRawData){
						if(is_array($nestedRawData) and is_array($nestedRawData['type'])){
							foreach ($nestedRawData['type'] as $nestedIndex => $nestedType){
								$nestedValue = @$nestedRawData['value'][$nestedIndex];

								if(isset($nestedValue) and !empty($nestedValue)){
									self::validate($nestedType, $nestedValue);
								}
							}
						}
					}
				}
				break;

            case MetaFieldModel::CLONE_TYPE:
                foreach ($rawData as $fieldRawData){
                    if(isset( $fieldRawData['type']) and isset( $fieldRawData['value'])){
                        self::validate($fieldRawData['type'], $fieldRawData['value']);
                    }
                }
                break;

			case MetaFieldModel::POST_OBJECT_MULTI_TYPE:
			case MetaFieldModel::TERM_OBJECT_MULTI_TYPE:
			case MetaFieldModel::USER_MULTI_TYPE:
				foreach ($rawData as $itemId){
					Assert::numeric($itemId);
				}
				break;

			default:
				Assert::string($rawData);
		}
	}
}