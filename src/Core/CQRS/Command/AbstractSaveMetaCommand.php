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

            $value = $rawValue;

            if(is_array($value)){
                $value = Arrays::reindex($value);
            }

            Meta::save(
                $elementId,
                $belongsTo,
                $idName,
                Sanitizer::sanitizeRawData($fieldModel->getType(), $value)
            );

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
}