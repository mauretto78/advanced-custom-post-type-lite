<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormMetadataModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\Repository\FormRepository;
use ACPT_Lite\Core\Repository\MetaRepository;

class SaveFormCommand implements CommandInterface
{
	/**
	 * @var array
	 */
	private array $data;

	/**
	 * @var bool
	 */
	private bool $emptyItems;

	/**
	 * SaveMetaGroupCommand constructor.
	 *
	 * @param array $data
	 * @param bool $emptyItems
	 */
	public function __construct(array $data, $emptyItems = false)
	{
		$this->data = $data;
		$this->emptyItems = $emptyItems;
	}

	/**
	 * @return string
	 * @throws \Exception
	 */
	public function execute(): string
	{
		$data = $this->data;
		$id = (isset($data['id'])) ? $data['id'] : Uuid::v4();

		$formModel = FormModel::hydrateFromArray([
			'id'   => $id,
			'name' => @$data['name'],
			'action' => @$data['action'],
			'label' => $data['label'] ? (string)$data['label'] : null,
			'key' => $data['key'] ? (string)$data['key'] : Strings::randomString(8),
		]);

		if(isset($data['meta'])){
			$metadata = $data['meta'];

			foreach ($metadata as $metadatum){
				$formMetadataModel = FormMetadataModel::hydrateFromArray([
					'formId' => $id,
					'key' => @$metadatum['key'],
					'value' => @$metadatum['value']
				]);

				$formModel->addMetadata($formMetadataModel);
			}
		}

		// inject fields
		if(isset($data['fields']) and !empty($data['fields'])){
			foreach($data['fields'] as $fieldIndex => $field){

				$metaFieldModel = null;
				if(isset($field['metaFieldId']) and $field['metaFieldId'] !== null){
					$metaFieldModel = MetaRepository::getMetaFieldById($field['metaFieldId']);
				}

				if(isset($field['meta_field_id']) and $field['meta_field_id'] !== null){
					$metaFieldModel = MetaRepository::getMetaFieldById($field['meta_field_id']);
				}

				$isRequired = $field['isRequired'] ?? $field['is_required'];

				$fieldModel = FormFieldModel::hydrateFromArray([
					'id' => @$field['id'],
					'metaField' => $metaFieldModel,
					'group' => @$field['group'],
					'key' => @$field['key'],
					'name' => @$field['name'],
					'label' => @$field['label'],
					'type' => @$field['type'],
					'description' => @$field['description'],
					'isRequired' => (bool)@$isRequired,
					'extra' => $field['extra'] ?? [],
					'settings' => $field['settings'] ?? [],
					'sort' => ($fieldIndex+1),
				]);

				if(isset($field['validationRules']) and !empty($field['validationRules'])){
					foreach ($field['validationRules'] as $ruleIndex => $rule){

						$validationRuleModel = ValidationRuleModel::hydrateFromArray([
							'id' => @$rule['id'],
							'condition' => @$rule['condition'],
							'value' => @$rule['value'],
							'message' => @$rule['message'],
							'sort' => ($ruleIndex+1),
						]);

						$fieldModel->addValidationRule($validationRuleModel);
					}
				}

				$formModel->addField($fieldModel);
			}
		} elseif($this->emptyItems === false) {
			// otherwise hydrate with saved fields
			$savedForm = FormRepository::getById($id);
			if($savedForm !== null and !empty($savedForm->getFields())){
				foreach ($savedForm->getFields() as $field){
					$formModel->addField($field);
				}
			}
		}

		FormRepository::save($formModel);

		return $id;
	}
}