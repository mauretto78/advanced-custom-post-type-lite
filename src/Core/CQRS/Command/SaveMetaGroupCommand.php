<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Constants\MetaGroupDisplay;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\PHP\Sluggify;

class SaveMetaGroupCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveMetaGroupCommand constructor.
	 *
	 * @param array $data
	 */
	public function __construct(array $data)
	{
		$this->data = $data;
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function execute(): string
	{
		$validator = new ArgumentsArrayValidator();

		if(!$validator->validate(MetaGroupModel::validationRules(), $this->data)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}

		// Avoid any name duplicate
		$allNames = MetaRepository::getNames();

		$data = $this->data;
		$arrayOfGroupNames = [];
		$arrayOfBoxNames = [];
		$arrayOfFieldNames = [];
		$arrayOfBlockNames = [];
		$ids = [];

		foreach ($allNames['groups'] as $group){
			if(isset($data['id']) and $group['id'] !== $data['id']){
				$arrayOfGroupNames[] = $group['name'];
			}
		}

		$groupName  = Sluggify::slug($data['name']);

		if(isset($data['id'])){
			$groupId = $data['id'];
		} elseif($savedGroup = MetaRepository::get([
			'groupName' => $groupName,
		])){
			if(count($savedGroup) === 1){
				$groupId = $savedGroup[0]->getId();
			} else {
				$groupId = Uuid::v4();
			}
		} else {
			$groupId = Uuid::v4();
		}

		if(isset($savedGroup) and count($savedGroup) === 1 and isset($data['new_name'])){
			$groupName  = Sluggify::slug($data['new_name']);
		}

		if(isset($savedGroup) and count($savedGroup) === 1 and isset($data['newName'])){
			$groupName  = Sluggify::slug($data['newName']);
		}

		$groupLabel  = isset($data['label']) ? $data['label'] : null;
		$boxes  = isset($data['boxes']) ? $data['boxes'] : [];
		$belongs = isset($data['belongs']) ? $data['belongs'] : [];

		foreach ($boxes as $b){
			foreach ($allNames['boxes'] as $box){
				if(isset($b['id']) and $b['id'] !== $box['id']){
					$arrayOfBoxNames[] = $box['name'];
				}
			}

			if(isset($b['fields']) and is_array($b['fields'])){
				$this->recursiveSetArrayOfFieldNames($b['fields'], $allNames, $arrayOfFieldNames, $arrayOfBlockNames);
			}
		}

		$ids[$groupId] = [
			'belongs' => [],
			'boxes' => [],
			'fields' => [],
			'options' => [],
			'visibilityConditions' => [],
			'validationRules' => [],
			'relations' => [],
			'blocks' => [],
		];

		$groupModel = MetaGroupModel::hydrateFromArray([
			'id' => $groupId,
			'name' => $groupName,
			'label' => $groupLabel,
			'display' => ($data['display'] ?? MetaGroupDisplay::STANDARD),
		]);

		if(isset($data['priority']) and !empty($data['priority'])){
			$groupModel->setPriority($data['priority']);
		}

		if(isset($data['context']) and !empty($data['context'])){
			$groupModel->setContext($data['context']);
		}

		if(empty($groupModel->getContext())){
			$groupModel->setContext('advanced');
		}

		if(empty($groupModel->getPriority())){
			$groupModel->setPriority('default');
		}

		$groupModel->changeName(Strings::getTheFirstAvailableName($groupModel->getName(), $arrayOfGroupNames));

		// belongs
		foreach ($belongs as $belongIndex => $belong){

		    // @TODO saving in cache

			$belongsTo = $belong['belongsTo'] ?? $belong['belongs_to'];

			if(!empty($belongsTo)){
				$belongModel = BelongModel::hydrateFromArray([
					'id' => (isset($belong['id']) ? $belong['id'] : Uuid::v4()),
					'belongsTo' => @$belongsTo,
					'operator' => @$belong['operator'],
					'find' => (is_array($belong['find']) ? implode(",", $belong['find']) : $belong['find']),
					'logic' => (isset($belong['logic']) ? $belong['logic'] : null),
					'sort' => ($belongIndex+1),
				]);

				$groupModel->addBelong($belongModel);
				$ids[$groupId]['belongs'][] = $belongModel->getId();
			}
		}

		// boxes
		foreach ($boxes as $boxIndex => $box){

			$boxName = Sluggify::slug($box['name']);

			if(isset($box['id'])){
				$boxId = $box['id'];
			} elseif($savedBox = MetaRepository::getMetaBoxByName($boxName)){
				$boxId = $savedBox->getId();
			} else {
				$boxId = Uuid::v4();
			}

			if(isset($savedBox) and isset($box['new_name'])){
				$boxName = Sluggify::slug($box['new_name']);
			}

			if(isset($savedBox) and isset($box['newName'])){
				$boxName = Sluggify::slug($box['newName']);
			}

			$boxModel = MetaBoxModel::hydrateFromArray([
				'id' => $boxId,
				'group' => $groupModel,
				'name' => $boxName,
				'sort' => ($boxIndex+1),
				'label' => @$box['label'],
			]);

			$ids[$groupId]['boxes'][] = $boxModel->getId();

			// fields
			foreach ($box['fields'] as $fieldIndex => $field) {

				$this->validateField($validator, $field);

				$fieldName = Sluggify::slug($field['name']);

				if(isset($field['id'])){
					$fieldId = $field['id'];
				} elseif($savedField = MetaRepository::getMetaFieldByName([
					'fieldName' => $fieldName,
					'boxName' => $boxName,
				])){
					$fieldId = $savedField->getId();
				} else {
					$fieldId = Uuid::v4();
				}

				if(isset($savedField) and isset($field['new_name'])){
					$fieldName = Sluggify::slug($field['new_name']);
				}

				if(isset($savedField) and isset($field['newName'])){
					$fieldName = Sluggify::slug($field['newName']);
				}

				$field['id'] = $fieldId;
				$field['sort'] = ($fieldIndex+1);
				$field['name'] = $fieldName;

				$fieldModel = MetaFieldModel::fullHydrateFromArray($boxModel, $fieldIndex, $field, $arrayOfFieldNames, $arrayOfBlockNames);
				$this->appendIdsOfFieldModel($groupId, $fieldModel, $ids);
				$boxModel->addField($fieldModel);

				$ids[$groupId]['fields'][] = $fieldModel->getId();
			}

			$arrayOfBoxNames = array_filter($arrayOfBoxNames, function($el) use ($boxModel) {
				return ($el !== $boxModel->getName());
			});

			$boxModel->changeName(Strings::getTheFirstAvailableName($boxModel->getName(), $arrayOfBoxNames));
			$arrayOfBoxNames[] = $boxModel->getName();

			$groupModel->addBox($boxModel);
		}

		MetaRepository::saveMetaGroup($groupModel);

		// remove orphans
		MetaRepository::removeMetaOrphans([
			'groupId' => $groupModel->getId(),
			'ids' => $ids[$groupId]
		]);

		// remove orphan blocks
		MetaRepository::removeOrphanBlocks();

		// remove orphan visibility conditions
		MetaRepository::removeOrphanVisibilityConditions();

		return $groupId;
	}

	/**
	 * @param $fields
	 * @param $allNames
	 * @param $arrayOfFieldNames
	 * @param $arrayOfBlockNames
	 */
	private function recursiveSetArrayOfFieldNames($fields, $allNames, &$arrayOfFieldNames, &$arrayOfBlockNames)
	{
		if(is_array($fields) and !empty($fields)){
			foreach ($fields as $field){

				$fieldNamesCopy = [];
				$this->getAllFieldNames($field, $fieldNamesCopy);

				if(isset($allNames['fields']) and is_array($allNames['fields']) and !empty($allNames['fields']) and !empty($fieldNamesCopy)){

					$diff = [];
					foreach ($allNames['fields'] as $index => $allNamesField){
						if (is_array($fieldNamesCopy) and isset($fieldNamesCopy[$index])){
							$diff[] = array_diff($allNames['fields'][$index], $fieldNamesCopy[$index]);
						}
					}

					$diff = Arrays::reindex($diff);
					$arrayOfFieldNames = array_merge($arrayOfFieldNames, $diff);
				}

				$blockNamesCopy = [];
				$this->getAllBlockNames($field, $blockNamesCopy);

				if(isset($allNames['blocks']) and is_array($allNames['blocks']) and !empty($allNames['blocks']) and !empty($fieldNamesCopy)){

					$diff = [];
					foreach ($allNames['blocks'] as $index => $allNamesField){
						if (is_array($fieldNamesCopy) and isset($fieldNamesCopy[$index])){
							$diff[] = array_diff($allNames['blocks'][$index], $fieldNamesCopy[$index]);
						}
					}

					$diff = Arrays::reindex($diff);
					$arrayOfBlockNames = array_merge($arrayOfBlockNames, $diff);
				}
			}
		}
	}

	/**
	 * @param $field
	 * @param $fieldNames
	 */
	private function getAllFieldNames($field, &$fieldNames)
	{
		if(isset($field['id'])){
			$fieldNames[] = [
				'id' => $field['id'],
				'name' => $field['name'],
			];
		}

		if(!empty($field['children'])){
			foreach ($field['children'] as $child){
				$this->getAllFieldNames($child, $fieldNames);
			}
		}

		if(!empty($field['blocks'])){
			foreach ($field['blocks'] as $block){
				if(!empty($block['fields'])){
					foreach ($block['fields'] as $child){
						$this->getAllFieldNames($child, $fieldNames);
					}
				}
			}
		}
	}

	/**
	 * @param $field
	 * @param $blockNames
	 */
	private function getAllBlockNames($field, &$blockNames)
	{
		if(!empty($field['blocks'])){
			foreach ($field['blocks'] as $block){
				if(isset($block['id'])){
					$blockNames[] = [
						'id' => $block['id'],
						'name' => $block['name'],
					];
				}

				if(!empty($block['fields'])){
					foreach ($block['fields'] as $child){
						$this->getAllBlockNames($child, $blockNames);
					}
				}
			}
		}
	}


	/**
	 * @param $groupId
	 * @param MetaFieldModel $fieldModel
	 * @param $ids
	 *
	 * @throws \Exception
	 */
	private function appendIdsOfFieldModel($groupId, MetaFieldModel $fieldModel, &$ids)
	{
		foreach ($fieldModel->getOptions() as $option){
			$ids[$groupId]['options'][] = $option->getId();
		}

		foreach ($fieldModel->getVisibilityConditions() as $condition){
			$ids[$groupId]['visibilityConditions'][] = $condition->getId();
		}

		foreach ($fieldModel->getValidationRules() as $rule){
			$ids[$groupId]['validationRules'][] = $rule->getId();
		}

		foreach ($fieldModel->getChildren() as $child){
			$ids[$groupId]['fields'][] = $child->getId();
			$this->appendIdsOfFieldModel($groupId, $child, $ids);
		}

		foreach ($fieldModel->getBlocks() as $block){
			$ids[$groupId]['blocks'][] = $block->getId();
			foreach ($block->getFields() as $child){
				$ids[$groupId]['fields'][] = $child->getId();
				$this->appendIdsOfFieldModel($groupId, $child, $ids);
			}
		}

		foreach ($fieldModel->getRelations() as $relation){
			$ids[$groupId]['relations'][] = $relation->getId();

			if($relation->getInversedBy()){
				$inversedRelation = MetaRepository::findInversedRelation($relation);

				if($inversedRelation){
					$ids[$groupId]['relations'][] = $inversedRelation->getId();
				}
			}
		}
	}

	/**
	 * @param ArgumentsArrayValidator $validator
	 * @param array $field
	 */
	private function validateField(ArgumentsArrayValidator $validator, array $field = [])
	{
		if(!$validator->validate(MetaFieldModel::validationRules(), $field)){
			throw new \InvalidArgumentException($validator->errorMessage());
		}
	}
}