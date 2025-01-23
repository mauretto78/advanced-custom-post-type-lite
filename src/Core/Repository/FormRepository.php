<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\Form\FormFieldModel;
use ACPT_Lite\Core\Models\Form\FormMetadataModel;
use ACPT_Lite\Core\Models\Form\FormModel;
use ACPT_Lite\Core\Models\Form\FormSubmissionModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\ValueObjects\FormSubmissionDatumObject;
use ACPT_Lite\Core\ValueObjects\FormSubmissionErrorObject;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class FormRepository extends AbstractRepository
{
	/**
	 * @return int
	 */
	public static function count(): int
	{
		$baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."`
            WHERE 1 = 1
            ";

		$results = ACPT_Lite_DB::getResults($baseQuery);

		return (int)$results[0]->count;
	}

	/**
	 * @param $id
	 *
	 * @throws \Exception
	 */
	public static function delete($id)
	{
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` WHERE id = %s;", [$id]);
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA)."` WHERE form_id = %s;", [$id]);
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)."` WHERE form_id = %s;", [$id]);
		ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_SUBMISSION)."` WHERE form_id = %s;", [$id]);
		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $args
	 *
	 * @return FormModel[]
	 * @throws \Exception
	 */
	public static function get($args): array
	{
		$mandatoryKeys = [
			'id' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'formName' => [
				'required' => false,
				'type' => 'string',
			],
			'page' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'perPage' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'sortedBy' => [
				'required' => false,
				'type' => 'string',
			],
			'lazy' => [
				'required' => false,
				'type' => 'boolean',
			],
		];

		self::validateArgs($mandatoryKeys, $args);

		$id = isset($args['id']) ? $args['id'] : null;
		$formName = isset($args['formName']) ? $args['formName'] : null;
		$lazy = isset($args['lazy']) ? $args['lazy'] : false;
		$page = isset($args['page']) ? $args['page'] : false;
		$perPage = isset($args['perPage']) ? $args['perPage'] : null;

		$formQueryArgs = [];
		$formQuery = "
	        SELECT 
                f.id, 
                f.form_name as name,
                f.label,
                f.form_action as `action`,
                f.form_key as `key`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` f
            WHERE 1 = 1
	    ";

		if($id !== null){
			$formQuery .= " AND f.id = %s";
			$formQueryArgs[] = $id;
		}

		if($formName !== null){
			$formQuery .= " AND f.form_name = %s";
			$formQueryArgs[] = $formName;
		}

		$formQuery .= ' GROUP BY f.id ORDER BY f.form_name ASC';

		if(isset($page) and isset($perPage)){
			$formQuery .= " LIMIT ".$perPage." OFFSET " . ($perPage * ($page - 1));
		}

		$forms = ACPT_Lite_DB::getResults($formQuery, $formQueryArgs);
		$formModels = [];

		foreach ($forms as $form){
			$formModels[] = self::hydrateForm($form);
		}

		return $formModels;
	}

    /**
     * @return string[]
     */
    public static function getNames()
    {
        $names = [];
        $query = "
	        SELECT 
                f.id, 
                f.form_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` f
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element){
            $names[] = $element->name;
        }

        return $names;
    }

    /**
     * @return string[]
     */
    public static function getFieldNames()
    {
        $names = [];
        $query = "
	        SELECT 
                f.id, 
                f.field_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)."` f
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element){
            $names[] = $element->name;
        }

        return $names;
    }

	/**
	 * @param $key
	 *
	 * @return FormModel|null
	 * @throws \Exception
	 */
	public static function getByKey($key): ?FormModel
	{
		$formQuery = "
	        SELECT 
                f.id, 
                f.form_name as name,
                f.label,
                f.form_action as `action`,
                f.form_key as `key`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` f
            WHERE form_key = %s
	    ";

		$forms = ACPT_Lite_DB::getResults($formQuery, [$key]);

		if(count($forms) !== 1){
			return null;
		}

		return self::hydrateForm($forms[0]);
	}

	/**
	 * @param $id
	 *
	 * @return FormModel|null
	 * @throws \Exception
	 */
	public static function getById($id): ?FormModel
	{
		$formQuery = "
	        SELECT 
                f.id, 
                f.form_name as name,
                f.label,
                f.form_action as `action`,
                f.form_key as `key`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` f
            WHERE id = %s
	    ";

		$forms = ACPT_Lite_DB::getResults($formQuery, [$id]);

		if(count($forms) !== 1){
			return null;
		}

		return self::hydrateForm($forms[0]);
	}

	/**
	 * @param $form
	 *
	 * @return FormModel
	 * @throws \Exception
	 */
	private static function hydrateForm($form)
	{
		$formModel = FormModel::hydrateFromArray([
			'id'       => $form->id,
			'name'     => $form->name,
			'label'    => $form->label,
			'action'   => $form->action,
			'key'      => $form->key,
		]);

		$metadataQuery = "
		        SELECT 
	                m.id, 
	                m.meta_key as `key`,
	                m.meta_value as `value`
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA)."` m
	            WHERE form_id = %s
		    ";

		$metaData = ACPT_Lite_DB::getResults($metadataQuery, [$form->id]);

		foreach ($metaData as $metaDatum){
			$metaDataModel = FormMetadataModel::hydrateFromArray([
				'id'       => $metaDatum->id,
				'formId'   => $form->id,
				'value'    => $metaDatum->value,
				'key'      => $metaDatum->key,
			]);

			$formModel->addMetadata($metaDataModel);
		}

		$fieldsQuery = "
	        SELECT 
                f.id, 
                f.field_group as `group`, 
                f.field_name as `name`,
                f.field_label as `label`,
                f.field_key as `key`,
                f.field_type as `type`,
                f.meta_field_id, 
                f.description,
                f.extra,
                f.settings,
                f.required,
                f.sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)."` f
            WHERE form_id = %s 
            ORDER BY f.sort
	    ";

		$fields = ACPT_Lite_DB::getResults($fieldsQuery, [$form->id]);
		foreach ($fields as $field){
			$fieldModel = self::hydrateFormField($field);
			$formModel->addField($fieldModel);
		}

		return $formModel;
	}

	/**
	 * @param $field
	 *
	 * @return FormFieldModel
	 * @throws \Exception
	 */
	private static function hydrateFormField($field)
	{
		$fieldModel = null;
		if($field->meta_field_id !== null){
			$fieldModel = MetaRepository::getMetaFieldById($field->meta_field_id);
		}

		$fieldModel = FormFieldModel::hydrateFromArray([
			'id' => @$field->id,
			'metaField' => $fieldModel,
			'key' => @$field->key,
			'group' => @$field->group,
			'name' => @$field->name,
			'label' => @$field->label,
			'type' => @$field->type,
			'description' => @$field->description,
			'isRequired' => (bool)@$field->required,
			'extra' => unserialize(@$field->extra),
			'settings' => unserialize(@$field->settings),
			'sort' => @$field->sort,
		]);

		$validationRules = ACPT_Lite_DB::getResults("
            SELECT
                v.id,
                v.rule_condition as `condition`,
                v.rule_value as `value`,
                v.message as `message`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."` v
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FORM_FIELD_PIVOT)."` vp ON vp.rule_id = v.id
            WHERE vp.field_id = %s
            ORDER BY v.sort
        ;", [$field->id]);

		foreach ($validationRules as $ruleIndex => $validationRule){
			$validationRuleModel = ValidationRuleModel::hydrateFromArray([
				'id' => $validationRule->id,
				'condition' => $validationRule->condition,
				'value' => $validationRule->value,
				'message' => $validationRule->message,
				'sort' => ($ruleIndex+1),
			]);

			$fieldModel->addValidationRule($validationRuleModel);
		}

		return $fieldModel;
	}

	/**
	 * @param FormModel $formModel
	 *
	 * @throws \Exception
	 */
	public static function save(FormModel $formModel): void
	{
		ACPT_Lite_DB::startTransaction();

		try {
			$fieldIds = [];
			$validationRuleIds = [];

			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM)."` 
	            (`id`,
	            `form_name`,
	            `label`,
	            `form_action`,
	            `form_key`
	            ) VALUES (
	                %s,
	                %s,
	                %s,
	                %s,
	                %s
	            ) ON DUPLICATE KEY UPDATE 
	                `form_name` = %s,
	                `label` = %s,
	                `form_action` = %s,
	                `form_key` = %s
	        ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$formModel->getId(),
				$formModel->getName(),
				$formModel->getLabel(),
				$formModel->getAction(),
				$formModel->getKey(),
				$formModel->getName(),
				$formModel->getLabel(),
				$formModel->getAction(),
				$formModel->getKey()
			]);

			ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA)."` WHERE form_id = %s;", [$formModel->getId()]);

			// metadata
			foreach ($formModel->getMeta() as $metadataModel){

				$sql = "
		            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_METADATA)."` 
		            (`id`,
		            `form_id`,
		            `meta_key`,
		            `meta_value`
		            ) VALUES (
		                %s,
		                %s,
		                %s,
		                %s
		            ) ON DUPLICATE KEY UPDATE 
		                `form_id` = %s,
		                `meta_key` = %s,
		                `meta_value` = %s
		        ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metadataModel->getId(),
					$formModel->getId(),
					$metadataModel->getKey(),
					$metadataModel->getValue(),
					$formModel->getId(),
					$metadataModel->getKey(),
					$metadataModel->getValue(),
				]);
			}

			// fields
			foreach ($formModel->getFields() as $fieldIndex => $fieldModel){

				$sql = "
		            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)."` 
			            (`id`,
			            `form_id`,
			            `meta_field_id`,
			            `field_group`,
			            `field_name`,
			            `field_label`,
			            `field_key`,
			            `field_type`,
			            `description`,
			            `extra`,
			            `settings`,
			            `required`,
			            `sort`
			            ) VALUES (
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %s,
			                %d
			            ) ON DUPLICATE KEY UPDATE 
			                `form_id` = %s,
			                `meta_field_id` = %s,
			                `field_group` = %s,
							`field_name` = %s,
							`field_label` = %s,
							`field_key` = %s,
							`field_type` = %s,
							`description` = %s,
							`extra` = %s,
							`settings` = %s,
							`required` = %s,
							`sort` = %d
			        ;";

				$isRequired = ($fieldModel->isRequired()) ? '1' : '0';
				$metaFormId = ($fieldModel->getMetaField() !== null) ? $fieldModel->getMetaField()->getId() : null;

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$fieldModel->getId(),
					$formModel->getId(),
					$metaFormId,
					$fieldModel->getGroup(),
					$fieldModel->getName(),
					$fieldModel->getLabel(),
					$fieldModel->getKey(),
					$fieldModel->getType(),
					$fieldModel->getDescription(),
					serialize($fieldModel->getExtra()),
					serialize($fieldModel->getSettings()),
					$isRequired,
					($fieldIndex+1),
					$formModel->getId(),
					$metaFormId,
					$fieldModel->getGroup(),
					$fieldModel->getName(),
					$fieldModel->getLabel(),
					$fieldModel->getKey(),
					$fieldModel->getType(),
					$fieldModel->getDescription(),
					serialize($fieldModel->getExtra()),
					serialize($fieldModel->getSettings()),
					$isRequired,
					($fieldIndex+1),
				]);

				// validation rules
				foreach ($fieldModel->getValidationRules() as $ruleIndex => $ruleModel){
					$sql = "
			        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."` 
			        (
			            `id`,
			            `rule_condition`,
                        `rule_value`,
                        `message`,
                        `sort`
			        ) VALUES (
			            %s,
			            %s,
			            %s,
			            %s,
			            %d
			        ) ON DUPLICATE KEY UPDATE 
                        `rule_condition` = %s,
                        `rule_value` = %s,
                        `message` = %s,
                        `sort` = %d
			    ";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$ruleModel->getId(),
						$ruleModel->getCondition(),
						$ruleModel->getValue(),
						$ruleModel->getMessage(),
						($ruleIndex+1),
						$ruleModel->getCondition(),
						$ruleModel->getValue(),
						$ruleModel->getMessage(),
						($ruleIndex+1)
					]);

					$sql = "
				        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FORM_FIELD_PIVOT)."` 
				        (
				            `field_id`,
	                        `rule_id`
				        ) VALUES (
				            %s,
				            %s
				        ) ON DUPLICATE KEY UPDATE 
	                        `field_id` = %s,
	                        `rule_id` = %s
				    ";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$fieldModel->getId(),
						$ruleModel->getId(),
						$fieldModel->getId(),
						$ruleModel->getId(),
					]);

					$validationRuleIds[] = $ruleModel->getId();
				}

				$fieldIds[] = $fieldModel->getId();
			}

			self::removeOrphans($formModel->getId(), $fieldIds);
			self::removeOrphanValidationRules($validationRuleIds);

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

		ACPT_Lite_DB::commitTransaction();
		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $formId
	 * @param $ids
	 *
	 * @throws \Exception
	 */
	private static function removeOrphans($formId, $ids)
	{
		$deleteValidationRulesQuery = "
	    	DELETE f
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_FIELD)."` f
			WHERE form_id = %s
	    ";

		$deleteValidationRulesQuery .= " AND f.id NOT IN ('".implode("','",$ids)."')";
		$deleteValidationRulesQuery .= ";";

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery, [$formId]);
	}

	/**
	 * @param $ids
	 *
	 * @throws \Exception
	 */
	private static function removeOrphanValidationRules($ids)
	{
		$deleteValidationRulesQuery = "
	    	DELETE r
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."` r
			WHERE 1=1
	    ";

		$deleteValidationRulesQuery .= " AND r.id NOT IN ('".implode("','",$ids)."')";
		$deleteValidationRulesQuery .= ";";

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery);

		$deleteValidationRulesQuery = "
	    	DELETE r
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FORM_FIELD_PIVOT)."` r
			WHERE 1=1
	    ";

		$deleteValidationRulesQuery .= " AND r.rule_id NOT IN ('".implode("','",$ids)."')";
		$deleteValidationRulesQuery .= ";";

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery);
	}

	/**
	 * @param FormSubmissionModel $submissionModel
	 *
	 * @throws \Exception
	 */
	public static function saveSubmission(FormSubmissionModel $submissionModel)
	{
		$sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_SUBMISSION)."` 
	            (`id`,
	            `form_id`,
	            `form_action`,
	            `callback`,
	            `ip`,
	            `uid`,
	            `browser`,
	            `form_data`,
	            `errors`,
	            `created_at`
	            ) VALUES (
	                %s,
	                %s,
	                %s,
	                %s,
	                %s,
	                %d,
	                %s,
	                %s,
	                %s,
	                %s
	            ) ON DUPLICATE KEY UPDATE 
	                `form_id` = %s,
	                `form_action` = %s,
	                `callback` = %s,
					`ip` = %s,
					`uid` = %d,
					`browser` = %s,
					`form_data` = %s,
					`errors` = %s,
					`created_at` = %s
	        ;";

		ACPT_Lite_DB::executeQueryOrThrowException($sql, [
			$submissionModel->getId(),
			$submissionModel->getFormId(),
			$submissionModel->getAction(),
			$submissionModel->getCallback(),
			$submissionModel->getIp() ?? "0.0.0.0",
			$submissionModel->getUid(),
			json_encode($submissionModel->getBrowser()),
			json_encode($submissionModel->getData()),
			json_encode($submissionModel->getErrors()),
			$submissionModel->getCreatedAt()->format("Y-m-d H:i:s"),
			$submissionModel->getFormId(),
			$submissionModel->getAction(),
			$submissionModel->getCallback(),
			$submissionModel->getIp() ?? "0.0.0.0",
			$submissionModel->getUid(),
			json_encode($submissionModel->getBrowser()),
			json_encode($submissionModel->getData()),
			json_encode($submissionModel->getErrors()),
			$submissionModel->getCreatedAt()->format("Y-m-d H:i:s")
		]);

		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $formId
	 * @param $page
	 * @param $perPage
	 *
	 * @return FormSubmissionModel[]
	 * @throws \Exception
	 */
	public static function getSubmissions($formId, $page, $perPage): array
	{
		$submissions = [];

		$sql = "
            SELECT
                `id`,
	            `form_id`,
	            `form_action` as `action`,
	            `callback`,
	            `ip`,
	            `uid`,
	            `browser`,
	            `form_data` as `data`,
	            `errors`,
	            `created_at`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_SUBMISSION)."` 
            WHERE form_id = %s
		";

		$sql .= " ORDER BY created_at DESC";
		$sql .= " LIMIT ".$perPage." OFFSET " . ($perPage * ($page - 1));
		$sql .= ";";

		$submissionsRecords = ACPT_Lite_DB::getResults($sql, [$formId]);
		foreach ($submissionsRecords as $submissionRecord){
			$formSubmissionModel = FormSubmissionModel::hydrateFromArray([
				'id' => $submissionRecord->id,
				'formId' => $submissionRecord->form_id,
				'action' => $submissionRecord->action,
				'callback' => $submissionRecord->callback,
				'uid' => $submissionRecord->uid,
			]);

			$formSubmissionModel->setBrowser(json_decode($submissionRecord->browser, true));

			foreach (json_decode($submissionRecord->errors, true) as $error){
				$formSubmissionError = new FormSubmissionErrorObject($error['key'], $error['error']);
				$formSubmissionModel->addError($formSubmissionError);
			}

			$formSubmissionModel->setIp($submissionRecord->ip);

			$data = json_decode($submissionRecord->data, true);

			foreach ($data as $datum){
				if(
					isset($datum['name']) and
					isset($datum['type']) and
					isset($datum['value'])
				){
					$datumObject = new FormSubmissionDatumObject($datum['name'], $datum['type'], $datum['value']);
					$formSubmissionModel->addDatum($datumObject);
				}
			}

			$submissions[] = $formSubmissionModel;
		}

		return $submissions;
	}

	/**
	 * @param $formId
	 *
	 * @return int
	 */
	public static function getSubmissionsCount($formId)
	{
		$baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_FORM_SUBMISSION)."`
            WHERE form_id = %s
            ";

		$results = ACPT_Lite_DB::getResults($baseQuery, [$formId]);

		return (int)$results[0]->count;
	}
}