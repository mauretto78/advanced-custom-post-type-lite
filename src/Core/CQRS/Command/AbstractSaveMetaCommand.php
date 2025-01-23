<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Checker\ValidationRulesChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\GeoLocation;
use ACPT_Lite\Utils\PHP\Session;
use ACPT_Lite\Utils\Wordpress\Files;
use ACPT_Lite\Utils\Wordpress\Transient;

abstract class AbstractSaveMetaCommand
{
	/**
	 * @var array
	 */
	protected $data;

	/**
	 * @var array
	 */
	protected $files;

	/**
	 * AbstractSaveMetaCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data = [])
	{
		$this->data = $data;
		$this->files = [];
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @return bool
	 */
	protected function hasField(MetaFieldModel $fieldModel)
	{
	    $key = $fieldModel->getDbName();

	    if($this->WooCommerceLoopIndex !== null){
            $key .= "_".$this->WooCommerceLoopIndex;
        }

	    $key .= "_id";

		return (
			isset($this->data[$key]) and
			$this->data[$key] === $fieldModel->getId()
		);
	}

	/**
	 * Save a meta field
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param string|int $elementId
	 * @param string $belongsTo
	 *
	 * @throws \Exception
	 */
	protected function saveField(MetaFieldModel $fieldModel, $elementId, $belongsTo)
	{
		$data = $this->data;
		$idName = $fieldModel->getDbName();

		$key = $idName;

        if($this->WooCommerceLoopIndex !== null){
            $key .= "_".$this->WooCommerceLoopIndex;
        }

		// handling files from comment forms
        if(isset($this->files[$key])){
			$rawFile = $this->files[$key];

			if(!empty($rawFile['tmp_name'])){
				$fileUploaded = Files::uploadFile($rawFile['tmp_name'], $rawFile['name']);

				if($fileUploaded !== false){
					$fileUploadedUrl = $fileUploaded['url'];
					$fileUploadedId  = $fileUploaded['attachmentId'];

					Meta::save(
						$elementId,
						$belongsTo,
						$idName,
						$fileUploadedUrl
					);

					Meta::save(
						$elementId,
						$belongsTo,
						$idName.'_id',
						$fileUploadedId
					);

					Meta::save(
						$elementId,
						$belongsTo,
						$idName.'_type',
						$fieldModel->getType()
					);
				}
			}

		} elseif(isset($data[$key])){
			$rawValue = $data[$key];

			// validation
			try {
				MetaDataValidator::validate($fieldModel->getType(), $rawValue, $fieldModel->isRequired());
			} catch (\Exception $exception){
				wp_die('There was an error during saving data. The error is: ' . $exception->getMessage());
			}

			// validation against rules
			if($fieldModel !== null and !empty($fieldModel->getValidationRules())){
				$validationRulesChecker = new ValidationRulesChecker($rawValue, $fieldModel->getValidationRules());
				$validationRulesChecker->validate();

				if(!$validationRulesChecker->isValid()){

					$errors = [];

					foreach ($validationRulesChecker->getErrors() as $error){
						$errors[] = $error;
					}

					Session::set(AbstractField::ERRORS_SESSION_KEY, [
						$fieldModel->getId() => $errors
					]);

					return;
				}
			}

			if($fieldModel->getType() === MetaFieldModel::POST_TYPE){
				$command = new HandleRelationsCommand($fieldModel, $rawValue, $elementId, $belongsTo);
				$command->execute();
			} else {

				$value = $rawValue;

				if(is_array($value)){

					if($fieldModel->getType() === MetaFieldModel::REPEATER_TYPE){

						$minimumElements = isset($data[$idName.'_min_blocks']) ? $data[$idName.'_min_blocks'] : null;
						$maximumElements = isset($data[$idName.'_max_blocks']) ? $data[$idName.'_max_blocks'] : null;
						$numberOfElements = count(array_values($value)[0]);

						if($minimumElements and ($numberOfElements < $minimumElements )){
							wp_die('There was an error during saving data. Minimum number of elements is : ' . $minimumElements);
						}

						if($maximumElements and ($numberOfElements > $maximumElements )){
							wp_die('There was an error during saving data. Maximum number of elements is : ' . $maximumElements);
						}

						foreach ($value as $blockName => $fields){
							$value[$blockName] = Arrays::reindex($fields);
						}

					} elseif($fieldModel->getType() === MetaFieldModel::FLEXIBLE_CONTENT_TYPE){

						$minimumBlocks = isset($data[$idName.'_min_blocks']) ? $data[$idName.'_min_blocks'] : null;
						$maximumBlocks = isset($data[$idName.'_max_blocks']) ? $data[$idName.'_max_blocks'] : null;
						$numberOfBlocks = count($value);

						if($minimumBlocks and ($numberOfBlocks < $minimumBlocks )){
							wp_die('There was an error during saving data. Minimum number of blocks is : ' . $minimumBlocks);
						}

						if($maximumBlocks and ($numberOfBlocks > $maximumBlocks )){
							wp_die('There was an error during saving data. Maximum number of blocks is : ' . $maximumBlocks);
						}

						foreach ($value as $blockName => $fields){
							$value[$blockName] = Arrays::reindex($fields);
						}
					} else {
						$value = Arrays::reindex($value);
					}
				}

                if($fieldModel->getType() === MetaFieldModel::PASSWORD_TYPE){
                    $algo = $fieldModel->getAdvancedOption("algorithm") ?? PASSWORD_DEFAULT;

                    switch ($algo){
                        default:
                        case "PASSWORD_DEFAULT":
                            $value = password_hash($value, PASSWORD_DEFAULT);
                            break;
                        case "PASSWORD_BCRYPT":
                            $value = password_hash($value, PASSWORD_BCRYPT);
                            break;
                        case "PASSWORD_ARGON2I":
                            $value = password_hash($value, PASSWORD_ARGON2I);
                            break;
                        case "PASSWORD_ARGON2ID":
                            $value = password_hash($value, PASSWORD_ARGON2ID);
                            break;
                    }
                }

				Meta::save(
					$elementId,
					$belongsTo,
					$idName,
					Sanitizer::sanitizeRawData($fieldModel->getType(), $this->convertMetaDataToDBFormat($value))
				);

				// Address field: add coordinates
				if($fieldModel->getType() === MetaFieldModel::ADDRESS_TYPE){
					$address = Sanitizer::sanitizeRawData($fieldModel->getType(), $this->convertMetaDataToDBFormat($value));

					if(
						!empty($address) and
						empty($data[$idName.'_lat']) and
						empty($data[$idName.'_lng'])
					){
						$coordinates = GeoLocation::getCoordinates($address);
						$data[$idName.'_lat'] = $coordinates['lat'];
						$data[$idName.'_lng'] = $coordinates['lng'];

						if(empty($data[$idName.'_city'])){
							$city = GeoLocation::getCity($coordinates['lat'], $coordinates['lng']);

							if(!empty($city)){
								$data[$idName.'_city'] = $city;
							}
						}
					}
				}

				// Image fields: set post thumbnail
				if(
					$fieldModel->getType() === MetaFieldModel::IMAGE_TYPE and
					$fieldModel->getAdvancedOption('set_thumbnail') == 1 and
					$belongsTo === MetaTypes::CUSTOM_POST_TYPE
				){
					if(isset($data[$idName.'_attachment_id']) and !empty($data[$idName.'_attachment_id'])){
						set_post_thumbnail( (int)$elementId, (int)$data[$idName.'_attachment_id'] );
					} else {
						delete_post_meta( (int)$elementId, '_thumbnail_id' );
					}
				}

				// Term fields: sync terms with current post
				if(
					($fieldModel->getType() === MetaFieldModel::TERM_OBJECT_TYPE or $fieldModel->getType() === MetaFieldModel::TERM_OBJECT_MULTI_TYPE) and
					$fieldModel->getAdvancedOption('sync_taxonomy') == 1 and
					$belongsTo === MetaTypes::CUSTOM_POST_TYPE
				){
					if(!is_array($value)){
						$value = [$value];
					}

					$terms = [];
					$taxonomy = null;

					foreach ($value as $termId){
						if(!empty($termId)){
							$term = get_term($termId);

							if($term instanceof \WP_Term){
								$terms[] = $term->name;
								$taxonomy = $term->taxonomy;
							}
						}
					}

					if(!empty($terms) and !empty($taxonomy)){
						wp_set_post_terms( (int)$elementId, $terms, $taxonomy );
					}
				}

				// Extra fields
				foreach (ExtraFields::ALLOWED_VALUES as $extra){
					if(isset($data[$key.'_'.$extra])){
						Meta::save(
							$elementId,
							$belongsTo,
							$idName.'_'.$extra,
							Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $data[$key.'_'.$extra] )
						);
					}
				}
			}

		} else {

			// blank the field only if it already exists
			$metaFieldToBeBlanked = Meta::fetch($elementId, $belongsTo, $idName);

			if($metaFieldToBeBlanked !== null){
				Meta::save(
					$elementId,
					$belongsTo,
					$idName,
					''
				);
			}
		}

		if(!empty($errors)){
			Transient::set( "acpt_plugin_error_msg_".$elementId, $errors, 60 );
			add_filter( 'redirect_post_location', [$this, 'addNoticeQueryVar'], 99 );
		}
	}

	/**
	 * This function normalize the raw data before saving in DB.
	 * Is needed to convert relationship values from strings (1,37,47) to arrays [1, 37, 47]
	 *
	 * @param $rawValue
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	protected function convertMetaDataToDBFormat($rawValue)
	{
		if(is_array($rawValue)){
			foreach ($rawValue as $fieldLabel => $fieldValue){
				if(is_array($fieldValue)){

					foreach ($fieldValue as $index => $nestedValue){

						// post inside a nested block
						if(isset($nestedValue['blocks']) and is_array($nestedValue['blocks'])){
							foreach($nestedValue['blocks'] as $blockIndex => $blockFields){
								if(is_array($blockFields)){
									foreach($blockFields as $fieldName => $fieldValues){
										if(is_array($fieldValues)){
											foreach($fieldValues as $fIndex => $fieldValue){
												if(is_array($fieldValue)){
													foreach($fieldValue as $cIndex => $field){
														if(isset($field['type']) and $field['type'] === MetaFieldModel::POST_TYPE){
															$rawValueToArray = explode(",", $field['value']);
															$rawValue[$fieldLabel][$index]["blocks"][$blockIndex][$fieldName][$fIndex][$cIndex]['value'] = $rawValueToArray;
														}
													}
												}
											}
										}
									}
								}
							}
						} elseif(isset($nestedValue['original_name'])){

							// post inside a repeater
							if(isset($nestedValue['type']) and $nestedValue['type'] === MetaFieldModel::POST_TYPE){
								$rawValueToArray = explode(",", $rawValue[$fieldLabel][$index]['value']);
								$rawValue[$fieldLabel][$index]['value'] = $rawValueToArray;
							}

							// post inside a nested repeater
							if(isset($nestedValue['type']) and $nestedValue['type'] === MetaFieldModel::REPEATER_TYPE){
								$key = array_keys($nestedValue)[0];
								$secondLevelNestedValues = $nestedValue[$key];

								foreach ($secondLevelNestedValues as $cindex => $secondLevelNestedValue){
									if(isset($rawValue[$fieldLabel][$index][$key][$cindex]['type']) and $rawValue[$fieldLabel][$index][$key][$cindex]['type'] === MetaFieldModel::POST_TYPE){
										$rawValueToArray = explode(",", $rawValue[$fieldLabel][$index][$key][$cindex]['value']);
										$rawValue[$fieldLabel][$index][$key][$cindex]['value'] = $rawValueToArray;
									}
								}
							}
						}
					}

					// post inside a block
					if($fieldLabel === 'blocks'){
						if(is_array($fieldValue)){
							foreach($fieldValue as $blockIndex => $blockFields){
								if(is_array($blockFields)){
									foreach($blockFields as $fieldName => $fieldValues){
										if(is_array($fieldValues)){
											foreach($fieldValues as $fIndex => $fieldValue){
												if(is_array($fieldValue)){
													foreach($fieldValue as $cIndex => $field){
														if(isset($field['type']) and $field['type'] === MetaFieldModel::POST_TYPE){
															$rawValueToArray = explode(",", $field['value']);
															$rawValue["blocks"][$blockIndex][$fieldName][$fIndex][$cIndex]['value'] = $rawValueToArray;
														}

														// post inside a 2nd level block
														if(isset($field['blocks'])){
															foreach($field['blocks'] as $bblockIndex => $bblockFields){
																foreach($bblockFields as $ffieldName => $ffieldValues){
																	foreach($ffieldValues as $ffIndex => $ffieldValue){
																		foreach($ffieldValue as $ccIndex => $ffield){
																			if(isset($ffield['type']) and $ffield['type'] === MetaFieldModel::POST_TYPE){
																				$rawValueToArray = explode(",", $ffield['value']);
																				$rawValue["blocks"][$blockIndex][$fieldName][$fIndex][$cIndex]["blocks"][$bblockIndex][$ffieldName][$ffIndex][$ccIndex]['value'] = $rawValueToArray;
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return $rawValue;
	}
}