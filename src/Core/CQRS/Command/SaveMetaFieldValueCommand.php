<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Utils\Data\Sanitizer;

class SaveMetaFieldValueCommand extends AbstractMetaFieldValueCommand implements CommandInterface
{
	/**
	 * @inheritDoc
	 * @throws \Exception
	 */
	public function execute()
	{
		$metaFieldModelType = $this->fieldModel->getType();
		$savedFieldType = $this->get($this->fieldModel->getDbName().'_type');
		$value = $this->args['value'];

		if($metaFieldModelType != $savedFieldType){
			if(!$this->set($this->fieldModel->getDbName().'_type', $metaFieldModelType)){
				return false;
			}
		}

		switch ($metaFieldModelType){

			case MetaFieldModel::SELECT_TYPE:
			
				if(in_array($value, $this->fieldModel->getOptionValues())){
					$savedFieldValue = $this->get( $this->fieldModel->getDbName());
					if($savedFieldValue != $value){
						if(!$this->set( $this->fieldModel->getDbName(), Sanitizer::sanitizeRawData($metaFieldModelType, $value))){
							return false;
						}
					}
			
					return true;
				}
			
				return false;

			// Default behaviour
			default:
				$savedFieldValue = $this->get($this->fieldModel->getDbName());
				if($savedFieldValue != $value){
					if(!$this->set( $this->fieldModel->getDbName(), Sanitizer::sanitizeRawData($metaFieldModelType, $value))){
						return false;
					}
				}
		}

		return true;
	}
}