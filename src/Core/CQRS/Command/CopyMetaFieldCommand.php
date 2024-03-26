<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use Exception;

class CopyMetaFieldCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $fieldId;

	/**
	 * @var string
	 */
	private $targetEntityId;

	/**
	 * @var string
	 */
	private $targetEntityType;

	/**
	 * @var bool
	 */
	private $delete;

	/**
	 * CopyMetaFieldCommand constructor.
	 *
	 * @param $data
	 */
	public function __construct($data)
	{
		$validationRules = [
			'fieldId' => [
				'required' => true,
				'type' => 'string',
			],
			'targetEntityId' => [
				'required' => true,
				'type' => 'string',
			],
			'targetEntityType' => [
				'required' => true,
				'type' => 'string',
				'enum' => [
					'box',
					'field',
				]
			],
			'delete' => [
				'required' => false,
				'type' => 'boolean',
			],
		];

		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate($validationRules, $data)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}

		$this->fieldId = $data['fieldId'];
		$this->targetEntityType = $data['targetEntityType'];
		$this->targetEntityId = $data['targetEntityId'];
		$this->delete = $data['delete'] ? $data['delete'] : null;
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function execute()
	{
		$metaBoxField = MetaRepository::getMetaFieldById($this->fieldId);

		if(empty($metaBoxField)){
			throw new Exception('Meta field was not found. If you haven\'t saved the field yet, please SAVE it and then try to copy.');
		}

		$duplicatedMetaField = $metaBoxField->duplicate();

		switch ($this->targetEntityType){
			case "field":
				$targetFieldModel = MetaRepository::getMetaFieldById($this->targetEntityId);

				if(empty($targetFieldModel)){
					throw new Exception('Target meta field was not found');
				}

				$duplicatedMetaField->changeBox($targetFieldModel->getBox());

				switch ($targetFieldModel->getType()){
					case MetaFieldModel::FLEXIBLE_CONTENT_TYPE:
						$duplicatedMetaField->setBlockId($targetFieldModel->getBlockId());
						break;

					case MetaFieldModel::REPEATER_TYPE:
						$duplicatedMetaField->setParentId($targetFieldModel->getId());
						break;
				}

				$this->saveMetaField($duplicatedMetaField);

				break;

			case "box":
				$targetBoxModel = MetaRepository::getMetaBoxById($this->targetEntityId);

				if(empty($targetBoxModel)){
					throw new Exception('Target meta box was not found');
				}

				$duplicatedMetaField->changeBox($targetBoxModel);

				// avoid duplicated box/field names
				$arrayOfFieldNames = [];

				foreach ($targetBoxModel->getFields() as $fieldModel){
					$arrayOfFieldNames[] = $fieldModel->getName();
				}

				$duplicatedMetaField->changeName(Strings::getTheFirstAvailableName($duplicatedMetaField->getName(), $arrayOfFieldNames));
				$this->saveMetaField($duplicatedMetaField);

				break;
		}
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws Exception
	 */
	private function saveMetaField(MetaFieldModel $fieldModel)
	{
		ACPT_Lite_DB::startTransaction();

		MetaRepository::saveMetaBoxField($fieldModel);

		if($this->delete){
			MetaRepository::deleteMetaField($this->fieldId);
		}

		ACPT_Lite_DB::commitTransaction();
	}
}