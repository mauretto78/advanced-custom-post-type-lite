<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldAdvancedOptionModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldBlockModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldRelationshipModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldVisibilityModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Core\Models\Validation\ValidationRuleModel;
use ACPT_Lite\Core\ValueObjects\RelatedEntityValueObject;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\Checker\MetaGroupVisibilityChecker;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\MetaSync\MetaSync;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Wordpress\Posts;

class MetaRepository extends AbstractRepository
{
	/**
	 * @return int
	 */
	public static function count()
	{
		$baseQuery = "
            SELECT 
                count(id) as count
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."`
            ";

		$results = ACPT_Lite_DB::getResults($baseQuery);

		return (int)$results[0]->count;
	}

    /**
	 * Delete all meta groups
	 *
	 * @param array $args
	 * @return bool
	 * @throws \Exception
	 */
	public static function deleteAll(array $args)
	{
		self::validateArgs(self::mandatoryKeys([]), $args);

		$groups = self::get($args);

		if(empty($groups)){
			return false;
		}

		ACPT_Lite_DB::startTransaction();

		foreach ($groups as $groupModel){
			self::deleteMetaGroup($groupModel->getId());
		}

        ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);

		return true;
	}

	/**
	 * @param $belongsTo
	 * @param $find
	 *
	 * @throws \Exception
	 */
	public static function deleteBelongs($belongsTo, $find)
	{
		$sql = "
			SELECT b.id FROM 
			 `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
			WHERE b.belongs =  %s
			AND b.find =  %s
		;";

		$belongs = ACPT_Lite_DB::getResults($sql, [
			$belongsTo,
			$find
		]);

		foreach ($belongs as $belong){
			$sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."`
                WHERE id = %s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$belong->id]);

			$sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."`
                WHERE belong_id = %s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$belong->id]);
		}
	}

	/**
	 * @param string $id
	 *
	 * @throws \Exception
	 */
	public static function deleteMetaGroup(string $id)
	{
		ACPT_Lite_DB::startTransaction();

		try {
			$sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."`
                WHERE id = %s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$id]);

            $belongQuery = "
		        SELECT 
		        	b.id
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
	            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` bb on bb.belong_id = b.id
	            WHERE bb.group_id = %s
	            GROUP BY b.id
	            ORDER BY b.sort
		    ";

            $belongs = ACPT_Lite_DB::getResults($belongQuery, [$id]);

            foreach ($belongs as $belong){
                $sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."`
                WHERE id = %s
            ";

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$belong->id]);
            }

			$sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."`
                WHERE group_id = %s
            ";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$id]);

			$sql = "
				SELECT b.id FROM 
				 `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b
				where b.group_id =  %s
			;";

			$boxes = ACPT_Lite_DB::getResults($sql, [
				$id
			]);

			if(!empty($boxes)){
				foreach ($boxes as $box){
					self::deleteMetaBox($box->id);
				}
			}

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
			throw new \Exception($exception->getMessage());
		}

		ACPT_Lite_DB::commitTransaction();
		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

    /**
     * Delete a meta box
     *
     * @param string $boxId
     *
     * @throws \Exception
     */
    public static function deleteMetaBox(string $boxId)
    {
        $sql = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
                WHERE id = %s
            ";

		$sql2 = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
                WHERE meta_box_id = %s
            ";

		$sql3 = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."`
                WHERE meta_box_id = %s
            ";

		try {
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$boxId]);
			ACPT_Lite_DB::executeQueryOrThrowException($sql2, [$boxId]);
			ACPT_Lite_DB::executeQueryOrThrowException($sql3, [$boxId]);
		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
			throw new \Exception($exception->getMessage());
		}

        ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete meta box by its id
     *
     * @param array $args
     * @return bool
     * @throws \Exception
     */
    public static function deleteMetaBoxById(array $args)
    {
    	// @TODO questo metodo è inutile????

        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => true,
                'type' => 'integer|string',
            ],
        ]);

		self::validateArgs($mandatoryKeys, $args);

		$id = $args['id'];
		$metaBoxModel = self::getMetaBoxById($id);

		if( null !== $metaBoxModel) {
			self::deleteMetaBox($id);
		}

		return false;
	}

	/**
	 * Delete meta field model
	 *
	 * @param string $fieldId
	 * @throws \Exception
	 */
	public static function deleteMetaField(string $fieldId)
    {
		ACPT_Lite_DB::startTransaction();

		$sql = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
                WHERE id = %s
            ";

		$sql2 = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."`
                WHERE meta_field_id = %s
            ";

		try {
			ACPT_Lite_DB::executeQueryOrThrowException($sql, [$fieldId]);
			ACPT_Lite_DB::executeQueryOrThrowException($sql2, [$fieldId]);
        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * Check if a meta box exists by its name
	 *
	 * @param array $args
	 * @return bool
	 * @throws \Exception
	 */
	public static function existsMetaBox(array $args)
	{
		$mandatoryKeys = [
	        'boxName' => [
		        'required' => true,
		        'type' => 'string',
	        ],
        ];

		self::validateArgs($mandatoryKeys, $args);

		$boxName = $args['boxName'];

	    $baseQuery = "
            SELECT
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
            WHERE meta_box_name = %s
        ";

	    $queryArgs = [$boxName];
	    $records = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

	    if(empty($records)){
	    	return false;
	    }

	    return count($records) === 1;

    }

	/**
	 * Check if a  meta field exists by its name
	 *
	 * @param array $args
	 * @return bool
	 * @throws \Exception
	 */
	public static function existsMetaBoxField(array $args)
	{
		$mandatoryKeys = [
	        'boxName' => [
		        'required' => true,
		        'type' => 'string',
	        ],
	        'fieldName' => [
		        'required' => true,
		        'type' => 'string',
	        ],
        ];

		self::validateArgs($mandatoryKeys, $args);

		$boxName = $args['boxName'];
        $fieldName = $args['fieldName'];

	    $baseQuery = "
            SELECT 
                f.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE b.meta_box_name = %s
            AND f.field_name = %s
        ";

	    $queryArgs = [$boxName, $fieldName];
	    $records = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

		if(empty($records)){
			return false;
		}

	    return count($records) === 1;
    }

	/**
	 * @param $excludeId
	 *
	 * @return array
	 */
    public static function metaFieldsFlatArray($excludeId)
    {
	    $guery = "
	        SELECT 
                f.id, 
                f.meta_box_id as box_id,
                f.field_name as name,
                b.meta_box_name as box_name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.id != %s
	    ";

	    return ACPT_Lite_DB::getResults($guery, [$excludeId]);
    }

    /**
     * Query for meta groups
	 *
	 * @param array $args
	 * @return MetaGroupModel[]
	 * @throws \Exception
	 */
	public static function get(array $args): array
    {
        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => false,
                'type' => 'integer|string',
            ],
            'groupName' => [
	            'required' => false,
	            'type' => 'string',
            ],
            'boxId' => [
	            'required' => false,
	            'type' => 'string',
            ],
            'boxName' => [
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
			'excludeField' => [
				'required' => false,
				'type' => 'string',
			],
			'formBuilder' => [
				'required' => false,
				'type' => 'boolean',
			],
            'clonedFields' => [
                'required' => false,
                'type' => 'boolean',
            ],
            'sortedBy' => [
                'required' => false,
                'type' => 'string',
            ],
			'lazy' => [
				'required' => false,
				'type' => 'boolean',
			]
		]);

		self::validateArgs($mandatoryKeys, $args);

	    $results = [];
        $id = isset($args['id']) ? $args['id'] : null;
        $belongsTo = isset($args['belongsTo']) ? $args['belongsTo'] : null;
        $groupName = isset($args['groupName']) ? $args['groupName'] : null;
		$find = isset($args['find']) ? $args['find'] : null;
	    $lazy = isset($args['lazy']) ? $args['lazy'] : false;
	    $boxName = isset($args['boxName']) ? $args['boxName'] : false;
	    $excludeField = isset($args['excludeField']) ? $args['excludeField'] : null;
	    $formBuilder = isset($args['formBuilder']) ? $args['formBuilder'] : false;
	    $clonedFields = (isset($args['clonedFields']) and $args['clonedFields'] === true) ? true : false;

	    $groupQueryArgs = [];
	    $groupQuery = "
	        SELECT 
                g.id, 
                g.group_name as name,
                g.label,
                g.display,
                g.priority,
                g.context
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g
            LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` b ON b.group_id = g.id
            WHERE 1 = 1
	    ";

	    if($id !== null){
		    $groupQuery .= " AND g.id = %s";
		    $groupQueryArgs[] = $id;
	    }

	    if($groupName !== null){
		    $groupQuery .= " AND g.group_name = %s";
		    $groupQueryArgs[] = $groupName;
	    }

	    $groupQuery .= ' GROUP BY g.id ORDER BY g.group_name ASC';
	    $groups = ACPT_Lite_DB::getResults($groupQuery, $groupQueryArgs);
	    $groupModels = [];

	    foreach ($groups as $group){

			$groupModel = MetaGroupModel::hydrateFromArray([
				'id'       => $group->id,
				'name'     => $group->name,
				'label'    => $group->label,
				'display'    => $group->display,
			]);

		    if(!empty($group->priority)){
			    $groupModel->setPriority($group->priority);
		    }

		    if(!empty($group->context)){
			    $groupModel->setContext($group->context);
		    }

		    $belongQuery = "
		        SELECT 
		        	b.id,
					b.belongs,
					b.operator,
					b.find,
					b.logic,
					b.sort
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
	            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` bb on bb.belong_id = b.id
	            WHERE bb.group_id = %s
	            GROUP BY b.id
	            ORDER BY b.sort
		    ";

		    $belongQueryArgs = [
			    $group->id
		    ];

		    $belongs = ACPT_Lite_DB::getResults($belongQuery, $belongQueryArgs);

		    foreach ($belongs as $belong){
			    $belongModel = BelongModel::hydrateFromArray([
			    	'id' => $belong->id,
				    'belongsTo' => $belong->belongs,
				    'operator' => $belong->operator,
				    'find' => $belong->find,
				    'logic' => $belong->logic,
				    'sort' => $belong->sort,
			    ]);

			    $groupModel->addBelong($belongModel);
		    }

		    $groupModels[] = $groupModel;
	    }

		foreach ($groupModels as $groupModel){
			$groupIsVisible = true;

			if($belongsTo){
				$groupIsVisible = MetaGroupVisibilityChecker::isVisible($groupModel, $belongsTo, $find);
			}

			if($groupIsVisible === true){
				if($lazy === false){

					$boxesQueryArgs = [
						$groupModel->getId()
					];

					$boxesQuery = "
						SELECT
			                id,
			                group_id,
			                meta_box_name as name,
			                meta_box_label as label,
			                sort
			            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
			            WHERE group_id = %s
					";

					if($boxName){
						$boxesQuery .= " AND meta_box_name = %s";
						$boxesQueryArgs[] = $boxName;
					}

					$boxesQuery .= " ORDER BY sort";

					$boxes = ACPT_Lite_DB::getResults($boxesQuery, $boxesQueryArgs);

					foreach ($boxes as $box){

						$boxModel = MetaBoxModel::hydrateFromArray([
							'id' => $box->id,
							'group' => $groupModel,
							'name' => $box->name,
							'sort' => $box->sort,
							'label' => $box->label,
						]);

						// fields
						$sql = "
		                    SELECT
		                        id,
		                        field_name as name,
		                        field_label as label,
		                        field_type,
		                        field_default_value,
		                        field_description,
		                        required,
		                        showInArchive,
		                        block_id,
		                        filter_in_admin,
		                        quick_edit,
		                        sort
		                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
		                    WHERE meta_box_id = %s
		                    AND parent_id IS NULL
		                    AND block_id IS NULL
		                ";

						$sqlArgs = [$box->id];

						if($excludeField){
							$sql .= " AND id != %s";
							$sqlArgs[] = $excludeField;
						}

						$sql .= " ORDER BY sort;";

						$fields = ACPT_Lite_DB::getResults($sql, $sqlArgs);

						// Meta box fields
						foreach ($fields as $fieldIndex => $field){
							$fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel, $excludeField, $belongsTo, $find, $clonedFields);
							$boxModel->addField($fieldModel);
						}

						$groupModel->addBox($boxModel);
					}
				}

				$results[] = $groupModel;
			}
		}

		return $results;
	}

    /**
     * @return string[]
     */
    public static function getGroupNames()
    {
        $names = [];
        $query = "
	        SELECT 
                g.id, 
                g.group_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g
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
    public static function getBoxNames()
    {
        $names = [];
        $query = "
	        SELECT 
                b.id, 
                b.meta_box_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b
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
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element){
            $names[] = $element->name;
        }

        return $names;
    }

	/**
	 * @return array
	 */
	public static function getNames(): array
	{
		$names = [
			'groups' => [],
			'boxes' => [],
			'fields' => [],
			'blocks' => [],
		];

		$groupQuery = "
	        SELECT 
                g.id, 
                g.group_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g
	    ";

		$boxQuery = "
	        SELECT 
                b.id, 
                b.meta_box_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b
	    ";

		$fieldQuery = "
	        SELECT 
                f.id, 
                f.field_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
	    ";
		$blockQuery = "
	        SELECT 
                b.id, 
                b.block_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."` b
	    ";

		$groups = ACPT_Lite_DB::getResults($groupQuery, []);
		foreach ($groups as $group){
			$names['groups'][] = [
				'id' => $group->id,
				'name' => $group->name,
			];
		}

		$boxes = ACPT_Lite_DB::getResults($boxQuery, []);
		foreach ($boxes as $box){
			$names['boxes'][] = [
				'id' => $box->id,
				'name' => $box->name,
			];
		}

		$fields  = ACPT_Lite_DB::getResults($fieldQuery, []);
		foreach ($fields as $field){
			$names['fields'][] = [
				'id' => $field->id,
				'name' => $field->name,
			];
		}

		$blocks = ACPT_Lite_DB::getResults($blockQuery, []);
		foreach ($blocks as $block){
			$names['blocks'][] = [
				'id' => $block->id,
				'name' => $block->name,
			];
		}

		return $names;
	}

	/**
	 * Hydrate the meta field object
	 *
	 * @param $field
	 * @param MetaBoxModel $boxModel
	 * @param null $excludeField
	 * @param null $belongsTo
	 * @param null $find
	 * @param false $clonedFields
	 *
	 * @return MetaFieldModel
	 * @throws \Exception
	 */
	public static function hydrateMetaBoxFieldModel($field, MetaBoxModel $boxModel, $excludeField = null, $belongsTo = null, $find = null, $clonedFields = false): ?MetaFieldModel
    {
	    $fieldModel = MetaFieldModel::hydrateFromArray([
		    'id' => $field->id,
		    'box' => $boxModel,
		    'name' => $field->name,
		    'label' => $field->label,
		    'type' => $field->field_type,
		    'isRequired' => (bool)$field->required,
		    'defaultValue' => isset($field->field_default_value) ? $field->field_default_value : null,
		    'description' => isset($field->field_description) ? $field->field_description : null,
		    'showInArchive' => (bool)$field->showInArchive,
		    'sort' => (int)$field->sort
	    ]);

	    if($belongsTo){
		    $fieldModel->setBelongsToLabel($belongsTo);
	    }

	    if($find){
		    $fieldModel->setFindLabel($find);
	    }

	    if(isset($field->quick_edit) and $field->quick_edit == 1){
		    $fieldModel->setQuickEdit(true);
	    }

	    if(isset($field->filter_in_admin) and $field->filter_in_admin == 1){
			$fieldModel->setFilterableInAdmin(true);
	    }

		if($fieldModel === null){
			return null;
		}

		// Options
		$options = ACPT_Lite_DB::getResults("
            SELECT
                id,
                meta_box_id as boxId,
                meta_field_id as fieldId,
                option_label as label,
                option_value as value,
                sort,
                is_default
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."`
            WHERE meta_field_id = %s
            ORDER BY sort
        ;", [$field->id]);

		foreach ($options as $option){
			try {
				$optionModel = MetaFieldOptionModel::hydrateFromArray([
					'id' => $option->id,
					'metaField' => $fieldModel,
					'label' => $option->label,
					'value' => $option->value,
					'sort' => $option->sort,
					'isDefault' => $option->is_default == '0' ? false : true,
				]);

				$fieldModel->addOption($optionModel);
			} catch (\Exception $exception){}
		}

		return $fieldModel;
	}

	/**
	 * @param string $boxName
	 *
	 * @return MetaBoxModel|null
	 * @throws \Exception
	 */
	public static function getMetaBoxByName($boxName)
	{
		$boxesQuery = "
			SELECT
                id,
                group_id,
                meta_box_name as name,
                meta_box_label as label,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
            WHERE meta_box_name = %s
            ORDER BY sort
		";

		$boxes = ACPT_Lite_DB::getResults($boxesQuery, [$boxName]);

		if(empty($boxes)){
			return null;
		}

		$box = $boxes[0];

		$groupModel = self::get([
			'id' => $box->group_id,
			'lazy' => true
		]);

		$boxModel = MetaBoxModel::hydrateFromArray([
			'id' => $box->id,
			'group' => $groupModel[0],
			'name' => $box->name,
			'sort' => $box->sort,
			'label' => $box->label,
		]);

		// fields
		$sql = "
	        SELECT
	            id,
	            field_name as name,
	            field_label as label,
	            field_type,
	            field_default_value,
	            field_description,
	            required,
	            showInArchive,
	            block_id,
	            filter_in_admin,
	            quick_edit,
	            sort
	        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
	        WHERE meta_box_id = %s
	        AND parent_id IS NULL
	        AND block_id IS NULL
	    ";

		$sql .= " ORDER BY sort;";

		$fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

		// Meta box fields
		foreach ($fields as $fieldIndex => $field){
			$fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);
			$boxModel->addField($fieldModel);
		}

		return $boxModel;
	}

	/**
	 * @param array $args
	 * @return MetaFieldModel|null
	 * @throws \Exception
	 */
	public static function getMetaFieldByName(array $args): ?MetaFieldModel
	{
		$mandatoryKeys = [
	        'boxName' => [
		        'required' => true,
		        'type' => 'string',
	        ],
	        'fieldName' => [
		        'required' => true,
		        'type' => 'string',
	        ],
	        'forgedBy' => [
		        'required' => false,
		        'type' => 'array',
	        ],
	        'lazy' => [
		        'required' => false,
		        'type' => 'boolean',
	        ],
        ];

		self::validateArgs($mandatoryKeys, $args);

		$boxName = $args['box_name'] ?? $args['boxName'];
		$fieldName = $args['field_name'] ?? $args['fieldName'];
		$lazy = $args['lazy'] ?? false;
		$forgedBy = $args['forgedBy'] ?? [];

		$sql = "
	            SELECT
	                f.id,
	                f.meta_box_id,
	                f.field_name as name,
	                f.field_label as label,
	                f.field_default_value,
	                f.field_description as description,
	                f.field_type,
	                f.parent_id,
	                f.block_id,
	                f.required,
	                f.showInArchive,
	                f.filter_in_admin,
	                f.quick_edit,
	                f.parent_id,
					f.block_id,
	                f.sort
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
	            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON f.meta_box_id = b.id
	            WHERE f.field_name = %s AND b.meta_box_name = %s
	        ;";

		$fields = ACPT_Lite_DB::getResults($sql, [$fieldName, $boxName]);

		$field = $fields[0];
		$boxModel = self::getMetaBoxById($field->meta_box_id, $lazy);

		if($boxModel === null){
			return null;
		}

		if($lazy){
			return MetaFieldModel::hydrateFromArray([
				'id'            => $field->id,
				'box'           => $boxModel,
				'name'          => $field->name,
				'label'         => $field->label,
				'type'          => $field->field_type,
				'isRequired'    => $field->required == 1,
				'defaultValue'  => $field->field_default_value,
				'description'   => $field->description,
				'showInArchive' => $field->showInArchive == 1,
				'sort'          => $field->sort
			]);
		}

		$fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);



		return $fieldModel;
	}

	/**
	 * @param $id
	 * @param bool $lazy
	 *
	 * @return MetaBoxModel|null
	 * @throws \Exception
	 */
	public static function getMetaBoxById($id, $lazy = false)
    {
	    $baseQuery = "
            SELECT 
                id, 
                group_id,
                meta_box_name as name,
                meta_box_label as label,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
            WHERE id = %s
            ";

	    $queryArgs = [$id];
	    $boxes = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

	    if(!empty($boxes)){
		    foreach ($boxes as $box){

			    try {
				    $sql = "
            	    SELECT 
	                    g.id, 
	                    g.group_name as name,
	                    g.label,
	                    g.context,
	                    g.priority
	                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g
	                WHERE id = %s
            	";
				    $group = ACPT_Lite_DB::getResults($sql, [
					    $box->group_id
				    ]);

				    if(empty($group)){
					    return null;
				    }

				    $groupModel = MetaGroupModel::hydrateFromArray([
					    'id'    => $group[0]->id,
					    'name'  => $group[0]->name,
					    'label' => $group[0]->label,
				    ]);

				    if(!empty($group[0]->priority)){
					    $groupModel->setPriority($group[0]->priority);
				    }

				    if(!empty($group[0]->context)){
					    $groupModel->setContext($group[0]->context);
				    }

				    // belongs
				    $belongQuery = "
			        SELECT 
			            b.id,
						b.belongs,
						b.operator,
						b.find,
						b.logic,
						b.sort
		            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
		            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` bb on bb.belong_id = b.id
		            WHERE bb.group_id = %s
		            GROUP BY b.id
		            ORDER BY b.sort
			    ";

				    $belongs = ACPT_Lite_DB::getResults($belongQuery, [$group[0]->id]);

				    foreach ($belongs as $belong){
					    $belongModel = BelongModel::hydrateFromArray([
						    'id' => $belong->id,
						    'belongsTo' => $belong->belongs,
						    'operator' => $belong->operator,
						    'find' => $belong->find,
						    'logic' => $belong->logic,
						    'sort' => $belong->sort,
					    ]);

					    $groupModel->addBelong($belongModel);
				    }

				    $boxModel = MetaBoxModel::hydrateFromArray( [
					    'id'       => $box->id,
					    'group'    => $groupModel,
					    'name'     => $box->name,
					    'label'    => $box->label,
					    'sort'     => $box->sort
				    ] );
			    } catch (\Exception $exception){}

			    // fields
			    if($lazy === false){
				    try {
					    $sql = "
		                    SELECT
		                        id,
		                        field_name as name,
		                        field_label as label,
		                        field_type,
		                        field_default_value,
		                        field_description,
		                        required,
		                        showInArchive,
		                        block_id,
		                        filter_in_admin,
		                        quick_edit,
		                        sort
		                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
		                    WHERE meta_box_id = %s
		                    AND parent_id IS NULL
		                    AND block_id IS NULL ORDER BY sort;
		                ";

					    $fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

					    // Meta box fields
					    foreach ($fields as $fieldIndex => $field){
						    $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);
						    $boxModel->addField($fieldModel);
					    }

					    $groupModel->addBox($boxModel);
				    } catch (\Exception $exception){}
			    }

			    return $boxModel;
		    }
	    }

	    return null;
    }

	/**
	 * @param string $name
	 * @param bool $lazy
	 *
	 * @return MetaFieldBlockModel|null
	 * @throws \Exception
	 */
	public static function getMetaBlockByName($name, $lazy = false)
	{
		$sql = "
            SELECT
                `id`,
                `meta_box_id` as `metaBoxId`,
                `meta_field_id` as `metaFieldId`,
                `block_name` as `name`,
                `block_label` as `label`,
                `sort` 
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."`
            WHERE block_name = %s
        ;";

		$blocks = ACPT_Lite_DB::getResults($sql, [$name]);

		foreach ($blocks as $blockIndex => $block) {
			try {
				$fieldModel = self::getMetaFieldById($block->metaFieldId);

				if($fieldModel === null){
					return null;
				}

				$blockModel = MetaFieldBlockModel::hydrateFromArray([
					'id' => $block->id,
					'metaField' => $fieldModel,
					'name' => $block->name,
					'sort' => $block->sort,
					'label' => $block->label,
				]);

				if(!$lazy){
					$nestedFieldModels = self::getMetaFields([
						'blockId' => $block->id,
						'sortBy' => 'sort',
					]);

					$blockModel->setFields($nestedFieldModels);
				}

				return $blockModel;
			} catch (\Exception $exception){
				return null;
			}
		}

		return null;
	}

	/**
	 * @param $id
	 * @param bool $lazy
	 *
	 * @return MetaFieldBlockModel|null
	 * @throws \Exception
	 */
	public static function getMetaBlockById($id, $lazy = false)
    {
		$sql = "
            SELECT
                `id`,
                `meta_box_id` as `metaBoxId`,
                `meta_field_id` as `metaFieldId`,
                `block_name` as `name`,
                `block_label` as `label`,
                `sort` 
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."`
            WHERE id = %s
        ;";

		$blocks = ACPT_Lite_DB::getResults($sql, [$id]);

		foreach ($blocks as $blockIndex => $block) {
			try {
				$fieldModel = self::getMetaFieldById($block->metaFieldId);

				if($fieldModel === null){
					return null;
				}

				$blockModel = MetaFieldBlockModel::hydrateFromArray([
					'id' => $block->id,
					'metaField' => $fieldModel,
					'name' => $block->name,
					'sort' => $block->sort,
					'label' => $block->label,
				]);

				if(!$lazy){
					$nestedFieldModels = self::getMetaFields([
						'blockId' => $block->id,
						'sortBy' => 'sort',
					]);

					$blockModel->setFields($nestedFieldModels);
				}

				return $blockModel;
			} catch (\Exception $exception){
				return null;
			}
		}

		return null;
	}

	/**
	 * @param string $id
     * @param bool $lazy
     *
	 * @return MetaFieldModel|null
	 * @throws \Exception
	 */
	public static function getMetaFieldById($id, $lazy = false): ?MetaFieldModel
    {
		$sql = "
            SELECT
                id,
                meta_box_id,
                field_name as name,
                field_label as label,
                field_default_value,
                field_description,
                field_type,
                parent_id,
                block_id,
                required,
                showInArchive,
                filter_in_admin,
                quick_edit,
                parent_id,
				block_id,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
            WHERE id = %s
        ;";

		$fields = ACPT_Lite_DB::getResults($sql, [$id]);

        try {
	        foreach ($fields as $fieldIndex => $field) {
		        $boxModel = self::getMetaBoxById($field->meta_box_id, $lazy);

		        if($boxModel === null){
			        return null;
		        }

		        // lazy mode
		        if($lazy){

		        	$metaField = MetaFieldModel::hydrateFromArray([
				        'id'            => $field->id,
				        'box'           => $boxModel,
				        'name'          => $field->name,
				        'label'         => $field->label,
				        'type'          => $field->field_type,
				        'isRequired'    => $field->required == 1,
				        'defaultValue'  => $field->field_default_value,
				        'description'   => $field->field_description,
				        'showInArchive' => $field->showInArchive == 1,
				        'sort'          => $field->sort
			        ]);

		        	if(isset($field->parent_id) and !empty($field->parent_id)){
				        $metaField->setParentId($field->parent_id);
			        }

			        if(isset($field->block_id) and !empty($field->block_id)){
				        $metaField->setBlockId($field->block_id);
			        }

			        return $metaField;
		        }

		        // children fields
		        $sql = "
			        SELECT
			            id,
			            field_name as name,
			            field_label as label,
			            field_type,
			            field_default_value,
			            field_description,
			            required,
			            showInArchive,
			            block_id,
			            filter_in_admin,
			            quick_edit,
			            sort
			        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
			        WHERE meta_box_id = %s
			        AND parent_id IS NULL
			        AND block_id IS NULL
			    ";

		        $sql .= " ORDER BY sort;";
		        $boxFields = ACPT_Lite_DB::getResults($sql, [$boxModel->getId()]);

		        // Meta box fields
		        foreach ($boxFields as $boxField){
			        $boxFieldModel = self::hydrateMetaBoxFieldModel($boxField, $boxModel);
			        $boxModel->addField($boxFieldModel);
		        }

		        return self::hydrateMetaBoxFieldModel($field, $boxModel);
	        }
        } catch (\Exception $exception){
        	return null;
        }

		return null;
	}

	/**
	 * @param array $args
	 *
	 * @return MetaFieldModel[]|null
	 * @throws \Exception
	 */
	public static function getMetaFields(array $args)
	{
		$mandatoryKeys = [
			'types' => [
				'required' => false,
				'type' => 'array',
			],
			'blockId' => [
				'required' => false,
				'type' => 'integer|string',
			],
			'lazy' => [
				'required' => false,
				'type' => 'boolean',
			],
			'sortBy' => [
				'required' => false,
				'type' => 'string',
			],
		];

		self::validateArgs($mandatoryKeys, $args);

		$sortBy = isset($args['sortBy']) ? $args['sortBy'] : 'field_name';
		$lazy = isset($args['lazy']) ? $args['lazy'] : false;
		$types = isset($args['types']) ? $args['types'] : null;
		$blockId = isset($args['blockId']) ? $args['blockId'] : null;

		$queryArgs = [];
		$sql = "
            SELECT
                f.id,
                f.block_id,
                f.meta_box_id,
                f.field_name as name,
                f.field_label as label,
                f.field_default_value as default_value,
                f.field_description,
                f.field_type,
                f.required,
                f.showInArchive,
                f.filter_in_admin,
                f.quick_edit,
                f.sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
        ";

		$sql .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id";
	    $sql .= " WHERE 1 = 1";

		if($types){
			$sql .= " AND f.field_type IN ('".implode("','", $types)."')";
		}

		if($blockId){
			$sql .= " AND f.block_id = %s";
			$queryArgs[] = $blockId;
		}

		$sql .= ' GROUP BY f.id ORDER BY f.'.$sortBy.' ASC;';

		$results = [];
		$fields = ACPT_Lite_DB::getResults($sql, $queryArgs);

		foreach ($fields as $fieldIndex => $field) {
			try {
				$boxModel = self::getMetaBoxById($field->meta_box_id);

				if($boxModel !== null){
					if($lazy){
						$results[] = MetaFieldModel::hydrateFromArray([
							'id'            => $field->id,
							'metaBox'       => $boxModel,
							'name'          => $field->name,
							'label'         => $field->label,
							'type'          => $field->field_type,
							'isRequired'    => $field->required,
							'defaultValue'  => $field->default_value,
							'description'   => $field->field_description,
							'showInArchive' => $field->showInArchive,
							'sort'          => $field->sort
						]);
					} else {
						$results[] = self::hydrateMetaBoxFieldModel($field, $boxModel);
					}
				}
			} catch (\Exception $exception){}
	    }

		return $results;
	}

	/**
	 * @return MetaFieldOptionModel[]
	 */
	public static function getAllOptions()
	{
		$results = [];
		$options = ACPT_Lite_DB::getResults("
            SELECT
                id,
                meta_box_id as boxId,
                meta_field_id as fieldId,
                option_label as label,
                option_value as value,
                sort,
                is_default
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."`
            ORDER BY sort
        ;", []);

		foreach ($options as $option){
			try {
				$fieldModel = self::getMetaFieldById($option->fieldId);
				$results[] = MetaFieldOptionModel::hydrateFromArray([
					'id' => $option->id,
					'metaField' => $fieldModel,
					'label' => $option->label,
					'value' => $option->value,
					'sort' => $option->sort,
					'isDefault' => $option->is_default == '0' ? false : true,
				]);
			} catch (\Exception $exception){}
		}

		return $results;
	}

	/**
	 * @param MetaGroupModel $group
	 *
	 * @throws \Exception
	 */
	public static function saveMetaGroup(MetaGroupModel $group)
	{
		ACPT_Lite_DB::startTransaction();

		$belongsToArray = [];

		try {
			$sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` 
                (
                    `id`,
                    `group_name`,
                    `label`,
                    `display`,
                    `priority`,
                    `context`
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
                    `display` = %s,
                    `priority` = %s,
                    `context` = %s
            ;";

			ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				$group->getId(),
				$group->getName(),
				$group->getLabel(),
				$group->getDisplay(),
				$group->getPriority(),
				$group->getContext(),
				$group->getName(),
				$group->getLabel(),
				$group->getDisplay(),
				$group->getPriority(),
				$group->getContext(),
			]);

			foreach($group->getBelongs() as $belong){
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
	                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$belong->getId(),
					$belong->getBelongsTo(),
					$belong->getOperator(),
					$belong->getFind(),
					$belong->getLogic(),
					$belong->getSort(),
					$belong->getBelongsTo(),
					$belong->getOperator(),
					$belong->getFind(),
					$belong->getLogic(),
					$belong->getSort(),
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
	                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$group->getId(),
					$belong->getId(),
					$group->getId(),
					$belong->getId(),
				]);

				$belongsToArray[] = $belong->getBelongsTo();
			}

			foreach ($group->getBoxes() as $boxModel){
				self::saveMetaBox($boxModel);
			}

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

		ACPT_Lite_DB::commitTransaction();
		ACPT_Lite_DB::flushCache();
	}

    /**
     * @param MetaBoxModel $metaBoxModel
     * @throws \Exception
     */
    public static function saveMetaBox(MetaBoxModel $metaBoxModel)
    {
        ACPT_Lite_DB::startTransaction();

        try {
            // Sync metadata BEFORE saving data
	        MetaSync::syncBox($metaBoxModel);

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
		        $metaBoxModel->getId(),
		        $metaBoxModel->getGroup()->getId(),
		        $metaBoxModel->getName(),
		        $metaBoxModel->getLabel(),
		        $metaBoxModel->getSort(),
		        $metaBoxModel->getGroup()->getId(),
		        $metaBoxModel->getName(),
		        $metaBoxModel->getLabel(),
		        $metaBoxModel->getSort()
	        ]);

			foreach ($metaBoxModel->getFields() as $fieldModel){
				self::saveMetaBoxField($fieldModel);
			}

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

        ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @param MetaFieldModel $fieldModel
	 * @throws \Exception
	 */
	public static function saveMetaBoxField(MetaFieldModel $fieldModel)
	{
		$metaBoxModel = $fieldModel->getBox();

		ACPT_Lite_DB::startTransaction();

		try {
			// Sync metadata BEFORE saving data
			MetaSync::syncField($fieldModel);
			self::saveMetaField($fieldModel);

			$arrayOfBlockNames = [];

			foreach ($fieldModel->getBlocks() as $blockModel){
				$newBlockName = Strings::getTheFirstAvailableName($blockModel->getName(), $arrayOfBlockNames);
				$blockModel->changeName($newBlockName);
				self::saveMetaBlock($blockModel);
			}

			ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_PERMISSION)."` WHERE entity_id = %s;", [$fieldModel->getId()]);

			foreach ($fieldModel->getPermissions() as $permissionModel){

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
					$permissionModel->getId(),
					$permissionModel->getEntityId(),
					$permissionModel->getUserRole(),
					serialize($permissionModel->getPermissions()),
					$permissionModel->getSort(),
					$permissionModel->getEntityId(),
					$permissionModel->getUserRole(),
					serialize($permissionModel->getPermissions()),
					$permissionModel->getSort(),
				]);
			}

			foreach ($fieldModel->getValidationRules() as $ruleModel){
			    $sql = "
			        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."` 
			        (
			            `id`,
			            `rule_condition`,
                        `rule_value`,
                        `message`
			        ) VALUES (
			            %s,
			            %s,
			            %s,
			            %s
			        ) ON DUPLICATE KEY UPDATE 
                        `rule_condition` = %s,
                        `rule_value` = %s,
                        `message` = %s
			    ";

			    ACPT_Lite_DB::executeQueryOrThrowException($sql, [
				    $ruleModel->getId(),
				    $ruleModel->getCondition(),
				    $ruleModel->getValue(),
				    $ruleModel->getMessage(),
				    $ruleModel->getCondition(),
				    $ruleModel->getValue(),
				    $ruleModel->getMessage(),
			    ]);

			    $sql = "
			        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FIELD_PIVOT)."` 
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
		    }

		    foreach ($fieldModel->getAdvancedOptions() as $advancedOptionModel){
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

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$advancedOptionModel->getId(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$advancedOptionModel->getKey(),
					$advancedOptionModel->getValue(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$advancedOptionModel->getKey(),
					$advancedOptionModel->getValue(),
				]);
			}

			foreach ($fieldModel->getOptions() as $optionModel){
				$sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` 
                    (`id`,
                    `meta_box_id` ,
                    `meta_field_id` ,
                    `option_label` ,
                    `option_value` ,
                    `sort`,
                    `is_default`
                    ) VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %d,
                        %s
                    ) ON DUPLICATE KEY UPDATE 
                        `meta_box_id` = %s,
                        `meta_field_id` = %s,
                        `option_label` = %s,
                        `option_value` = %s,
                        `sort` = %d,
                        `is_default` = %s
                ;";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$optionModel->getId(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$optionModel->getLabel(),
					$optionModel->getValue(),
					$optionModel->getSort(),
					$optionModel->isDefault(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$optionModel->getLabel(),
					$optionModel->getValue(),
					$optionModel->getSort(),
					$optionModel->isDefault()
				]);
			}

			foreach ($fieldModel->getChildren() as $childModel){
				self::saveMetaBoxField($childModel);
			}

			foreach ($fieldModel->getVisibilityConditions() as $visibilityCondition){
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

				$params = [
					$visibilityCondition->getId(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					json_encode($visibilityCondition->getType()),
					$visibilityCondition->getOperator(),
					(string)$visibilityCondition->getValue(),
					$visibilityCondition->getLogic(),
					$visibilityCondition->isBackEnd(),
					$visibilityCondition->isFrontEnd(),
					$visibilityCondition->getSort(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					json_encode($visibilityCondition->getType()),
					$visibilityCondition->getOperator(),
					(string)$visibilityCondition->getValue(),
					$visibilityCondition->getLogic(),
					$visibilityCondition->isBackEnd(),
					$visibilityCondition->isFrontEnd(),
					$visibilityCondition->getSort(),
				];

				ACPT_Lite_DB::executeQueryOrThrowException($sql, $params);
			}

			foreach ($fieldModel->getRelations() as $relationModel){

				$a = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getBox()->getId()  : 'NULL';
				$b = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getBox()->getName()  : 'NULL';
				$c = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getId() : 'NULL';
				$d = ($relationModel->getInversedBy() !== null) ? $relationModel->getInversedBy()->getName() : 'NULL';

				$sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."`
                    (
                        `id`,
                        `meta_box_id`,
                        `meta_field_id`,
                        `relationship`,
                        `relation_from`,
                        `relation_to`,
                        `inversed_meta_box_id`,
                        `inversed_meta_box_name`,
                        `inversed_meta_field_id`,
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
					$relationModel->getId(),
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$relationModel->getRelationship(),
					$relationModel->from()->humanReadableJsonFormat(),
					$relationModel->to()->humanReadableJsonFormat(),
					$a,
					$b,
					$c,
					$d,
					$metaBoxModel->getId(),
					$fieldModel->getId(),
					$relationModel->getRelationship(),
					$relationModel->from()->humanReadableJsonFormat(),
					$relationModel->to()->humanReadableJsonFormat(),
					$a,
					$b,
					$c,
					$d,
				]);

				// Update related field
				if($relationModel->getInversedBy() !== null){

					$inversedFieldModel = $relationModel->getInversedBy();
					$inversedRelationModel = self::findInversedRelation($relationModel);
					$id = $inversedRelationModel !== null ? $inversedRelationModel->getId() : Uuid::v4();

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
						$id,
						$inversedFieldModel->getBox()->getId(),
						$inversedFieldModel->getId(),
						$relationModel->getOppositeRelationship(),
						$relationModel->to()->humanReadableJsonFormat(),
						$relationModel->from()->humanReadableJsonFormat(),
						$metaBoxModel->getId(),
						$metaBoxModel->getName(),
						$fieldModel->getId(),
						$fieldModel->getName(),
						$inversedFieldModel->getBox()->getId(),
						$inversedFieldModel->getId(),
						$relationModel->getOppositeRelationship(),
						$relationModel->to()->humanReadableJsonFormat(),
						$relationModel->from()->humanReadableJsonFormat(),
						$metaBoxModel->getId(),
						$metaBoxModel->getName(),
						$fieldModel->getId(),
						$fieldModel->getName()
					]);

					$sql = "UPDATE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
                        SET `field_type` = %s
                        WHERE id = %s
                    ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						MetaFieldModel::POST_TYPE,
						$inversedFieldModel->getId()
					]);

					$inversedFieldModel->changeType(MetaFieldModel::POST_TYPE);
					$inversedFieldModel->addRelation($relationModel);

					if($metaBoxModel->hasField($inversedFieldModel)){
						$metaBoxModel->removeField($inversedFieldModel);
						$metaBoxModel->addField($inversedFieldModel);
					}
				}
			}

			if($fieldModel->getType() !== MetaFieldModel::POST_TYPE or ($fieldModel->getRelations()[0] !== null and !$fieldModel->getRelations()[0]->isBidirectional())){
				$query = "
                    SELECT *
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` r ON r.meta_field_id = f.id
                    WHERE f.`field_type` = %s
                    AND f.id != %s
                    AND r.inversed_meta_field_id = %s
                    GROUP BY f.id
                ";

				$results = ACPT_Lite_DB::getResults($query, [
					MetaFieldModel::POST_TYPE,
					$fieldModel->getId(),
					$fieldModel->getId()
				]);

				foreach ($results as $result){
					$sql = "UPDATE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."`
                        SET
                            `relationship` = '".str_replace("Bi", "Uni", $result->relationship)."',
                            `inversed_meta_box_id` = NULL,
                            `inversed_meta_box_name` = NULL,
                            `inversed_meta_field_id` = NULL,
                            `inversed_meta_field_name` = NULL
                        WHERE inversed_meta_field_id = %s
                    ;";

					ACPT_Lite_DB::executeQueryOrThrowException($sql, [
						$result->inversed_meta_field_id
					]);
				}
			}

		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

	    ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param MetaFieldModel $fieldModel
	 *
	 * @throws \Exception
	 */
	private static function saveMetaField(MetaFieldModel $fieldModel)
	{
		$showInArchive = $fieldModel->isShowInArchive() ? '1' : '0';
		$isRequired = $fieldModel->isRequired() ? '1' : '0';
		$isFilterableInAdmin = $fieldModel->isFilterableInAdmin() ? '1' : '0';
		$isForQuickEdit = $fieldModel->isForQuickEdit() ? '1' : '0';
		$metaBoxModel = $fieldModel->getBox();

		$data = [
			'fields' => [
				'meta_box_id',
				'field_name',
				'field_label',
				'field_type',
				'field_default_value',
				'field_description',
				'showInArchive',
				'required',
				'sort',
			],
			'types'  => [
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%d',
			],
			'values' => [
				$metaBoxModel->getId(),
				$fieldModel->getName(),
				$fieldModel->getLabel(),
				$fieldModel->getType(),
				$fieldModel->getDefaultValue(),
				$fieldModel->getDescription(),
				$showInArchive,
				$isRequired,
				$fieldModel->getSort(),
			],
		];

		if($fieldModel->getParentId() !== null){
			$data['fields'][] = 'parent_id';
			$data['types'][] = '%s';
			$data['values'][] = $fieldModel->getParentId();
		}

		if($fieldModel->getBlockId() !== null){
			$data['fields'][] = 'block_id';
			$data['types'][] = '%s';
			$data['values'][] = $fieldModel->getBlockId();
		}

		if($fieldModel->isForQuickEdit() !== null){
			$data['fields'][] = 'quick_edit';
			$data['types'][] = '%s';
			$data['values'][] = $isForQuickEdit;
		}

		if($fieldModel->isFilterableInAdmin() !== null){
			$data['fields'][] = 'filter_in_admin';
			$data['types'][] = '%s';
			$data['values'][] = $isFilterableInAdmin;
		}

		$sql = "INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` ( `id`,";

		foreach ($data['fields'] as $index => $field){
			$sql .= '`'.$field.'`';

			if($index < (count($data['fields'])-1)){
				$sql .= ',';
			}
		}

		$sql .= ') VALUES ( %s,';

		foreach ($data['types'] as $index => $type){
			$sql .= $type;

			if($index < (count($data['fields'])-1)){
				$sql .= ',';
			}
		}

		$sql .= ') ON DUPLICATE KEY UPDATE ';

		foreach ($data['fields'] as $index => $field){
			$sql .= '`'.$field.'` = ' . $data['types'][$index];

			if($index < (count($data['fields'])-1)){
				$sql .= ',';
			}
		}

		$sql .= ';';

		$params = [
			$fieldModel->getId(),
		];

		foreach ($data['values'] as $values){
			$params[] = $values;
		}

		foreach ($data['values'] as $values){
			$params[] = $values;
		}

	    ACPT_Lite_DB::executeQueryOrThrowException($sql, $params);
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @param MetaFieldBlockModel $blockModel
	 *
	 * @throws \Exception
	 */
	public static function saveMetaBlock(MetaFieldBlockModel $blockModel)
	{
		$metaBoxModel = $blockModel->getMetaField()->getBox();
		$fieldModel = $blockModel->getMetaField();

		ACPT_Lite_DB::startTransaction();

		try {
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
				$blockModel->getId(),
				$metaBoxModel->getId(),
				$fieldModel->getId(),
				$blockModel->getName(),
				$blockModel->getLabel(),
				$blockModel->getSort(),
				$metaBoxModel->getId(),
				$fieldModel->getId(),
				$blockModel->getName(),
				$blockModel->getLabel(),
				$blockModel->getSort(),
			]);

			$arrayOfBlockFieldNames = [];
			foreach ($blockModel->getFields() as $nestedFieldModel){
				$nestedFieldModel->changeName(Strings::getTheFirstAvailableName($nestedFieldModel->getName(), $arrayOfBlockFieldNames));
				$arrayOfBlockFieldNames[] = $nestedFieldModel->getName();
				self::saveMetaBoxField($nestedFieldModel);
			}
		} catch (\Exception $exception){
			ACPT_Lite_DB::rollbackTransaction();
		}

	    ACPT_Lite_DB::commitTransaction();
	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @param array $args
	 * @throws \Exception
	 */
	public static function removeMetaOrphans(array $args)
	{
		$mandatoryKeys = [
        	'groupId'  => [
		        'required' => true,
		        'type' => 'string',
	        ],
	        'ids' => [
		        'required' => true,
		        'type' => 'array',
	        ],
        ];

		self::validateArgs($mandatoryKeys, $args);

		$ids = $args['ids'];
		$groupId = $args['groupId'];

		// Delete metadata
		$deleteMetadata = Settings::get(SettingsModel::DELETE_POSTMETA_KEY, 0);

	    // Delete ACPT definitions
        $belongQuery = "
            SELECT 
                b.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` bb on bb.belong_id = b.id
            WHERE bb.group_id = %s
        ";

        if(isset($ids['belongs']) and !empty($ids['belongs'])){
            $belongQuery .= " AND bb.belong_id NOT IN ('".implode("','",$ids['belongs'])."')";
        }

        $belongQuery .= "GROUP BY b.id;";
        $belongs = ACPT_Lite_DB::getResults($belongQuery, [$groupId]);

        foreach ($belongs as $belong){

            // @TODO delete belong from cache

            $sql = "
	            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."`
                WHERE id = %s
            ";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$belong->id]);
        }

	    $deleteBelongsQuery = "
	        DELETE b
	        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` b
	        WHERE b.group_id = %s
	    ";

	    if(isset($ids['belongs']) and !empty($ids['belongs'])){
		    $deleteBelongsQuery .= " AND b.belong_id NOT IN ('".implode("','",$ids['belongs'])."')";
	    }

	    $deleteBelongsQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteBelongsQuery, [
		    $groupId,
	    ]);

	    $deleteFieldsQuery = "
			DELETE f 
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f 
			LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id=f.meta_box_id 
			WHERE b.group_id = %s
		";

	    if(isset($ids['fields']) and !empty($ids['fields'])){
		    $deleteFieldsQuery .= " AND f.id NOT IN ('".implode("','",$ids['fields'])."')";
	    }

	    $deleteFieldsQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteFieldsQuery, [
		    $groupId,
	    ]);

	    // Delete options
	    $deleteOptionsQuery = "
	    	DELETE o
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_OPTION)."` o
			LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id=o.meta_box_id
			WHERE b.group_id = %s
	    ";

	    if(isset($ids['options']) and !empty($ids['options'])){
		    $deleteOptionsQuery .= " AND o.id NOT IN ('".implode("','",$ids['options'])."')";
	    }

	    $deleteOptionsQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteOptionsQuery, [
		    $groupId,
	    ]);

	    // Delete relations
	    $deleteRelationsQuery = "
	        DELETE r
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` r
			LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id=r.meta_box_id
			WHERE b.group_id = %s
	    ";

	    if(isset($ids['relations']) and !empty($ids['relations'])){
		    $deleteRelationsQuery .= " AND r.id NOT IN ('".implode("','",$ids['relations'])."')";
	    }

	    $deleteRelationsQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteRelationsQuery, [
		    $groupId,
	    ]);

	    // Delete visibility conditions
	    $deleteVisibilityConditionsQuery = "
	    	DELETE v
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_VISIBILITY)."` v
			LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id=v.meta_box_id
			WHERE b.group_id = %s
	    ";

	    if(isset($ids['visibilityConditions']) and !empty($ids['visibilityConditions'])){
		    $deleteVisibilityConditionsQuery .= " AND v.id NOT IN ('".implode("','",$ids['visibilityConditions'])."')";
	    }

	    $deleteVisibilityConditionsQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteVisibilityConditionsQuery, [
		    $groupId,
	    ]);

	    // Delete validation rules
		$deleteValidationRulesQuery = "
	    	DELETE r
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE)."` r
			WHERE 1=1
	    ";

		if(isset($ids['validationRules']) and !empty($ids['validationRules'])){
			$deleteValidationRulesQuery .= " AND r.id NOT IN ('".implode("','",$ids['validationRules'])."')";
		}

		$deleteValidationRulesQuery .= ";";

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery);

		$deleteValidationRulesQuery = "
	    	DELETE r
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_VALIDATION_RULE_FIELD_PIVOT)."` r
			WHERE 1=1
	    ";

		if(isset($ids['validationRules']) and !empty($ids['validationRules'])){
			$deleteValidationRulesQuery .= " AND r.rule_id NOT IN ('".implode("','",$ids['validationRules'])."')";
		}

		$deleteValidationRulesQuery .= ";";

		ACPT_Lite_DB::executeQueryOrThrowException($deleteValidationRulesQuery);

		// Delete blocks
	    $deleteBlocksQuery = "
	    	DELETE bl
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."` bl
			LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id=bl.meta_box_id
			WHERE b.group_id = %s
	    ";

	    if(isset($ids['blocks']) and !empty($ids['blocks'])){
		    $deleteBlocksQuery .= " AND bl.id NOT IN ('".implode("','",$ids['blocks'])."')";
	    }

	    $deleteBlocksQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteBlocksQuery, [
		    $groupId,
	    ]);

	    $deleteBoxesQuery = "
	        DELETE b
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b
			WHERE b.group_id = %s
	    ";

	    if(isset($ids['boxes']) and !empty($ids['boxes'])){
		    $deleteBoxesQuery .= " AND id NOT IN ('".implode("','",$ids['boxes'])."')";
	    }

	    $deleteBoxesQuery .= ";";

	    ACPT_Lite_DB::executeQueryOrThrowException($deleteBoxesQuery, [
		    $groupId,
	    ]);

	    // Delete metadata
	    if($deleteMetadata == 1){
		    $queryForIdsToDelete = "
		            SELECT f.id
		             	FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
						LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
						WHERE b.group_id = %s
						AND f.id NOT IN ('".implode("','", $ids['fields'])."')
						AND f.parent_id IS NULL
					;
		        ";

		    $fieldsToBeDeleted = ACPT_Lite_DB::getResults($queryForIdsToDelete, [
			    $groupId,
		    ]);

		    $fieldIds = [];
		    foreach ($fieldsToBeDeleted as $fieldToBeDeleted){
			    $fieldIds[] = $fieldToBeDeleted->id;
		    }

		    if(!empty($fieldIds)){
			    self::deletePostMetaData($fieldIds);
			    self::deleteTaxonomyMetaData($fieldIds);
			    self::deleteOptionPageMetaData($fieldIds);
		    }
	    }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * Delete all post meta data for a given fieldIds list
	 *
	 * @param $fieldIds
	 *
	 * @throws \Exception
	 */
	private static function deletePostMetaData($fieldIds)
	{
		global $wpdb;

		foreach ($fieldIds as $fieldId){

			$baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

			$field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

			if($field->meta_box_name !== null and $field->field_name !== null){
				$metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

				$sql = "DELETE FROM `{$wpdb->prefix}postmeta` WHERE meta_key=%s";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName
				]);

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                    $metaFieldName.'_type'
                ]);
            }
        }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @param $fieldIds
	 *
	 * @throws \Exception
	 */
	private static function deleteTaxonomyMetaData($fieldIds)
	{
		global $wpdb;

		foreach ($fieldIds as $fieldId){

			$baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

			$field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

			if($field->meta_box_name !== null and $field->field_name !== null){
				$metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

				$sql = "DELETE FROM `{$wpdb->prefix}termmeta` WHERE meta_key=%s";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName
				]);

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName.'_type'
				]);
			}
		}

		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $fieldIds
	 *
	 * @throws \Exception
	 */
	private static function deleteUserMetaData($fieldIds)
	{
		global $wpdb;

		foreach ($fieldIds as $fieldId){

			$baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

			$field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

			if($field->meta_box_name !== null and $field->field_name !== null){
				$metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

				$sql = "DELETE FROM `{$wpdb->prefix}usermeta` WHERE meta_key=%s";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName
				]);

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName.'_type'
				]);
			}
		}

		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @param $fieldIds
	 *
	 * @throws \Exception
	 */
	private static function deleteOptionPageMetaData($fieldIds)
	{
		global $wpdb;

		foreach ($fieldIds as $fieldId){

			$baseQuery = "
                    SELECT 
                        b.meta_box_name,
                        f.field_name,
                        f.field_type
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
                    WHERE f.id = %s AND parent_id IS NULL
                ";

			$field = ACPT_Lite_DB::getResults($baseQuery, [$fieldId])[0];

			if($field->meta_box_name !== null and $field->field_name !== null){
				$metaFieldName = Strings::toDBFormat($field->meta_box_name).'_'.Strings::toDBFormat($field->field_name);

				$sql = "DELETE FROM `{$wpdb->prefix}options` WHERE option_name=%s";

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName
				]);

				ACPT_Lite_DB::executeQueryOrThrowException($sql, [
					$metaFieldName.'_type'
				]);
			}
		}

		ACPT_Lite_DB::invalidateCacheTag(self::class);
	}

	/**
	 * @throws \Exception
	 */
	public static function removeOrphanBoxesAndFields()
	{
		$query = "DELETE f, b from `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f 
            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g ON g.id = b.group_id 
            WHERE g.id IS NULL;";

		ACPT_Lite_DB::executeQueryOrThrowException($query, []);
	}

	/**
	 * @throws \Exception
	 */
	public static function removeOrphanBlocks()
	{
		$query = "
            SELECT  id, 
                meta_box_id, 
                meta_field_id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."`
        ";

		$deleteQuery = "
            DELETE 
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BLOCK)."` 
            WHERE id = %s;
        ";

		$checkFieldQuery = "
            SELECT id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
            WHERE id = %s;
        ";

		$results = ACPT_Lite_DB::getResults($query);

		foreach ($results as $result){

			$check = ACPT_Lite_DB::getResults($checkFieldQuery, [$result->meta_field_id]);

		    if(count($check) === 0){
			    ACPT_Lite_DB::executeQueryOrThrowException($deleteQuery, [$result->id]);
		    }
	    }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @throws \Exception
	 */
	public static function removeOrphanVisibilityConditions()
	{
		$query = "
            SELECT  id, 
                meta_box_id, 
                meta_field_id, 
                visibility_type
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_VISIBILITY)."`
        ";

		$deleteQuery = "
            DELETE 
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_VISIBILITY)."` 
            WHERE id = %s;
        ";

        $checkBoxQuery = "
            SELECT id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
            WHERE id = %s;
        ";

        $checkFieldQuery = "
            SELECT id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
            WHERE id = %s;
        ";

		$checkTaxonomyFieldQuery = "
            SELECT id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY)."`
            WHERE id = %s;
        ";

		$results = ACPT_Lite_DB::getResults($query);

		foreach ($results as $result){

			$checkBox = ACPT_Lite_DB::getResults($checkBoxQuery, [$result->meta_box_id]);


            if(count($checkBox) === 0){
				ACPT_Lite_DB::executeQueryOrThrowException($deleteQuery, [$result->id]);
			}

			$checkCustomPostTypeField = ACPT_Lite_DB::getResults($checkFieldQuery, [$result->meta_field_id]);
			$checkTaxonomyField = ACPT_Lite_DB::getResults($checkTaxonomyFieldQuery, [$result->meta_field_id]);
			if(count($checkCustomPostTypeField) === 0 and count($checkTaxonomyField) === 0){
				ACPT_Lite_DB::executeQueryOrThrowException($deleteQuery, [$result->id]);
			}

			$visibilityType = json_decode($result->visibility_type, true);
			$visibilityTypeEnum = $visibilityType['type'];
			$visibilityTypeValue = $visibilityType['value'];

			if($visibilityTypeEnum === 'OTHER_FIELDS'){

				if(isset($visibilityTypeValue['id'])){
					$idToDelete = $visibilityTypeValue['id'];
				} else {
					$idToDelete = $visibilityTypeValue;
				}

				$checkCustomPostTypeField = ACPT_Lite_DB::getResults($checkFieldQuery, [$idToDelete]);
	            $checkTaxonomyField = ACPT_Lite_DB::getResults($checkTaxonomyFieldQuery, [$idToDelete]);
	            if(count($checkCustomPostTypeField) === 0 and count($checkTaxonomyField) === 0){
                    ACPT_Lite_DB::executeQueryOrThrowException($deleteQuery, [$result->id]);
                }
            }
        }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @throws \Exception
	 */
	public static function removeOrphanRelationships()
	{
		$query = "
            SELECT f.`id`, r.`inversed_meta_field_id`, r.`relationship`
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` r ON r.meta_field_id = f.id
            WHERE f.`field_type` = %s
            AND r.`relationship` LIKE '%Bi'
        ";

		// set all orphan fields with a orphan relationship to TEXT
		$results = ACPT_Lite_DB::getResults($query, [
			MetaFieldModel::POST_TYPE
		]);

		if(count($results) > 0) {
			foreach ( $results as $result ) {

				$subquery = "
                    SELECT f.id
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
                    WHERE f.`id` = %s
                ";

				$subResults = ACPT_Lite_DB::getResults( $subquery, [$result->inversed_meta_field_id] );

				if ( count( $subResults ) === 0 ) {
					$sql = "DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` WHERE meta_field_id = %s;";
					ACPT_Lite_DB::executeQueryOrThrowException( $sql, [
						$result->id
					] );

					$sql = "UPDATE `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` SET `field_type` = %s WHERE id = %s;";
					ACPT_Lite_DB::executeQueryOrThrowException( $sql, [
						MetaFieldModel::TEXT_TYPE,
						$result->id
					] );
				}
			}
		}

		// check if there are persisted relationship on a NON POST type field
		$query = "
            SELECT r.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` r
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f ON f.id = r.meta_field_id 
            WHERE f.`field_type` != %s
        ";

		$results = ACPT_Lite_DB::getResults($query, [
			MetaFieldModel::POST_TYPE
		]);

		if(count($results) > 0) {
			foreach ( $results as $result ) {
				$sql = "DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION)."` WHERE id = %s;";
                ACPT_Lite_DB::executeQueryOrThrowException( $sql, [
                    $result->id
                ] );
            }
        }

	    ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

	/**
	 * @param MetaFieldRelationshipModel $relationModel
	 *
	 * @return MetaFieldRelationshipModel|null
	 * @throws \Exception
	 */
    public static function findInversedRelation(MetaFieldRelationshipModel $relationModel): ?MetaFieldRelationshipModel
    {
    	if($relationModel->getInversedBy() === null){
    		return null;
	    }

	    try {
		    $relations = ACPT_Lite_DB::getResults('
		        SELECT
	                id,
	                meta_box_id as boxId,
	                meta_field_id as fieldId,
	                relationship as type,
	                relation_from,
	                relation_to,
	                inversed_meta_box_id as inversedBoxId,
	                inversed_meta_box_name as inversedBoxName,
	                inversed_meta_field_id as inversedFieldId,
	                inversed_meta_field_name as inversedFieldName
	            FROM `'.ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_RELATION).'`
	            WHERE 
	                meta_box_id = %s AND
	                meta_field_id = %s 
		        ;', [
					    $relationModel->getInversedBy()->getBox()->getId(),
					    $relationModel->getInversedBy()->getId(),
				    ]
			    );

		    foreach ($relations as $relation){
				if(!empty($relation->type)){
					$fromJson = json_decode($relation->relation_from);
					$toJson = json_decode($relation->relation_to);

					$from = new RelatedEntityValueObject($fromJson->type, $fromJson->value);
					$to = new RelatedEntityValueObject($toJson->type, $toJson->value);

					$inversedRelationModel = MetaFieldRelationshipModel::hydrateFromArray([
						'id' => $relation->id,
						'relationship' => $relation->type,
						'from' => $from,
						'to' => $to,
						'metaField' => $relationModel->getInversedBy(),
					]);

					$inversedRelationModel->setInversedBy($relationModel->getMetaField());

					return $inversedRelationModel;
				}
		    }

	    } catch (\Exception $exception){
    		return null;
	    }

	    return null;
    }

    /**
     * @return array
     */
    public static function getAllAssociatedPostTypesAndTaxonomies()
    {
        $postTypeNames = [];
        $taxonomyNames = [];

        $sql = "SELECT 
		        	b.find,
		        	b.belongs
	            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_BELONG)."` b
	            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP_BELONG)."` bb on bb.belong_id = b.id
	            GROUP BY b.id
	            ORDER BY b.sort";

        $belongs = ACPT_Lite_DB::getResults($sql, []);

        foreach ($belongs as $belong){

            $find = explode(",", $belong->find);

            switch ($belong->belongs){

                // 1. CUSTOM_POST_TYPE
                case MetaTypes::CUSTOM_POST_TYPE:
                    $postTypeNames = array_merge($postTypeNames, $find);
                    break;

                // 2. PARENT_POST_ID
                case BelongsTo::PARENT_POST_ID:

                    foreach ($find as $postId){
                        $postTypeNames[] = get_post_type($postId);

                        $childPages = get_children([
                            'post_parent' => $postId
                        ]);

                        foreach ($childPages as $child) {
                            $postTypeNames[] = get_post_type($child->ID);
                        }
                    }

                    break;

                // 3. POST_ID
                case BelongsTo::POST_ID:
                    foreach ($find as $postId){
                        $postTypeNames[] = get_post_type($postId);
                    }

                    break;

                // 4. POST_TEMPLATE
                case BelongsTo::POST_TEMPLATE:
                    foreach ($find as $postId){
                        $file = Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, '_wp_page_template', true);
                        $postTypeNames[] = $file;
                    }

                    break;

                // 5. POST_TAX
                case BelongsTo::POST_TAX:
                case BelongsTo::POST_CAT:
                    foreach ($find as $termId){
                        $posts = Posts::getForTermId($termId);

                        foreach ($posts as $post){
                            $postTypeNames[] = get_post_type($post->object_id);
                        }
                    }

                    break;

                // 6. TAXONOMY
                case MetaTypes::TAXONOMY:
                    $taxonomyNames = array_merge($taxonomyNames, $find);
                    break;

                // 7. TERM_ID
                case BelongsTo::TERM_ID:
                    foreach ($find as $termId){
                        $term = get_term( $termId );

                        if($term instanceof \WP_Term){
                            $taxonomyNames[] = $term->name;
                        }
                    }

                    break;
            }
        }

        return [
            'postTypeNames' => array_unique($postTypeNames),
            'taxonomyNames' => array_unique($taxonomyNames),
        ];
    }

	/**
	 * ***********************************
	 *  GENERAL PURPOSE METHODS
	 * ***********************************
	 */

	/**
	 * @param array $keys
	 * @return array
	 */
	private static function mandatoryKeys(array $keys = [])
	{
		$mandatoryKeys = [
			'belongsTo' => [
				'required' => false,
                'type' => 'string',
                'enum' => [
                	BelongsTo::POST_ID,
                	BelongsTo::USER_ID,
                	BelongsTo::TERM_ID,
                    MetaTypes::CUSTOM_POST_TYPE,
                    MetaTypes::TAXONOMY,
                    MetaTypes::OPTION_PAGE,
                    MetaTypes::USER,
                    MetaTypes::MEDIA,
                    MetaTypes::COMMENT,
                ],
            ],
            'find' => [
                'required' => false,
                'type' => 'integer|string',
			],
		];

        return array_merge($keys, $mandatoryKeys);
    }
}