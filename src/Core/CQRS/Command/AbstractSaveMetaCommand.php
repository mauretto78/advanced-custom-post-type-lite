<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\ExtraFields;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Validators\MetaDataValidator;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\Data\Sanitizer;
use ACPT_Lite\Utils\PHP\Arrays;
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

			$value = $rawValue;

			if(is_array($value)){
				$value = Arrays::reindex($value);
			}

			Meta::save(
				$elementId,
				$belongsTo,
				$idName,
				Sanitizer::sanitizeRawData($fieldModel->getType(), $this->convertMetaDataToDBFormat($value))
			);

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
}