<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Core\Repository\MetaRepository;

class SaveFormFieldsCommand implements CommandInterface
{
	/**
	 * @var string
	 */
	private string $id;

	/**
	 * @var array
	 */
	private array $data;

	/**
	 * SaveFormFieldsCommand constructor.
	 *
	 * @param string $id
	 * @param array $data
	 */
	public function __construct($id, array $data)
	{
		$this->id = $id;
		$this->data = $data;
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function execute(): string
	{
		$formModel = FormRepository::getById($this->id);

		if($formModel === null){
			throw new \Exception("Form with id ".$this->id." does not exists");
		}

		$formModel->resetFields();

		foreach ($this->data as $fieldIndex => $field){

			$metaFieldModel = null;
			if(isset($field['metaFieldId']) and $field['metaFieldId'] !== null){
				$metaFieldModel = MetaRepository::getMetaFieldById($field['metaFieldId']);
			}

			$fieldModel = FormFieldModel::hydrateFromArray([
				'id' => $field['id'],
				'metaField' => $metaFieldModel,
				'group' => $field['group'],
				'key' => $field['key'],
				'name' => $field['name'],
				'label' => $field['label'],
				'type' => $field['type'],
				'description' => $field['description'],
				'isRequired' => (bool)$field['isRequired'],
				'extra' => $field['extra'],
				'settings' => $field['settings'],
				'sort' => ($fieldIndex+1),
			]);

			if(isset($field['validationRules']) and !empty($field['validationRules'])){
				foreach ($field['validationRules'] as $ruleIndex => $rule){

					$validationRuleModel = ValidationRuleModel::hydrateFromArray([
						'id' => $rule['id'],
						'condition' => $rule['condition'],
						'value' => $rule['value'],
						'message' => $rule['message'],
						'sort' => ($ruleIndex+1),
					]);

					$fieldModel->addValidationRule($validationRuleModel);
				}
			}

			$formModel->addField($fieldModel);
		}

		FormRepository::save($formModel);

		return $formModel->getId();
	}
}