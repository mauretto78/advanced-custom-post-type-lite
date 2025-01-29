<?php

namespace ACPT_Lite\Core\Generators\Attachment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Generators\Meta\Fields\AbstractField;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;

class AttachmentMetaFieldGenerator extends AbstractGenerator
{
	/**
	 * @var MetaFieldModel
	 */
	private MetaFieldModel $fieldModel;

	/**
	 * @var
	 */
	private $attachmentId;

	/**
	 * AttachmentMetaFieldGenerator constructor.
	 *
	 * @param MetaFieldModel $fieldModel
	 * @param $attachmentId
	 */
	public function __construct(MetaFieldModel $fieldModel, $attachmentId)
	{
		$this->fieldModel = $fieldModel;
		$this->attachmentId = $attachmentId;
	}

	/**
	 * @return AbstractField|null
	 */
	public function generate()
	{
		return $this->getAttachmentMetaField();
	}

	/**
	 * @return AbstractField|null
	 */
	private function getAttachmentMetaField()
	{
		$className = 'ACPT_Lite\\Core\\Generators\\Meta\\Fields\\'.$this->fieldModel->getType().'Field';

		if(class_exists($className)){
			/** @var AbstractField $instance */
			$instance = new $className($this->fieldModel, MetaTypes::MEDIA, $this->attachmentId);

			return $instance;
		}

		return null;
	}
}