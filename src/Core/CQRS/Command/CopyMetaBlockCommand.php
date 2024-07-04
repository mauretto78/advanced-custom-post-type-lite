<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class CopyMetaBlockCommand implements CommandInterface
{
	/**
	 * @var mixed
	 */
	private $targetFieldId;

	/**
	 * @var mixed
	 */
	private $blockId;

	/**
	 * @var mixed|null
	 */
	private $delete;

	/**
	 * CopyMetaBlockCommand constructor.
	 *
	 * @param $data
	 */
	public function __construct($data)
	{
		$validationRules = [
			'targetFieldId' => [
				'required' => true,
				'type' => 'string',
			],
			'blockId' => [
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

		$this->targetFieldId = $data['targetFieldId'];
		$this->blockId       = $data['blockId'];
		$this->delete        = $data['delete'] ? $data['delete'] : null;
	}

	/**
	 * @return mixed|void
	 * @throws \Exception
	 */
	public function execute()
	{
		$blockModel = MetaRepository::getMetaBlockById($this->blockId);

		if(empty($blockModel)){
			throw new \Exception("Meta block id not found");
		}

		$targetFieldModel = MetaRepository::getMetaFieldById($this->targetFieldId);

		if($targetFieldModel === null){
			throw new \Exception("Target field not found");
		}

		$arrayOfBlockNames = [];

		foreach (MetaRepository::getNames()['blocks'] as $blockName){
			$arrayOfBlockNames[] = $blockName['name'];
		}

		$duplicatedMetaBlock = $blockModel->duplicateFrom($targetFieldModel);
		$duplicatedMetaBlock->changeName(Strings::getTheFirstAvailableName($duplicatedMetaBlock->getName(), $arrayOfBlockNames));

		ACPT_Lite_DB::startTransaction();

		MetaRepository::saveMetaBlock($duplicatedMetaBlock);

		if($this->delete){
			MetaRepository::deleteMetaBlock($this->blockId);
		}

		ACPT_Lite_DB::commitTransaction();
	}
}