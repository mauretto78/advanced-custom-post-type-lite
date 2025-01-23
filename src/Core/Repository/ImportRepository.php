<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Validators\ImportFileValidator;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class ImportRepository extends AbstractRepository
{
    /**
     * Import data from array $datum
     * from imported json file
     *
     * @param array $data
     *
     * @throws \Exception
     * @since    1.0.0
     */
    public static function import(array $data)
    {
    	if(!ImportFileValidator::validate($data)){
    		throw new \Exception('Data provided is invalid');
	    }

	    ACPT_Lite_DB::startTransaction();

	    try {
		    if(isset($data['form'])){
			    self::importForms($data['form']);
		    }

	    	if(isset($data[MetaTypes::CUSTOM_POST_TYPE])){
			    self::importCustomPostTypes($data[MetaTypes::CUSTOM_POST_TYPE]);
		    }

		    if(isset($data[MetaTypes::TAXONOMY])){
			    self::importTaxonomies($data[MetaTypes::TAXONOMY]);
		    }

		    if(isset($data[MetaTypes::OPTION_PAGE])){
			    self::importOptionPages($data[MetaTypes::OPTION_PAGE]);
		    }

		    if(isset($data[MetaTypes::META])){
			    self::importMetaGroups($data[MetaTypes::META]);
		    }
	    } catch (\Exception $exception){
		    ACPT_Lite_DB::rollbackTransaction();
		    throw new \Exception($exception->getMessage());
	    }

	    ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::flushCache();
    }

	/**
	 * @param array $data
	 *
	 * @throws \Exception
	 */
    private static function importForms(array $data = [])
    {
	    foreach ($data as $datum){

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
			    $datum['id'],
			    $datum['name'],
			    $datum['label'],
			    $datum['action'],
			    $datum['key'],
			    $datum['name'],
			    $datum['label'],
			    $datum['action'],
			    $datum['key'],
		    ]);

		    // meta
		    foreach ($datum['meta'] as $metadata){

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
				    $metadata['id'],
				    $metadata['formId'],
				    $metadata['key'],
				    $metadata['value'],
				    $metadata['formId'],
				    $metadata['key'],
				    $metadata['value'],
			    ]);
		    }

		    // fields
		    foreach ($datum['fields'] as $fieldIndex => $field){

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

			    $isRequired = ($field['isRequired'] == true) ? '1' : '0';
			    $metaFormId = ($field['metaFieldId'] !== null) ? $field['metaFieldId'] : null;

			    ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				    $field['id'],
				    $datum['id'],
				    $metaFormId,
				    $field['group'],
				    $field['name'],
				    $field['label'],
				    $field['key'],
				    $field['type'],
				    $field['description'],
				    serialize($field['extra']),
				    serialize($field['settings']),
				    $isRequired,
				    ($fieldIndex+1),
				    $datum['id'],
				    $metaFormId,
				    $field['group'],
				    $field['name'],
				    $field['label'],
				    $field['key'],
				    $field['type'],
				    $field['description'],
				    serialize($field['extra']),
				    serialize($field['settings']),
				    $isRequired,
				    ($fieldIndex+1),
			    ]);

				// validation rules
			    foreach ($datum['validationRules'] as $ruleIndex => $rule){
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
					    $rule['id'],
					    $rule['condition'],
					    $rule['value'],
					    $rule['message'],
					    ($ruleIndex+1),
					    $rule['condition'],
					    $rule['value'],
					    $rule['message'],
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
					    $field['id'],
					    $rule['id'],
					    $field['id'],
					    $rule['id'],
				    ]);
			    }
		    }
	    }
    }

	/**
	 * @param array $data
	 *
	 * @throws \Exception
	 */
	private static function importCustomPostTypes(array $data = [])
	{
		foreach ($data as $datum){

			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE)."` 
	            (
		            `id`,
		            `post_name` ,
		            `singular` ,
		            `plural`,
		            `icon`,
		            `supports`,
		            `labels`,
		            `settings`
	            ) VALUES (
	                %s, 
	                %s, 
	                %s, 
	                %s, 
	                %s, 
	                %s, 
	                %s, 
	                %s 
	            ) ON DUPLICATE KEY UPDATE 
	                `post_name` = %s,
	                `singular` = %s, 
	                `plural` = %s, 
	                `icon` = %s, 
	                `supports` = %s, 
	                `labels` = %s, 
	                `settings` = %s 
            ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$datum['id'],
				$datum['name'],
				$datum['singular'],
				$datum['plural'],
				$datum['icon'],
				json_encode($datum['supports']),
				json_encode($datum['labels']),
				json_encode($datum['settings']),
				$datum['name'],
				$datum['singular'],
				$datum['plural'],
				$datum['icon'],
				json_encode($datum['supports']),
				json_encode($datum['labels']),
				json_encode($datum['settings']),
			]);

			if(isset($datum['permissions']) and is_array($datum['permissions'])){
				foreach ($datum['permissions'] as $index => $permission){
					$sql = "
			            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` 
			            (`id`,
			            `entity_id` ,
			            `user_role`,
			            `permissions`,
			            `sort`
			            ) VALUES (
			                %s,
			                %s,
			                %s,
			                %s,
			                %d
			            ) ON DUPLICATE KEY UPDATE 
			                `entity_id` = %s,
			                `user_role` = %s,
			                `permissions` = %s,
			                `sort` = %d
			        ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$permission['id'],
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
					]);
				}
			}

			foreach ($datum['taxonomies'] as $taxonomy) {
				$sql = "
	                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` 
	                (`id`,
	                `slug`,
	                `singular`,
	                `plural`,
	                `labels`,
	                `settings`
	                ) VALUES (
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %s
	                ) ON DUPLICATE KEY UPDATE 
	                    `slug` = %s,
	                    `singular` = %s, 
	                    `plural` = %s, 
	                    `labels` = %s, 
	                    `settings` = %s 
	            ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$taxonomy['id'],
					$taxonomy['slug'],
					$taxonomy['singular'],
					$taxonomy['plural'],
					json_encode($taxonomy['labels']),
					json_encode($taxonomy['settings']),
					$taxonomy['slug'],
					$taxonomy['singular'],
					$taxonomy['plural'],
					json_encode($taxonomy['labels']),
					json_encode($taxonomy['settings']),
				]);

				if(isset($taxonomy['permissions']) and is_array($taxonomy['permissions'])){
					foreach ($taxonomy['permissions'] as $index => $permission){
						$sql = "
				            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` 
				            (`id`,
				            `entity_id` ,
				            `user_role`,
				            `permissions`,
				            `sort`
				            ) VALUES (
				                %s,
				                %s,
				                %s,
				                %s,
				                %d
				            ) ON DUPLICATE KEY UPDATE 
				                `entity_id` = %s,
				                `user_role` = %s,
				                `permissions` = %s,
				                `sort` = %d
				        ;";

						ACPT_Lite_DB::executeQueryOrThrowException($sql, [
							$permission['id'],
							$permission['entityId'],
							$permission['userRole'],
							serialize($permission['permissions']),
							$permission['sort'] ?? $index+1,
							$permission['entityId'],
							$permission['userRole'],
							serialize($permission['permissions']),
							$permission['sort'] ?? $index+1,
						]);
					}
				}

				$sql = "
	                INSERT INTO
	                    `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_PIVOT)."`
	                    (
	                        `custom_post_type_id`, 
	                        `taxonomy_id` 
	                    ) VALUES (
	                        %s, 
	                        %s
	                    ) ON DUPLICATE KEY UPDATE 
	                        `custom_post_type_id` = %s,
	                        `taxonomy_id` = %s
	                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$datum['id'],
					$taxonomy['id'],
					$datum['id'],
					$taxonomy['id']
				]);
			}
		}
	}

	/**
	 * @param array $data
	 *
	 * @throws \Exception
	 */
	private static function importTaxonomies(array $data = [])
	{
		foreach ($data as $datum){

			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."` 
	            (`id`,
	            `slug`,
	            `singular`,
	            `plural`,
	            `native`,
	            `labels`,
	            `settings`
	            ) VALUES (
	                %s,
	                %s,
	                %s,
	                %s,
	                %s,
	                %s,
	                %s
	            ) ON DUPLICATE KEY UPDATE 
	                `slug` = %s,
	                `singular` = %s,
	                `plural` = %s,
	                `native` = %s,
	                `labels` = %s,
	                `settings` = %s
	        ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$datum['id'],
				$datum['slug'],
				$datum['singular'],
				$datum['plural'],
				$datum['isNative'],
				json_encode($datum['labels']),
				json_encode($datum['settings']),
				$datum['slug'],
				$datum['singular'],
				$datum['plural'],
				$datum['isNative'],
				json_encode($datum['labels']),
				json_encode($datum['settings']),
			]);

			if(isset($datum['permissions']) and is_array($datum['permissions'])){
				foreach ($datum['permissions'] as $index => $permission){
					$sql = "
			            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` 
			            (`id`,
			            `entity_id` ,
			            `user_role`,
			            `permissions`,
			            `sort`
			            ) VALUES (
			                %s,
			                %s,
			                %s,
			                %s,
			                %d
			            ) ON DUPLICATE KEY UPDATE 
			                `entity_id` = %s,
			                `user_role` = %s,
			                `permissions` = %s,
			                `sort` = %d
			        ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$permission['id'],
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
					]);
				}
			}
		}
	}

	/**
	 * @param array $data
	 *
	 * @throws \Exception
	 */
	private static function importOptionPages(array $data = [])
	{
		foreach ($data as $datum){
			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_OPTION_PAGE)."` 
	            (`id`,
	            `page_title`,
	            `menu_title`,
	            `capability`,
	            `menu_slug`,
	            `icon`,
	            `description`,
	            `parent_id`,
	            `sort`,
	            `page_position`
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
	                %s
	            ) ON DUPLICATE KEY UPDATE 
	                `page_title` = %s,
		            `menu_title` = %s,
		            `capability` = %s,
		            `menu_slug` = %s,
		            `icon` = %s,
		            `description` = %s,
		            `parent_id` = %s,
		            `sort` = %s,
		            `page_position` = %s
	        ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$datum['id'],
				$datum['pageTitle'],
				$datum['menuTitle'],
				$datum['capability'],
				$datum['menuSlug'],
				$datum['icon'] ?? 'admin-appearance',
				$datum['description'],
				$datum['parentId'],
				$datum['sort'],
				$datum['position'],
				$datum['pageTitle'],
				$datum['menuTitle'],
				$datum['capability'],
				$datum['menuSlug'],
				$datum['icon'] ?? 'admin-appearance',
				$datum['description'],
				$datum['parentId'],
				$datum['sort'],
				$datum['position'],
			]);

			if(isset($datum['permissions']) and is_array($datum['permissions'])){
				foreach ($datum['permissions'] as $index => $permission){
					$sql = "
			            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` 
			            (`id`,
			            `entity_id` ,
			            `user_role`,
			            `permissions`,
			            `sort`
			            ) VALUES (
			                %s,
			                %s,
			                %s,
			                %s,
			                %d
			            ) ON DUPLICATE KEY UPDATE 
			                `entity_id` = %s,
			                `user_role` = %s,
			                `permissions` = %s,
			                `sort` = %d
			        ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$permission['id'],
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
						$permission['entityId'],
						$permission['userRole'],
						serialize($permission['permissions']),
						$permission['sort'] ?? $index+1,
					]);
				}
			}
		}
	}

	/**
	 * 2.0.x format
	 *
	 * @param array $groups
	 *
	 * @throws \Exception
	 */
	private static function importMetaGroups(array $groups)
	{
		foreach ($groups as $group){
			$sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` 
                (
                    `id`,
                    `group_name`,
                    `label`,
                    `context`,
					`priority`,
					`display`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                ) ON DUPLICATE KEY UPDATE 
                    `group_name` = %s,
                    `label` = %s,
                    `context` = %s,
					`priority` = %s,
					`display` = %s
            ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$group['id'],
				$group['name'],
				$group['label'],
				(isset($group['context'])) ? $group['context'] : "advanced",
				(isset($group['priority'])) ? $group['priority'] : "default",
				(isset($group['display'])) ? $group['display'] : "standard",
				$group['name'],
				$group['label'],
				(isset($group['context'])) ? $group['context'] : "advanced",
				(isset($group['priority'])) ? $group['priority'] : "default",
				(isset($group['display'])) ? $group['display'] : "standard",
			]);

			if(isset($group['belongs'])){
				foreach($group['belongs'] as $belong){
					$sql = "
		                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` 
		                (
		                    `id`,
		                    `belongs`,
		                    `operator`,
		                    `find`,
		                    `logic`,
		                    `sort`
		                ) VALUES (
		                    %s,
		                    %s,
		                    %s,
		                    %s,
		                    %s,
		                    %d
		                ) ON DUPLICATE KEY UPDATE 
		                    `belongs` = %s,
		                    `operator` = %s,
		                    `find` = %s,
		                    `logic` = %s,
		                    `sort` = %d
		                ;
	                ";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$belong['id'],
						$belong['belongsTo'],
						$belong['operator'],
						$belong['find'],
						$belong['logic'],
						$belong['sort'],
						$belong['belongsTo'],
						$belong['operator'],
						$belong['find'],
						$belong['logic'],
						$belong['sort'],
					]);

					$sql = "
		                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."`
		                (
		                    `group_id`,
		                    `belong_id`
		                ) VALUES (
		                    %s,
		                    %s
		                ) ON DUPLICATE KEY UPDATE
		                    `group_id` = %s,
		                    `belong_id` = %s
		                ;
	                ";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$group['id'],
						$belong['id'],
						$group['id'],
						$belong['id'],
					]);
				}
			}

			if(isset($group['boxes'])) {
				foreach ( $group['boxes'] as $box ) {
					$sql = "
		                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` 
		                (
		                    `id`,
		                    `group_id`,
		                    `meta_box_name`,
		                    `meta_box_label`,
		                    `sort`
		                ) VALUES (
		                    %s,
		                    %s,
		                    %s,
		                    %s,
		                    %d
		                ) ON DUPLICATE KEY UPDATE 
		                    `group_id` = %s,
		                    `meta_box_name` = %s,
		                    `meta_box_label` = %s,
		                    `sort` = %d
		            ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$box['id'],
						$group['id'],
						$box['name'],
						$box['label'],
						$box['sort'],
						$group['id'],
						$box['name'],
						$box['label'],
						$box['sort'],
					]);

					if(isset($box['fields'])){
						foreach ($box['fields'] as $field){
							self::importMetaField($box['id'], $field);
						}
					}
				}
			}
		}
	}

	/**
	 * @param $boxId
	 * @param $field
	 * @param null $parentFieldId
	 * @param null $parentBlockId
	 *
	 * @throws \Exception
	 */
	private static function importMetaField($boxId, $field, $parentFieldId = null, $parentBlockId = null)
	{
		$showInArchive = (isset($field[ 'showInArchive' ]) and $field[ 'showInArchive' ]) ? '1' : '0';
		$isRequired = (isset($field[ 'required' ]) and $field[ 'required' ]) ? '1' : '0';

		if($parentBlockId){
			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` 
	            (`id`,
	            `meta_box_id`,
	            `block_id`,
	            `field_name`,
	            `field_label`,
	            `field_type`,
	            `field_default_value` ,
	            `field_description` ,
	            `showInArchive` ,
	            `required` ,
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
	                %d
	            ) ON DUPLICATE KEY UPDATE 
	                `meta_box_id` = %s,
	                `block_id` = %s,
	                `field_name` = %s,
	                `field_label` = %s,
	                `field_type` = %s,
	                `field_default_value` = %s,
	                `field_description` = %s,
	                `showInArchive` = %s,
	                `required` = %s,
	                `sort` = %d
	        ;";

			$sqlArgs = [
				$field[ 'id' ],
				$boxId,
				$parentBlockId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
				$boxId,
				$parentBlockId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
			];
		} elseif($parentFieldId){
			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` 
	            (`id`,
	            `meta_box_id`,
	            `parent_id`,
	            `field_name`,
	            `field_label`,
	            `field_type`,
	            `field_default_value` ,
	            `field_description` ,
	            `showInArchive` ,
	            `required` ,
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
	                %d
	            ) ON DUPLICATE KEY UPDATE 
	                `meta_box_id` = %s,
	                `parent_id` = %s,
	                `field_name` = %s,
	                `field_label` = %s,
	                `field_type` = %s,
	                `field_default_value` = %s,
	                `field_description` = %s,
	                `showInArchive` = %s,
	                `required` = %s,
	                `sort` = %d
	        ;";

			$sqlArgs = [
				$field[ 'id' ],
				$boxId,
				$parentFieldId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
				$boxId,
				$parentFieldId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
			];

		} else {
			$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` 
	            (`id`,
	            `meta_box_id` ,
	            `field_name` ,
	            `field_label` ,
	            `field_type` ,
	            `field_default_value` ,
	            `field_description` ,
	            `showInArchive` ,
	            `required` ,
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
	                %d
	            ) ON DUPLICATE KEY UPDATE 
	                `meta_box_id` = %s,
	                `field_name` = %s,
	                `field_label` = %s,
	                `field_type` = %s,
	                `field_default_value` = %s,
	                `field_description` = %s,
	                `showInArchive` = %s,
	                `required` = %s,
	                `sort` = %d
	        ;";

			$sqlArgs = [
				$field[ 'id' ],
				$boxId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
				$boxId,
				$field[ 'name' ],
				$field[ 'label' ] ?? '',
				$field[ 'type' ],
				$field[ 'defaultValue' ],
				$field[ 'description' ],
				$showInArchive,
				$isRequired,
				$field[ 'sort'] ,
			];
		}

		ACPT_Lite_DB::executeQueryOrThrowException( $sql, $sqlArgs);

		if(isset($datum['permissions']) and is_array($datum['permissions'])){
			foreach ($datum['permissions'] as $index => $permission){
				$sql = "
			            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` 
			            (`id`,
			            `entity_id` ,
			            `user_role`,
			            `permissions`,
			            `sort`
			            ) VALUES (
			                %s,
			                %s,
			                %s,
			                %s,
			                %d
			            ) ON DUPLICATE KEY UPDATE 
			                `entity_id` = %s,
			                `user_role` = %s,
			                `permissions` = %s,
			                `sort` = %d
			        ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$permission['id'],
					$permission['entityId'],
					$permission['userRole'],
					serialize($permission['permissions']),
					$permission['sort'] ?? $index+1,
					$permission['entityId'],
					$permission['userRole'],
					serialize($permission['permissions']),
					$permission['sort'] ?? $index+1,
				]);
			}
		}

		if(isset($field['blocks'])){
			foreach ( $field[ 'blocks' ] as $block ) {
				$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."` 
	            (   `id`,
		            `meta_box_id` ,
		            `meta_field_id` ,
		            `block_name` ,
		            `block_label` ,
		            `sort` 
	            ) VALUES (
	                %s,
	                %s,
	                %s,
	                %s,
	                %s,
	                %d
	            ) ON DUPLICATE KEY UPDATE 
	                `meta_box_id` = %s,
	                `meta_field_id` = %s,
	                `block_name` = %s,
	                `block_label` = %s,
	                `sort` = %d
	        ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$block['id'],
					$boxId,
					$field[ 'id' ],
					$block['name'],
					$block['label'],
					$block['sort'],
					$boxId,
					$field[ 'id' ],
					$block['name'],
					$block['label'],
					$block['sort'],
				]);

				if(isset($block['fields'])){
					foreach ($block['fields'] as $blockField){
						self::importMetaField($boxId, $blockField, null, $block['id']);
					}
				}
			}
		}

		if(isset($field[ 'children' ])){
			foreach ($field[ 'children' ] as $child ) {
				self::importMetaField($boxId, $child, $field['id']);
			}
		}

		if(isset($field[ 'advancedOptions' ])){
			foreach ( $field[ 'advancedOptions' ] as $option ) {
				$sql = "
	                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_ADVANCED_OPTION)."` 
	                (`id`,
	                `meta_box_id` ,
	                `meta_field_id` ,
	                `option_key` ,
	                `option_value` 
	                ) VALUES (
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %s
	                ) ON DUPLICATE KEY UPDATE 
	                    `meta_box_id` = %s,
	                    `meta_field_id` = %s,
	                    `option_key` = %s,
	                    `option_value` = %s
	            ;";

				ACPT_Lite_DB::executeQueryOrThrowException( $sql, [
					$option[ 'id' ],
					$boxId,
					$field[ 'id' ],
					$option[ 'key' ],
					$option[ 'value' ],
					$boxId,
					$field[ 'id' ],
					$option[ 'key' ],
					$option[ 'value' ],
				] );
			}
		}

		if(isset($field[ 'options' ])){
			foreach ( $field[ 'options' ] as $option ) {
				$sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` 
	                (`id`,
	                `meta_box_id` ,
	                `meta_field_id` ,
	                `option_label` ,
	                `option_value` ,
	                `sort`
	                ) VALUES (
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %s,
	                    %s
	                ) ON DUPLICATE KEY UPDATE 
	                    `meta_box_id` = %s,
	                    `meta_field_id` = %s,
	                    `option_label` = %s,
	                    `option_value` = %s,
	                    `sort` = %s 
	            ;";

				ACPT_Lite_DB::executeQueryOrThrowException( $sql, [
					$option[ 'id' ],
					$boxId,
					$field[ 'id' ],
					$option[ 'label' ],
					$option[ 'value' ],
					$option[ 'sort'] ,
					$boxId,
					$field[ 'id' ],
					$option[ 'label' ],
					$option[ 'value' ],
					$option[ 'sort'] ,
				] );
			}
		}

		if(isset($field['validationRules'])) {
			foreach ( $field['validationRules'] as $rule ) {
				$sql = "
					INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."`
					(
						`id`,
						`rule_condition`,
						`rule_value`,
						`sort`
					) VALUES (
						%s,
	                    %s,
	                    %s,
	                    %d
					) ON DUPLICATE KEY UPDATE 
	                    `rule_condition` = %s,
	                    `rule_value` = %s,
	                    `sort` = %d
				;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$rule[ 'id' ],
					$rule['condition'],
					$rule['value'],
					$rule['sort'],
					$rule['condition'],
					$rule['value'],
					$rule['sort'],
				]);

				$sql = "
					INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FIELD_PIVOT)."`
					(
						`field_id`,
						`rule_id`
					) VALUES (
						%s,
	                    %s
					) 
				;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$rule[ 'id' ],
					$field[ 'id' ]
				]);
			}
		}

		if(isset($field['visibilityConditions'])){
			foreach ( $field['visibilityConditions'] as $visibilityCondition ) {
				$sql = "
	            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_VISIBILITY)."` 
	                (`id`,
	                `meta_box_id` ,
	                `meta_field_id` ,
	                `visibility_type` ,
	                `operator` ,
	                `visibility_value`,
	                `logic`,
	                `back_end`,
                    `front_end`,
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
	                    %d
	                ) ON DUPLICATE KEY UPDATE 
	                    `meta_box_id` = %s,
	                    `meta_field_id` = %s,
	                    `visibility_type` = %s,
	                    `operator` = %s,
	                    `visibility_value` = %s,
	                    `logic` = %s,
	                    `back_end` = %s,
                        `front_end` = %s,
	                    `sort` = %d
	            ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$visibilityCondition[ 'id' ],
					$boxId,
					$field[ 'id' ],
					json_encode($visibilityCondition['type']),
					$visibilityCondition['operator'],
					$visibilityCondition['value'],
					$visibilityCondition['logic'],
					$visibilityCondition['backEnd'],
					$visibilityCondition['frontEnd'],
					$visibilityCondition['sort'],
					$boxId,
					$field[ 'id' ],
					json_encode($visibilityCondition['type']),
					$visibilityCondition['operator'],
					$visibilityCondition['value'],
					$visibilityCondition['logic'],
					$visibilityCondition['backEnd'],
					$visibilityCondition['frontEnd'],
					$visibilityCondition['sort'],
				]);
			}
		}

		if(isset($field['relations'])){
			foreach ( $field[ 'relations' ] as $relation ) {

				$a = ($relation['inversedBoxId'] !== null) ? $relation['inversedBoxId']  : 'NULL';
				$b = ($relation['inversedBoxName'] !== null) ? "'".$relation['inversedBoxName']."'"  : 'NULL';
				$c = ($relation['inversedFieldId'] !== null) ? $relation['inversedFieldId']  : 'NULL';
				$d = ($relation['inversedFieldName'] !== null) ? "'".$relation['inversedFieldName']."'"  : 'NULL';

				$from = json_encode([
					'type' => $relation['from']['type'],
					'value' => $relation['from']['value'],
				]);

				$to = json_encode([
					'type' => $relation['to']['type'],
					'value' => $relation['to']['value'],
				]);

				$sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` 
                        (`id`,
                        `meta_box_id` ,
                        `meta_field_id` ,
                        `relationship` ,
                        `relation_from` ,
                        `relation_to` ,
                        `inversed_meta_box_id` ,
                        `inversed_meta_box_name`,
                        `inversed_meta_field_id` ,
                        `inversed_meta_field_name`
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
                            %s
                        ) ON DUPLICATE KEY UPDATE 
                            `meta_box_id` = %s,
                            `meta_field_id` = %s,
                            `relationship` = %s,
                            `relation_from` = %s,
                            `relation_to` = %s,
                            `inversed_meta_box_id` = %s,
                            `inversed_meta_box_name` = %s,
                            `inversed_meta_field_id` = %s,
                            `inversed_meta_field_name` = %s
                    ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$relation['id'],
					$relation['boxId'],
					$relation['fieldId'],
					$relation['type'],
					$from,
					$to,
					$a,
					$b,
					$c,
					$d,
					$relation['boxId'],
					$relation['fieldId'],
					$relation['type'],
					$from,
					$to,
					$a,
					$b,
					$c,
					$d
				]);
			}
		}
	}
}