<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;

abstract class AbstractCopyCommand
{
	/**
	 * @var array
	 */
	private array $metaNames;

	/**
	 * AbstractCopyCommand constructor.
	 */
	public function __construct()
	{
		$names = MetaRepository::getNames();

		foreach ($names['boxes'] as $name){
			$this->metaNames['boxes'][] = $name['name'];
		}

		foreach ($names['fields'] as $name){
			$this->metaNames['fields'][] = $name['name'];
		}

		foreach ($names['blocks'] as $name){
			$this->metaNames['blocks'][] = $name['name'];
		}

		foreach ($names['groups'] as $name){
			$this->metaNames['groups'][] = $name['name'];
		}
	}

	/**
	 * @param MetaBoxModel $boxModel
	 * @param MetaGroupModel $targetMetaGroup
	 *
	 * @return MetaBoxModel
	 */
	protected function copyBox(MetaBoxModel $boxModel, MetaGroupModel $targetMetaGroup)
	{
		$duplicatedMetaBox = $boxModel->duplicate();
		$duplicatedMetaBox->changeGroup($targetMetaGroup);

		$duplicatedMetaBox->changeName(Strings::getTheFirstAvailableName($duplicatedMetaBox->getName(), $this->metaNames['boxes']));
		$this->metaNames['boxes'][] = $duplicatedMetaBox->getName();

		foreach ($duplicatedMetaBox->getFields() as $index => $fieldModel){
			$duplicatedMetaBox->setField($index, $this->copyField($fieldModel, $duplicatedMetaBox));
		}

		return $duplicatedMetaBox;
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 * @param MetaBoxModel $targetBoxModel
	 *
	 * @return MetaFieldModel
	 */
	protected function copyField(MetaFieldModel $fieldModel, MetaBoxModel $targetBoxModel)
	{
		$duplicatedMetaField = $fieldModel->duplicate();
		$duplicatedMetaField->changeBox($targetBoxModel);
		$duplicatedMetaField->changeName(Strings::getTheFirstAvailableName($duplicatedMetaField->getName(), $this->metaNames['fields']));
		$this->metaNames['fields'][] = $duplicatedMetaField->getName();


		return $duplicatedMetaField;
	}
}