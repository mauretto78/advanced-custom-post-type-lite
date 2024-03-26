<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class CopyMetaBoxCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private $boxId;

	/**
	 * @var
	 */
	private $targetGroupId;

	/**
	 * @var bool
	 */
	private $delete;

	/**
	 * CopyMetaBoxCommand constructor.
	 *
	 * @param $data
	 */
	public function __construct($data)
	{
		$validationRules = [
			'boxId' => [
				'required' => true,
				'type' => 'string',
			],
			'targetGroupId' => [
				'required' => true,
				'type' => 'string',
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

		$this->boxId = $data['boxId'];
		$this->targetGroupId = $data['targetGroupId'];
		$this->delete = $data['delete'] ? $data['delete'] : null;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$targetMetaGroup = MetaRepository::get([
			'id' => $this->targetGroupId
		]);

		if(empty($targetMetaGroup)){
			throw new \Exception("Group id not found");
		}

		$metaBox = MetaRepository::getMetaBoxById($this->boxId);
		$duplicatedMetaBox = $metaBox->duplicate();
		$duplicatedMetaBox->changeGroup($targetMetaGroup[0]);

		// avoid duplicated box/field names
		$arrayOfBoxNames = [];
		$arrayOfFieldNames = [];

		foreach ($targetMetaGroup[0]->getBoxes() as $targetMetaBox){
			$arrayOfBoxNames[] = $targetMetaBox->getName();

			foreach ($targetMetaBox->getFields() as $targetField){
				$arrayOfFieldNames[] = $targetField->getName();
			}
		}

		$duplicatedMetaBox->changeName(Strings::getTheFirstAvailableName($duplicatedMetaBox->getName(), $arrayOfBoxNames));

		foreach ($duplicatedMetaBox->getFields() as $duplicatedMetaBoxFieldModel){
			$duplicatedMetaBoxFieldModel->changeName(Strings::getTheFirstAvailableName($duplicatedMetaBoxFieldModel->getName(), $arrayOfFieldNames));
			$arrayOfFieldNames[] = $duplicatedMetaBoxFieldModel->getName();
		}

		ACPT_Lite_DB::startTransaction();

		MetaRepository::saveMetaBox($duplicatedMetaBox);

		if($this->delete){
			MetaRepository::deleteMetaBoxById([
				'id' => $this->boxId,
			]);
		}

		ACPT_Lite_DB::commitTransaction();
	}
}