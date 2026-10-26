<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Belong\BelongModel;
use ACPT_Lite\Core\Models\Meta\MetaBoxModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldModel;
use ACPT_Lite\Core\Models\Meta\MetaFieldOptionModel;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Core\Models\Settings\SettingsModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\MetaSync\MetaSync;
use ACPT_Lite\Utils\PHP\Arrays;
use ACPT_Lite\Utils\Settings\Settings;
use ACPT_Lite\Utils\Wordpress\Posts;

class MetaRepository extends AbstractRepository
{
    /**
     * @param array<string, mixed> $args
     * @return int
     */
    public static function count(array $args = []): int
    {
        $baseQuery = "SELECT count(id) as count FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` WHERE 1 = 1";
        $queryArgs = [];

        if (isset($args['groupName'])) {
            $baseQuery .= " AND group_name = %s";
            $queryArgs[] = $args['groupName'];
        }

        if (isset($args['search'])) {
            $baseQuery .= " AND group_name LIKE %s";
            $queryArgs[] = "%" . $args['search'] . "%";
        }

        $results = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

        return (int)$results[0]->count;
    }

    /**
     * Delete all meta groups
     *
     * @param array<string, mixed> $args
     * @return bool
     * @throws \Exception
     */
    public static function deleteAll(array $args)
    {
        self::validateArgs(self::mandatoryKeys([]), $args);

        $groups = self::get($args);

        if (empty($groups)) {
            return false;
        }

        ACPT_Lite_DB::startTransaction();

        foreach ($groups as $groupModel) {
            self::deleteMetaGroup($groupModel->getId());
        }

        ACPT_Lite_DB::commitTransaction();
        ACPT_Lite_DB::invalidateCacheTag(self::class);

        return true;
    }

    /**
     * @param string $belongsTo
     * @param string $find
     * @return void
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

        foreach ($belongs as $belong) {
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
     * @return void
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

            foreach ($belongs as $belong) {
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

            if (!empty($boxes)) {
                foreach ($boxes as $box) {
                    self::deleteMetaBox($box->id);
                }
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
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
     * @return void
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
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        ACPT_Lite_DB::commitTransaction();
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete meta box by its id
     *
     * @param array<string, mixed> $args
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

        if (null !== $metaBoxModel) {
            self::deleteMetaBox($id);
        }

        return false;
    }

    /**
     * Delete meta field model
     *
     * @param string $fieldId
     * @return void
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
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        ACPT_Lite_DB::commitTransaction();
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Check if a meta box exists by its name
     *
     * @param array<string, mixed> $args
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

        if (empty($records)) {
            return false;
        }

        return Arrays::count($records) === 1;
    }

    /**
     * Check if a meta field exists by its name. Field names only need to be unique within
     * their box (the meta key is <box>_<field>), so pass `boxName` to scope the check;
     * without it the check is site-wide. `excludeFieldId` ignores the field being edited.
     *
     * @param array<string, mixed> $args
     * @return bool
     * @throws \Exception
     */
    public static function existsMetaField(array $args)
    {
        $mandatoryKeys = [
            'fieldName' => [
                'required' => true,
                'type' => 'string',
            ],
            'boxName' => [
                'required' => false,
                'type' => 'string',
            ],
            'excludeFieldId' => [
                'required' => false,
                'type' => 'string',
            ],
        ];

        self::validateArgs($mandatoryKeys, $args);

        $baseQuery = "
            SELECT
                f.id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON b.id = f.meta_box_id
            WHERE f.field_name = %s
        ";

        $queryArgs = [$args['fieldName']];

        if (!empty($args['boxName'])) {
            $baseQuery .= " AND b.meta_box_name = %s";
            $queryArgs[] = $args['boxName'];
        }

        if (!empty($args['excludeFieldId'])) {
            $baseQuery .= " AND f.id != %s";
            $queryArgs[] = $args['excludeFieldId'];
        }

        $records = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

        return !empty($records);
    }

    /**
     * @param $excludeId
     *
     * @return array
     */
    /**
     * @param string $excludeId
     * @return array<mixed>
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
     * @param array<string, mixed> $args
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
            'sort' => [
                'required' => false,
                'type' => 'string',
            ],
            'search' => [
                'required' => false,
                'type' => 'string',
            ],
            'order' => [
                'required' => false,
                'type' => 'string',
            ],
            'postId' => [
                'required' => false,
                'type' => 'integer|string',
            ],
            'lazy' => [
                'required' => false,
                'type' => 'boolean',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $id = isset($args['id']) ? $args['id'] : null;
        $belongsTo = isset($args['belongsTo']) ? $args['belongsTo'] : null;
        $groupName = isset($args['groupName']) ? $args['groupName'] : null;
        $postIdFromContext = isset($args['postId']) ? $args['postId'] : null; // post ID injected from the context
        $find = isset($args['find']) ? $args['find'] : null;
        $lazy = isset($args['lazy']) ? $args['lazy'] : false;
        $boxName = isset($args['boxName']) ? $args['boxName'] : false;
        $excludeField = isset($args['excludeField']) ? $args['excludeField'] : null;
        $formBuilder = isset($args['formBuilder']) ? $args['formBuilder'] : false;
        $clonedFields = (isset($args['clonedFields']) && $args['clonedFields'] === true) ? true : false;
        $order = isset($args['order']) ? $args['order'] : null;
        $sort = isset($args['sort']) ? $args['sort'] : null;
        $search = isset($args['search']) ? $args['search'] : null;

        $results = self::getResults(
            $id,
            $groupName,
            $boxName,
            $lazy,
            $excludeField,
            $belongsTo,
            $find,
            $clonedFields,
            $formBuilder,
            $order,
            $sort,
            $search
        );

        // apply visibility conditions
        return array_values(array_filter($results, function (MetaGroupModel $groupModel) use ($belongsTo, $find, $postIdFromContext) {
            if ($belongsTo) {
                return $groupModel->isVisible([
                    'belongsTo' => $belongsTo,
                    'find' => $find,
                    'post_id' => $postIdFromContext,
                ], ACPT_Lite_Plugin::getRequest());
            }

            return true;
        }));
    }

    /**
     * @param string|null $id
     * @param string|null $groupName
     * @param string|null $boxName
     * @param bool $lazy
     * @param string|null $excludeField
     * @param string|null $belongsTo
     * @param string|null $find
     * @param bool $clonedFields
     * @param bool $formBuilder
     * @param string|null $order
     * @param string|null $sort
     * @param string|null $search
     *
     * @return MetaGroupModel[]
     * @throws \Exception
     */
    private static function getResults(
        $id = null,
        $groupName  = null,
        $boxName  = null,
        $lazy = false,
        $excludeField = null,
        $belongsTo = null,
        $find = null,
        $clonedFields = false,
        $formBuilder = false,
        $order = null,
        $sort = null,
        $search = null
    ) {
        $cachedId = "meta_get";

        if ($id) {
            $cachedId .= "_".$id;
        }

        if ($belongsTo) {
            $cachedId .= "_".$belongsTo;
        }

        if ($groupName) {
            $cachedId .= "_".$groupName;
        }

        if ($find) {
            $cachedId .= "_".$find;
        }

        if ($lazy) {
            $cachedId .= "_lazy";
        }

        if ($boxName) {
            $cachedId .= "_".$boxName;
        }

        if ($excludeField) {
            $cachedId .= "_excludeField";
        }

        if ($formBuilder) {
            $cachedId .= "_formBuilder";
        } else {
            $cachedId .= "_formBuilder_false";
        }

        if ($clonedFields) {
            $cachedId .= "_clonedFields";
        } else {
            $cachedId .= "_clonedFields_false";
        }

        if ($order && $sort) {
            $cachedId .= "_order_".$order."_sort_".$sort;
        }

        if ($search) {
            $cachedId .= "_search_".$search;
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

        $results = [];
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

        if ($id !== null) {
            $groupQuery .= " AND g.id = %s";
            $groupQueryArgs[] = $id;
        }

        if ($groupName !== null) {
            $groupQuery .= " AND g.group_name = %s";
            $groupQueryArgs[] = $groupName;
        }

        if ($search !== null) {
            $groupQuery .= " AND g.group_name LIKE %s";
            $groupQueryArgs[] = "%".$search."%";
        }

        $groupQuery .= ' GROUP BY g.id';

        if ($sort !== null && $order !== null) {
            $groupQuery .= " ORDER BY ".$sort." ".$order;
        } else {
            $groupQuery .= ' ORDER BY g.group_name ASC';
        }

        $groups = ACPT_Lite_DB::getResults($groupQuery, $groupQueryArgs);
        $groupModels = [];

        foreach ($groups as $group) {
            $groupModel = MetaGroupModel::hydrateFromArray([
                    'id'       => $group->id,
                    'name'     => $group->name,
                    'label'    => $group->label,
                    'display'    => $group->display,
            ]);

            if (!empty($group->priority)) {
                $groupModel->setPriority($group->priority);
            }

            if (!empty($group->context)) {
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

            foreach ($belongs as $belong) {
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

        foreach ($groupModels as $groupModel) {
            if ($lazy === false) {
                $boxesQueryArgs = [
                    $groupModel->getId()
                ];

                $boxesQuery = "
                    SELECT
                        id,
                        group_id,
                        meta_box_name as name,
                        meta_box_label as label,
                        settings,
                        sort
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
                    WHERE group_id = %s
                ";

                if ($boxName) {
                    $boxesQuery .= " AND meta_box_name = %s";
                    $boxesQueryArgs[] = $boxName;
                }

                $boxesQuery .= " ORDER BY sort";

                $boxes = ACPT_Lite_DB::getResults($boxesQuery, $boxesQueryArgs);

                foreach ($boxes as $box) {
                    $boxModel = MetaBoxModel::hydrateFromArray([
                        'id' => $box->id,
                        'group' => $groupModel,
                        'name' => $box->name,
                        'sort' => $box->sort,
                        'label' => $box->label,
                    ]);

                    if (!empty($box->settings)) {
                        $boxModel->setSettings(json_decode($box->settings, true));
                    }

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

                    if ($excludeField) {
                        $sql .= " AND id != %s";
                        $sqlArgs[] = $excludeField;
                    }

                    $sql .= " ORDER BY sort;";

                    $fields = ACPT_Lite_DB::getResults($sql, $sqlArgs);

                    // Meta box fields
                    foreach ($fields as $fieldIndex => $field) {
                        $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel, $excludeField, $belongsTo, $find, $clonedFields);

                        // if is for formBuilder
                        if ($formBuilder) {
                            if ($fieldModel->isForFormBuilder()) {
                                $boxModel->addField($fieldModel);
                            }
                        } else {
                            $boxModel->addField($fieldModel);
                        }

                        // add cloned fields
                        if ($clonedFields) {
                        }
                    }

                    $groupModel->addBox($boxModel);
                }
            }

            $results[] = $groupModel;
        }

        self::saveInCache($cachedId, $results);

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

        foreach ($elements as $element) {
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

        foreach ($elements as $element) {
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
                f.meta_box_id as box_id,
                f.field_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element) {
            $names[] = $element->name;
        }

        return $names;
    }

    /**
     * @return array<int, array{id: string, box_name: string, field_name: string}>
     */
    public static function getFieldDBNames()
    {
        $records = [];
        $query = "
	        SELECT 
                f.id, 
                b.meta_box_name as box_name,
                f.field_name as field_name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
            JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b ON f.meta_box_id = b.id
            WHERE f.parent_id IS NULL 
	    ";

        $elements = ACPT_Lite_DB::getResults($query, []);

        foreach ($elements as $element) {
            $records[] = [
                'id' => $element->id,
                'box_name' => $element->box_name,
                'field_name' => $element->field_name,
            ];
        }

        return $records;
    }

    /**
     * @return array<string, mixed>
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
                f.meta_box_id as box_id,
                f.field_name as name
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f
	    ";

        $groups = ACPT_Lite_DB::getResults($groupQuery, []);
        foreach ($groups as $group) {
            $names['groups'][] = [
                'id' => $group->id,
                'name' => $group->name,
            ];
        }

        $boxes = ACPT_Lite_DB::getResults($boxQuery, []);
        foreach ($boxes as $box) {
            $names['boxes'][] = [
                'id' => $box->id,
                'name' => $box->name,
            ];
        }

        $fields  = ACPT_Lite_DB::getResults($fieldQuery, []);
        foreach ($fields as $field) {
            $names['fields'][] = [
                'id' => $field->id,
                'box_id' => $field->box_id,
                'name' => $field->name,
            ];
        }

        return $names;
    }

    /**
     * Hydrate the meta field object
     *
     * @param mixed $field
     * @param MetaBoxModel $boxModel
     * @param string|null $excludeField
     * @param string|null $belongsTo
     * @param string|null $find
     * @param bool $clonedFields
     *
     * @return MetaFieldModel|null
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
            'description' => $field->field_description ?? $field->description ?? null,
            'showInArchive' => (bool)$field->showInArchive,
            'sort' => (int)$field->sort
        ]);

        if ($belongsTo) {
            $fieldModel->setBelongsToLabel($belongsTo);
        }

        if ($find) {
            $fieldModel->setFindLabel($find);
        }

        if (isset($field->quick_edit) && $field->quick_edit == 1) {
            $fieldModel->setQuickEdit(true);
        }

        if (isset($field->filter_in_admin) && $field->filter_in_admin == 1) {
            $fieldModel->setFilterableInAdmin(true);
        }

        if (isset($field->parent_id)) {
            $fieldModel->setParentId($field->parent_id);
        }

        if (isset($field->block_id)) {
            $fieldModel->setBlockId($field->block_id);
        }

        // Children
        $excludeQuery = $excludeField ? " AND id != %s" : "";
        $childrenArgs = [$field->id];

        if ($excludeField) {
            $childrenArgs[] = $excludeField;
        }

        $children = ACPT_Lite_DB::getResults("
            SELECT
                id,
                field_name as name,
                field_label as label,
                field_type,
                field_default_value,
                field_description,
                required,
                showInArchive,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."`
            WHERE parent_id = %s 
            ".$excludeQuery."
            ORDER BY sort
        ;", $childrenArgs);

        foreach ($children as $child) {
            $childFieldModel = self::hydrateMetaBoxFieldModel($child, $boxModel);
            $childFieldModel->setParentId($field->id);

            if ($clonedFields) {
            }

            $fieldModel->addChild($childFieldModel);
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

        foreach ($options as $option) {
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
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        return $fieldModel;
    }

    /**
     * @param string $boxName
     * @param string|null $groupId
     *
     * @return MetaBoxModel|null
     * @throws \Exception
     */
    public static function getMetaBoxByName(string $boxName, ?string $groupId = null): ?MetaBoxModel
    {
        $cachedId = ($groupId ? $groupId . '_' : '') . $boxName;
        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

        if ($groupId !== null) {
            $boxesQuery = "
                SELECT
                    id,
                    group_id,
                    meta_box_name as name,
                    meta_box_label as label,
                    settings,
                    sort
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
                WHERE meta_box_name = %s
                AND group_id = %s
                ORDER BY sort
            ";
            $boxes = ACPT_Lite_DB::getResults($boxesQuery, [$boxName, $groupId]);
        } else {
            $boxesQuery = "
                SELECT
                    id,
                    group_id,
                    meta_box_name as name,
                    meta_box_label as label,
                    settings,
                    sort
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
                WHERE meta_box_name = %s
                ORDER BY sort
            ";
            $boxes = ACPT_Lite_DB::getResults($boxesQuery, [$boxName]);
        }

        if (empty($boxes)) {
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

        if (!empty($box->settings)) {
            $boxModel->setSettings(json_decode($box->settings, true));
        }

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
        foreach ($fields as $fieldIndex => $field) {
            $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);
            $boxModel->addField($fieldModel);
        }

        self::saveInCache($cachedId, $boxModel);

        return $boxModel;
    }

    /**
     * @param array<string, mixed> $args
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

        $cachedId = $boxName."_".$fieldName;

        if ($lazy) {
            $cachedId .= "_lazy";
        }

        if (!empty($forgedBy)) {
            $forgedByBoxName = $forgedBy['box_name'] ?? $forgedBy['boxName'] ?? '';
            $forgedByFieldName = $forgedBy['field_name'] ?? $forgedBy['fieldName'] ?? '';
            $cachedId .= "_".$forgedByBoxName."_".$forgedByFieldName;
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

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
	            ORDER BY b.sort, f.sort, f.id
	        ;";

        // ORDER BY makes the row deterministic when two boxes share a name
        // (box names are not globally unique for legacy data) — otherwise the
        // storage-order-dependent $fields[0] could cross-serve a different
        // field through the "<box>_<field>" cache key below.
        $fields = ACPT_Lite_DB::getResults($sql, [$fieldName, $boxName]);

        if (empty($fields)) {
            return null;
        }

        $field = $fields[0];
        $boxModel = self::getMetaBoxById($field->meta_box_id, $lazy);

        if ($boxModel === null) {
            return null;
        }

        if ($lazy) {
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

        self::saveInCache($cachedId, $fieldModel);

        return $fieldModel;
    }

    /**
     * @param string $id
     * @param bool $lazy
     *
     * @return MetaBoxModel|null
     * @throws \Exception
     */
    public static function getMetaBoxById(string $id, bool $lazy = false): ?MetaBoxModel
    {
        // Prefixed (not just the raw $id) because AbstractRepository::fromCache()/saveInCache()
        // hash on the identifier alone, with no per-method/per-type namespacing. Without this,
        // a formId that is coincidentally looked up here AND via getMetaFieldById() (exactly
        // what ConditionalVisibilityLiveChecker does for every liveData row, trying box
        // resolution then field resolution) would collide on the same cache key and return the
        // wrong-typed cached object, fataling with a return-type TypeError.
        $cachedId = "box_".$id;

        if ($lazy) {
            $cachedId .= "_lazy";
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

        $baseQuery = "
            SELECT 
                id, 
                group_id,
                meta_box_name as name,
                meta_box_label as label,
                settings,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."`
            WHERE id = %s
            ";

        $queryArgs = [$id];
        $boxes = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

        if (!empty($boxes)) {
            foreach ($boxes as $box) {
                $groupModel = null;
                $boxModel = null;

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

                    if (empty($group)) {
                        return null;
                    }

                    $groupModel = MetaGroupModel::hydrateFromArray([
                        'id'    => $group[0]->id,
                        'name'  => $group[0]->name,
                        'label' => $group[0]->label,
                    ]);

                    if (!empty($group[0]->priority)) {
                        $groupModel->setPriority($group[0]->priority);
                    }

                    if (!empty($group[0]->context)) {
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

                    foreach ($belongs as $belong) {
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

                    $boxModel = MetaBoxModel::hydrateFromArray([
                        'id'       => $box->id,
                        'group'    => $groupModel,
                        'name'     => $box->name,
                        'label'    => $box->label,
                        'sort'     => $box->sort
                    ]);

                    if (!empty($box->settings)) {
                        $boxModel->setSettings(json_decode($box->settings, true));
                    }
                } catch (\Exception $exception) {
                    do_action("acpt/error", $exception);
                }

                // fields
                if ($lazy === false) {
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
                        foreach ($fields as $fieldIndex => $field) {
                            $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);

                            if ($fieldModel instanceof MetaFieldModel) {
                                $boxModel->addField($fieldModel);
                            }
                        }

                        $groupModel->addBox($boxModel);

                    } catch (\Exception $exception) {
                        do_action("acpt/error", $exception);
                    }
                }

                self::saveInCache($cachedId, $boxModel);

                return $boxModel;
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
    public static function getMetaFieldById(string $id, bool $lazy = false): ?MetaFieldModel
    {
        // Prefixed for the same reason as getMetaBoxById()'s cache key — see the comment there.
        $cachedId = "field_".$id;

        if ($lazy) {
            $cachedId .= "_lazy";
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

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

                if ($boxModel === null) {
                    return null;
                }

                // lazy mode
                if ($lazy) {
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

                    if (isset($field->parent_id) && !empty($field->parent_id)) {
                        $metaField->setParentId($field->parent_id);
                    }

                    if (isset($field->block_id) && !empty($field->block_id)) {
                        $metaField->setBlockId($field->block_id);
                    }

                    self::saveInCache($cachedId, $metaField);

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
                foreach ($boxFields as $boxField) {
                    $boxFieldModel = self::hydrateMetaBoxFieldModel($boxField, $boxModel);
                    $boxModel->addField($boxFieldModel);
                }

                $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);

                self::saveInCache($cachedId, $fieldModel);

                return $fieldModel;
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return null;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $args
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

        $cachedId = "meta_get_fields";

        if ($sortBy) {
            $cachedId .= "_".$sortBy;
        }

        if ($types) {
            $cachedId .= "_".implode("','", $types);
        }

        if ($blockId) {
            $cachedId .= "_".$blockId;
        }

        if ($lazy) {
            $cachedId .= "_lazy";
        }

        $fromCache = self::fromCache($cachedId);

        if ($fromCache !== null) {
            return $fromCache;
        }

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

        if ($types) {
            $sql .= " AND f.field_type IN ('".implode("','", $types)."')";
        }

        if ($blockId) {
            $sql .= " AND f.block_id = %s";
            $queryArgs[] = $blockId;
        }

        $sql .= ' GROUP BY f.id ORDER BY f.'.$sortBy.' ASC;';

        $results = [];
        $fields = ACPT_Lite_DB::getResults($sql, $queryArgs);

        // Load each box once: getMetaBoxById() hydrates the whole box, and without the
        // ACPT cache a lookup per field made this O(fields²) on every admin page (#1387).
        $boxes = [];

        foreach ($fields as $fieldIndex => $field) {
            try {
                if (!array_key_exists($field->meta_box_id, $boxes)) {
                    $boxes[$field->meta_box_id] = self::getMetaBoxById($field->meta_box_id);
                }

                $boxModel = $boxes[$field->meta_box_id];

                if ($boxModel !== null) {
                    if ($lazy) {
                        $results[] = MetaFieldModel::hydrateFromArray([
                            'id'            => $field->id,
                            'box'           => $boxModel,
                            'name'          => $field->name,
                            'label'         => $field->label,
                            'type'          => $field->field_type,
                            'isRequired'    => (bool)(int)$field->required,
                            'defaultValue'  => $field->default_value,
                            'description'   => $field->field_description,
                            'showInArchive' => (bool)(int)$field->showInArchive,
                            'sort'          => $field->sort
                        ]);
                    } else {
                        $results[] = self::hydrateMetaBoxFieldModel($field, $boxModel);
                    }
                }
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        self::saveInCache($cachedId, $results);

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

        foreach ($options as $option) {
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
            } catch (\Exception $exception) {
                do_action("acpt/error", $exception);
            }
        }

        return $results;
    }

    /**
     * @param MetaGroupModel $group
     * @return void
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

            foreach ($group->getBelongs() as $belong) {
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
            }

            foreach ($group->getBoxes() as $boxModel) {
                self::saveMetaBox($boxModel);
            }

            ACPT_Lite_DB::commitTransaction();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            ACPT_Lite_DB::rollbackTransaction();
        }

        ACPT_Lite_DB::flushCache();
    }

    /**
     * @param MetaBoxModel $metaBoxModel
     * @return void
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
                    `settings`,
                    `sort`
                ) VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %d
                ) ON DUPLICATE KEY UPDATE 
                    `group_id` = %s,
                    `meta_box_name` = %s,
                    `meta_box_label` = %s,
                    `settings` = %s,
                    `sort` = %d
            ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $metaBoxModel->getId(),
                $metaBoxModel->getGroup()->getId(),
                $metaBoxModel->getName(),
                $metaBoxModel->getLabel(),
                json_encode($metaBoxModel->getSettings()),
                $metaBoxModel->getSort(),
                $metaBoxModel->getGroup()->getId(),
                $metaBoxModel->getName(),
                $metaBoxModel->getLabel(),
                json_encode($metaBoxModel->getSettings()),
                $metaBoxModel->getSort()
            ]);

            foreach ($metaBoxModel->getFields() as $fieldModel) {
                self::saveMetaBoxField($fieldModel);
            }

            ACPT_Lite_DB::commitTransaction();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            ACPT_Lite_DB::rollbackTransaction();
        }

        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * @param MetaFieldModel $fieldModel
     * @return void
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

            foreach ($fieldModel->getOptions() as $optionModel) {
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

            foreach ($fieldModel->getChildren() as $childModel) {
                self::saveMetaBoxField($childModel);
            }

            ACPT_Lite_DB::commitTransaction();
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            ACPT_Lite_DB::rollbackTransaction();
        }

        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * @param MetaFieldModel $fieldModel
     * @return void
     * @throws \Exception
     */
    private static function saveMetaField(MetaFieldModel $fieldModel)
    {
        if (empty($fieldModel->getName())) {
            return;
        }

        if (empty($fieldModel->getType())) {
            return;
        }

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
                $fieldModel->getDefaultValueAsString(),
                $fieldModel->getDescription(),
                $showInArchive,
                $isRequired,
                $fieldModel->getSort(),
            ],
        ];

        // NULLABLE VALUES
        $data['fields'][] = 'parent_id';
        $data['types'][] = '%s';
        $data['values'][] = !empty($fieldModel->getParentId()) ? $fieldModel->getParentId() : 'NULL';

        $data['fields'][] = 'block_id';
        $data['types'][] = '%s';
        $data['values'][] = !empty($fieldModel->getBlockId()) ? $fieldModel->getBlockId() : 'NULL';

        $data['fields'][] = 'quick_edit';
        $data['types'][] = '%s';
        $data['values'][] = $isForQuickEdit;

        $data['fields'][] = 'filter_in_admin';
        $data['types'][] = '%s';
        $data['values'][] = $isFilterableInAdmin;

        $sql = "INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` ( `id`,";

        foreach ($data['fields'] as $index => $field) {
            $sql .= '`'.$field.'`';

            if ($index < (Arrays::count($data['fields'])-1)) {
                $sql .= ',';
            }
        }

        $sql .= ') VALUES ( %s,';

        foreach ($data['types'] as $index => $type) {
            $sql .= $type;

            if ($index < (Arrays::count($data['fields'])-1)) {
                $sql .= ',';
            }
        }

        $sql .= ') ON DUPLICATE KEY UPDATE ';

        foreach ($data['fields'] as $index => $field) {
            $sql .= '`'.$field.'` = ' . $data['types'][$index];

            if ($index < (Arrays::count($data['fields'])-1)) {
                $sql .= ',';
            }
        }

        $sql .= ';';

        $params = [
            $fieldModel->getId(),
        ];

        foreach ($data['values'] as $values) {
            $params[] = $values;
        }

        foreach ($data['values'] as $values) {
            $params[] = $values;
        }

        ACPT_Lite_DB::executeQueryOrThrowException($sql, $params);
        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * @param array<string, mixed> $args
     * @return void
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

        if (isset($ids['belongs']) && !empty($ids['belongs'])) {
            $belongQuery .= " AND bb.belong_id NOT IN ('".implode("','", $ids['belongs'])."')";
        }

        $belongQuery .= "GROUP BY b.id;";
        $belongs = ACPT_Lite_DB::getResults($belongQuery, [$groupId]);

        foreach ($belongs as $belong) {
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

        if (isset($ids['belongs']) && !empty($ids['belongs'])) {
            $deleteBelongsQuery .= " AND b.belong_id NOT IN ('".implode("','", $ids['belongs'])."')";
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

        if (isset($ids['fields']) && !empty($ids['fields'])) {
            $deleteFieldsQuery .= " AND f.id NOT IN ('".implode("','", $ids['fields'])."')";
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

        if (isset($ids['options']) && !empty($ids['options'])) {
            $deleteOptionsQuery .= " AND o.id NOT IN ('".implode("','", $ids['options'])."')";
        }

        $deleteOptionsQuery .= ";";

        ACPT_Lite_DB::executeQueryOrThrowException($deleteOptionsQuery, [
            $groupId,
        ]);

        $deleteBoxesQuery = "
	        DELETE b
			FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b
			WHERE b.group_id = %s
	    ";

        if (isset($ids['boxes']) && !empty($ids['boxes'])) {
            $deleteBoxesQuery .= " AND id NOT IN ('".implode("','", $ids['boxes'])."')";
        }

        $deleteBoxesQuery .= ";";

        ACPT_Lite_DB::executeQueryOrThrowException($deleteBoxesQuery, [
            $groupId,
        ]);

        // Delete metadata
        if ($deleteMetadata == 1) {
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
            foreach ($fieldsToBeDeleted as $fieldToBeDeleted) {
                $fieldIds[] = $fieldToBeDeleted->id;
            }

            if (!empty($fieldIds)) {
                self::deletePostMetaData($fieldIds);
                self::deleteTaxonomyMetaData($fieldIds);
                self::deleteUserMetaData($fieldIds);
            }
        }

        ACPT_Lite_DB::invalidateCacheTag(self::class);
    }

    /**
     * Delete all post meta data for a given fieldIds list
     *
     * @param array<string> $fieldIds
     * @return void
     * @throws \Exception
     */
    private static function deletePostMetaData($fieldIds)
    {
        global $wpdb;

        foreach ($fieldIds as $fieldId) {
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

            if ($field->meta_box_name !== null && $field->field_name !== null) {
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
     * @param array<string> $fieldIds
     * @return void
     * @throws \Exception
     */
    private static function deleteTaxonomyMetaData($fieldIds)
    {
        global $wpdb;

        foreach ($fieldIds as $fieldId) {
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

            if ($field->meta_box_name !== null && $field->field_name !== null) {
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
     * @param array<string> $fieldIds
     * @return void
     * @throws \Exception
     */
    private static function deleteUserMetaData($fieldIds)
    {
        global $wpdb;

        foreach ($fieldIds as $fieldId) {
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

            if ($field->meta_box_name !== null && $field->field_name !== null) {
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
     * @return void
     * @throws \Exception
     */
    public static function removeOrphanBoxesAndFields()
    {
        $select = "SELECT f.id, b.id from `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f 
            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
            LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g ON g.id = b.group_id 
            WHERE g.id IS NULL;";

        $results = ACPT_Lite_DB::getResults($select);

        if (!empty($results)) {
            $delete = "DELETE f, b from `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_FIELD)."` f 
                LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_BOX)."` b on b.id = f.meta_box_id
                LEFT JOIN  `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_META_GROUP)."` g ON g.id = b.group_id 
                WHERE g.id IS NULL;";

            ACPT_Lite_DB::executeQueryOrThrowException($delete, []);
        }
    }

    /**
     * @return array<string, array<string>>
     */
    public static function getAllAssociatedPostTypesAndTaxonomies()
    {
        $cachedId = 'getAllAssociatedPostTypesAndTaxonomies';
        $fromCache = self::fromCache($cachedId);
        if ($fromCache !== null) {
            return $fromCache;
        }

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

        foreach ($belongs as $belong) {
            $find = explode(",", $belong->find);

            switch ($belong->belongs) {
                // 1. CUSTOM_POST_TYPE
                case MetaTypes::CUSTOM_POST_TYPE:
                    $postTypeNames = array_merge($postTypeNames, $find);
                    break;

                    // 2. PARENT_POST_ID
                case BelongsTo::PARENT_POST_ID:

                    foreach ($find as $postId) {
                        $postTypeNames[] = get_post_type((int)$postId);

                        $childPages = get_children([
                            'post_parent' => $postId
                        ]);

                        foreach ($childPages as $child) {
                            if ($child instanceof \WP_Post) {
                                $postTypeNames[] = get_post_type($child->ID);
                            }
                        }
                    }

                    break;

                    // 3. POST_ID
                case BelongsTo::POST_ID:
                    foreach ($find as $postId) {
                        $postTypeNames[] = get_post_type((int)$postId);
                    }

                    break;

                    // 4. POST_TEMPLATE
                case BelongsTo::POST_TEMPLATE:
                    foreach ($find as $postId) {
                        $file = Meta::fetch($postId, MetaTypes::CUSTOM_POST_TYPE, '_wp_page_template', true);
                        $postTypeNames[] = $file;
                    }

                    break;

                    // 5. POST_TAX
                case BelongsTo::POST_TAX:
                case BelongsTo::POST_CAT:
                    foreach ($find as $termId) {
                        $posts = Posts::getForTermId($termId);

                        foreach ($posts as $post) {
                            if (!empty($post->post_type)) {
                                $postTypeNames[] = $post->post_type;
                            }
                        }
                    }

                    break;

                    // 6. TAXONOMY
                case MetaTypes::TAXONOMY:
                    $taxonomyNames = array_merge($taxonomyNames, $find);
                    break;

                    // 7. TERM_ID
                case BelongsTo::TERM_ID:
                    foreach ($find as $termId) {
                        $term = get_term((int)$termId);

                        if ($term instanceof \WP_Term) {
                            $taxonomyNames[] = $term->name;
                        }
                    }

                    break;
            }
        }

        $result = [
            'postTypeNames' => array_unique($postTypeNames),
            'taxonomyNames' => array_unique($taxonomyNames),
        ];

        self::saveInCache($cachedId, $result);

        return $result;
    }

    /**
     * ***********************************
     *  GENERAL PURPOSE METHODS
     * ***********************************
     */

    /**
     * @param array<string, mixed> $keys
     * @return array<string, mixed>
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
