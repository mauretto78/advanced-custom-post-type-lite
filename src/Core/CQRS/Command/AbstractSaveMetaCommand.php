<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldRelationshipModel;
use ACPT_Lite\Core\Repository\OptionPageRepository;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
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

		// handling files from comment forms
		if(isset($files[$idName])){
			$rawFile = $files[$idName];
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

		} elseif(isset($data[$idName])){
			$rawValue = $data[$idName];

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
				$this->handleRelations($fieldModel, $rawValue, $elementId, $belongsTo);
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

				Meta::save(
					$elementId,
					$belongsTo,
					$idName,
					Sanitizer::sanitizeRawData($fieldModel->getType(), $this->convertMetaDataToDBFormat($value))
				);

				// add coordinates to Address fields
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

				foreach (ExtraFields::ALLOWED_VALUES as $extra){
					if(isset($data[$idName.'_'.$extra])){
						Meta::save(
							$elementId,
							$belongsTo,
							$idName.'_'.$extra,
							Sanitizer::sanitizeRawData(MetaFieldModel::TEXT_TYPE, $data[$idName.'_'.$extra] )
						);
					}
				}
			}

		} else {
			Meta::save(
				$elementId,
				$belongsTo,
				$idName,
				''
			);
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
														if(@$field['type'] === MetaFieldModel::POST_TYPE){
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
							if(@$nestedValue['type'] === MetaFieldModel::POST_TYPE){
								$rawValueToArray = explode(",", $rawValue[$fieldLabel][$index]['value']);
								$rawValue[$fieldLabel][$index]['value'] = $rawValueToArray;
							}

							// post inside a nested repeater
							if(@$nestedValue['type'] === MetaFieldModel::REPEATER_TYPE){
								$key = array_keys($nestedValue)[0];
								$secondLevelNestedValues = $nestedValue[$key];

								foreach ($secondLevelNestedValues as $cindex => $secondLevelNestedValue){
									if(@$rawValue[$fieldLabel][$index][$key][$cindex]['type'] === MetaFieldModel::POST_TYPE){
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
														if(@$field['type'] === MetaFieldModel::POST_TYPE){
															$rawValueToArray = explode(",", $field['value']);
															$rawValue["blocks"][$blockIndex][$fieldName][$fIndex][$cIndex]['value'] = $rawValueToArray;
														}

														// post inside a 2nd level block
														if(isset($field['blocks'])){
															foreach($field['blocks'] as $bblockIndex => $bblockFields){
																foreach($bblockFields as $ffieldName => $ffieldValues){
																	foreach($ffieldValues as $ffIndex => $ffieldValue){
																		foreach($ffieldValue as $ccIndex => $ffield){
																			if(@$ffield['type'] === MetaFieldModel::POST_TYPE){
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

	/**
	 * This function handles the post relationship complex logic
	 * Only works on first level relational field (not for nested fields)
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param string $rawValue
	 * @param string $entityId
	 * @param string $entityType
	 *
	 * @throws \Exception
	 */
	protected function handleRelations(MetaFieldModel $fieldModel, $rawValue, $entityId, $entityType)
	{
		if($fieldModel->getRelations() === null){
			return;
		}

		ACPT_Lite_DB::flushCache();

		$idName = $fieldModel->getDbName();
		$relation = $fieldModel->getRelations()[0];
		$rawValues = explode(",", $rawValue);

		if(empty($rawValue)){
			Meta::delete($entityId, $entityType,$idName);
			Meta::delete($entityId, $entityType,$idName.'_id');
			Meta::delete($entityId, $entityType,$idName.'_type');
		} else {
			Meta::save($entityId, $entityType, $idName, Sanitizer::sanitizeRawData($fieldModel->getType(), $rawValues));
			Meta::save($entityId, $entityType, $idName.'_id', $fieldModel->getId());
			Meta::save($entityId, $entityType, $idName.'_type', MetaFieldModel::POST_TYPE);
		}

		if($relation->getInversedBy()){
			$this->handleInversedRelation($relation, $rawValues, $entityId);
		}
	}

	/**
	 * @param MetaFieldRelationshipModel $relation
	 * @param $rawValues
	 * @param $entityId
	 *
	 * @throws \Exception
	 */
	private function handleInversedRelation(MetaFieldRelationshipModel $relation, $rawValues, $entityId)
	{
		$belongsTo = $relation->to()->getType();
		$inversedFieldModel = $relation->getInversedBy();
		$inversedIdName = $inversedFieldModel->getDbName();
		$savedValues = [];

		foreach ($rawValues as $id){
			if(!empty($id)){
				$getValue = Meta::fetch($id, $belongsTo, $inversedIdName);
				$savedValues = ($getValue !== '' and is_array($getValue)) ? $getValue : [];

				// is a post ID, term ID or user ID
				if(is_numeric($entityId)){
					$savedValues[] = $entityId;
				} elseif(isset($this->optionPageModel)) {
					$savedValues[] = $this->getOptionPage()->getId();
				}

				$savedValues = array_unique($savedValues);

				// If $belongsTo is OPTION_PAGE, then $inversedIdName needs to be prefixed
				if($belongsTo === MetaTypes::OPTION_PAGE){
					$page = OptionPageRepository::getById($id, true);

					if($page !== null){
						$inversedIdName = $page->getMenuSlug().'_'.$inversedIdName;
					}
				}

				Meta::save($id, $belongsTo, $inversedIdName, Sanitizer::sanitizeRawData($inversedFieldModel->getType(), $savedValues));
				Meta::save($id, $belongsTo, $inversedIdName.'_id', $inversedFieldModel->getId());
				Meta::save($id, $belongsTo, $inversedIdName.'_type', $inversedFieldModel->getType());
			}
		}

		// If we are adding elements...
		if(count($savedValues) <= count($rawValues)){
			$this->deleteOrUpdateOtherEntity($inversedIdName, $entityId, $rawValues, MetaTypes::CUSTOM_POST_TYPE);
		}
	}

	/**
	 * Used ONLY for not Multi relations.
	 *
	 * @param $key
	 * @param $entityId
	 * @param $values
	 * @param $metaType
	 *
	 * @throws \Exception
	 */
	private function deleteOrUpdateOtherEntity($key, $entityId, $values, $metaType)
	{
		global $wpdb;

		switch ($metaType){

			case MetaTypes::MEDIA:
			case MetaTypes::CUSTOM_POST_TYPE:

				$sql = "SELECT * FROM `{$wpdb->prefix}postmeta` WHERE meta_key = %s ";
				$results = ACPT_Lite_DB::getResults($sql, [$key]);

				foreach ($results as $result){
					$data = unserialize($result->meta_value);

					if(is_array($data)){
						$entityIndex = array_search($entityId, $data);

						if($entityIndex !== false){
							unset($data[$entityIndex]);
						}

						if(!empty($data)){
							$sql = "UPDATE `{$wpdb->prefix}postmeta` SET meta_value = %s WHERE meta_id = %d";
							ACPT_Lite_DB::executeQueryOrThrowException($sql, [ serialize($data), (int)$result->meta_id ]);
						} else {
							$sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_key LIKE %s";

							if(!empty($values)){
								$sql .= " AND post_id NOT IN ('".implode("','", $values)."')";
							}

							ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $key . '%' ]);
						}
					}
				}

				break;

			case MetaTypes::OPTION_PAGE:

				$sql = "SELECT * FROM `{$wpdb->prefix}options` WHERE option_name = %s ";
				$results = ACPT_Lite_DB::getResults($sql, [$key]);

				foreach ($results as $result){
					$data = unserialize($result->meta_value);
					$entityIndex = array_search($entityId, $data);

					if($entityIndex !== false){
						unset($data[$entityIndex]);
					}

					if(!empty($data)){
						$sql = "UPDATE `{$wpdb->prefix}options` SET option_value = %s WHERE option_id = %d";
						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ serialize($data), (int)$result->meta_id ]);
					} else {
						$sql = "DELETE FROM `{$wpdb->prefix}options` WHERE option_name LIKE %s";

						if(!empty($values)){
							$sql .= " AND term_id NOT IN ('".implode("','", $values)."')";
						}

						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $key . '%' ]);
					}
				}

				break;

			case MetaTypes::TAXONOMY:

				$sql = "SELECT * FROM `{$wpdb->prefix}termmeta` WHERE meta_key = %s ";
				$results = ACPT_Lite_DB::getResults($sql, [$key]);

				foreach ($results as $result){
					$data = unserialize($result->meta_value);
					$entityIndex = array_search($entityId, $data);

					if($entityIndex !== false){
						unset($data[$entityIndex]);
					}

					if(!empty($data)){
						$sql = "UPDATE `{$wpdb->prefix}termmeta` SET meta_value = %s WHERE meta_id = %d";
						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ serialize($data), (int)$result->meta_id ]);
					} else {
						$sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE meta_key LIKE %s";

						if(!empty($values)){
							$sql .= " AND term_id NOT IN ('".implode("','", $values)."')";
						}

						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $key . '%' ]);
					}
				}

				break;

			case MetaTypes::USER:

				$sql = "SELECT * FROM `{$wpdb->prefix}usermeta` WHERE meta_key = %s ";
				$results = ACPT_Lite_DB::getResults($sql, [$key]);

				foreach ($results as $result){
					$data = unserialize($result->meta_value);
					$entityIndex = array_search($entityId, $data);

					if($entityIndex !== false){
						unset($data[$entityIndex]);
					}

					if(!empty($data)){
						$sql = "UPDATE `{$wpdb->prefix}usermeta` SET meta_value = %s WHERE umeta_id = %d";
						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ serialize($data), (int)$result->meta_id ]);
					} else {
						$sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE meta_key LIKE %s";

						if(!empty($values)){
							$sql .= " AND user_id NOT IN ('".implode("','", $values)."')";
						}

						ACPT_Lite_DB::executeQueryOrThrowException($sql, [ $key . '%' ]);
					}
				}

				break;
		}
	}
}