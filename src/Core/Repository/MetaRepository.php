<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\User\UserMetaBoxFieldModel;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Abstracts\AbstractMetaBoxModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxFieldModel;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeMetaBoxModel;
use ACPT_Lite\Core\Models\MetaField\MetaBoxFieldOptionModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxFieldModel;
use ACPT_Lite\Core\Models\Taxonomy\TaxonomyMetaBoxModel;
use ACPT_Lite\Core\Models\User\UserMetaBoxModel;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;
use ACPT_Lite\Costants\MetaTypes;
use ACPT_Lite\Includes\ACPT_Lite_DB;
use ACPT_Lite\Utils\PostMetaSync;

class MetaRepository
{
    /**
     * Delete all meta box
     *
     * @param array $args
     * @return bool
     * @throws \Exception
     */
    public static function deleteAll(array $args)
    {
        self::validateArgs([], $args);

        $meta = self::get($args);

        if(empty($meta)){
            return false;
        }

        $belongsTo =  $args['belongsTo'];
        $find = isset($args['find']) ? $args['find'] : null;

        ACPT_Lite_DB::startTransaction();

        foreach ($meta as $metaBoxModel){
            self::deleteMetaBox([
                'belongsTo' => $belongsTo,
                'find' => $find,
                'metaBox' => $metaBoxModel
            ]);
        }

        ACPT_Lite_DB::commitTransaction();

        return true;
    }

    /**
     * Delete a meta box model
     *
     * @param array $args
     * @throws \Exception
     */
    public static function deleteMetaBox(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'metaBox' => [
                'required' => true,
                'type' => 'object',
                'instanceOf' => AbstractMetaBoxModel::class,
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        ACPT_Lite_DB::startTransaction();

        /** @var AbstractMetaBoxModel $metaBoxModel */
        $metaBoxModel = $args['metaBox'];
        $belongsTo = $args['belongsTo'];
        $metaBoxTableName = self::metaBoxTableName($belongsTo);

        $sql = "
                    DELETE
                        FROM `".$metaBoxTableName."`
                        WHERE id = %s
                    ";

        $sql2 = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
                        WHERE meta_box_id = %s
                    ";

        $sql3 = "
                    DELETE
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
                        WHERE meta_box_id = %s
                    ";


        try {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaBoxModel->getId()]);
            ACPT_Lite_DB::executeQueryOrThrowException($sql2, [$metaBoxModel->getId()]);
            ACPT_Lite_DB::executeQueryOrThrowException($sql3, [$metaBoxModel->getId()]);
        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        foreach ($metaBoxModel->getFields() as $fieldModel){
            self::deleteMetaField([
                'metaBoxField' => $fieldModel,
                'belongsTo' => $belongsTo,
                'find' => $args['find'],
            ]);
        }

        ACPT_Lite_DB::commitTransaction();
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
        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => true,
                'type' => 'integer|string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $id = $args['id'];
        $belongsTo = $args['belongsTo'];
        $find = isset($args['find']) ? $args['find'] : null;

        $metaBoxModel = self::getMetaBoxById([
            'id' => $id,
            'belongsTo' => $belongsTo,
            'find' => $find,
        ]);

        if( null !== $metaBoxModel) {
            self::deleteMetaBox([
                'belongsTo' => $args['belongsTo'],
                'find' => $find,
                'metaBox' => $metaBoxModel,
            ]);
        }

        return false;
    }

    /**
     * Delete meta field model
     *
     * @param array $args
     * @throws \Exception
     */
    public static function deleteMetaField(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'metaBoxField' => [
                'required' => true,
                'type' => 'object',
                'instanceOf' => AbstractMetaBoxFieldModel::class,
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        ACPT_Lite_DB::startTransaction();

        /** @var AbstractMetaBoxFieldModel $metaBoxFieldModel */
        $fieldModel = $args['metaBoxField'];

        $sql = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
                WHERE id = %s
            ";

        $sql2 = "
            DELETE
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
                WHERE meta_field_id = %s
            ";

        try {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$fieldModel->getId()]);
            ACPT_Lite_DB::executeQueryOrThrowException($sql2, [$fieldModel->getId()]);
        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        foreach ($fieldModel->getOptions() as $optionModel){
            $sql = "
                DELETE
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
                    WHERE id = %s
                ";

            try {
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$optionModel->getId()]);
            } catch (\Exception $exception){
                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }
        }

        ACPT_Lite_DB::commitTransaction();
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
        $mandatoryKeys = self::mandatoryKeys([
            'boxName' => [
                'required' => true,
                'type' => 'string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $boxName = $args['boxName'];
        $metaBoxTableName = self::metaBoxTableName($belongsTo);

        $baseQuery = null;
        $queryArgs = [];

        switch ($belongsTo){
            case MetaTypes::CUSTOM_POST_TYPE:
                $baseQuery = "
                    SELECT
                        id
                    FROM `".$metaBoxTableName."`
                    WHERE post_type = %s
                    AND meta_box_name = %s
                ";

                $queryArgs = [$args['find'], $boxName];
                break;

            case MetaTypes::TAXONOMY:
                $baseQuery = "
                    SELECT 
                        id
                    FROM `".$metaBoxTableName."`
                    WHERE taxonomy = %s
                    AND meta_box_name = %s
                ";

                $queryArgs = [$args['find'], $boxName];
                break;

            case MetaTypes::USER:
                $baseQuery = "
                    SELECT 
                        id
                    FROM `".$metaBoxTableName."`
                    WHERE meta_box_name = %s
                ";

                $queryArgs = [$boxName];
                break;
        }

        if(!empty($baseQuery)){
            $records = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

            return count($records) === 1;
        }

        return false;
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
        $mandatoryKeys = self::mandatoryKeys([
            'boxName' => [
                'required' => true,
                'type' => 'string',
            ],
            'fieldName' => [
                'required' => true,
                'type' => 'string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $boxName = $args['boxName'];
        $fieldName = $args['fieldName'];
        $metaBoxTableName = self::metaBoxTableName($belongsTo);

        $baseQuery = null;
        $queryArgs = [];

        switch ($belongsTo){
            case MetaTypes::CUSTOM_POST_TYPE:
                $baseQuery = "
                    SELECT 
                        f.id
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".$metaBoxTableName."` b ON b.id = f.meta_box_id
                    WHERE b.post_type = %s
                    AND b.meta_box_name = %s
                    AND f.field_name = %s
                ";

                $queryArgs = [$args['find'], $boxName, $fieldName];
                break;

            case MetaTypes::TAXONOMY:
                $baseQuery = "
                    SELECT 
                        f.id
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".$metaBoxTableName."` b ON b.id = f.meta_box_id
                    WHERE b.taxonomy = %s
                    AND b.meta_box_name = %s
                    AND f.field_name = %s
                ";

                $queryArgs = [$args['find'], $boxName, $fieldName];
                break;

            case MetaTypes::USER:
                $baseQuery = "
                    SELECT 
                        f.id
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".$metaBoxTableName."` b ON b.id = f.meta_box_id
                    WHERE b.meta_box_name = %s
                    AND f.field_name = %s
                ";

                $queryArgs = [$boxName, $fieldName];
                break;
        }

        if(!empty($baseQuery)){
            $records = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

            return count($records) === 1;
        }

        return false;
    }

    /**
     * Query for meta box
     *
     * @param array $args
     * @return AbstractMetaBoxModel[]
     * @throws \Exception
     */
    public static function get(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => false,
                'type' => 'integer|string',
            ],
            'boxName' => [
                'required' => false,
                'type' => 'string',
            ],
            'excludeFields' => [
                'required' => false,
                'type' => 'array',
            ],
            'lazy' => [
	            'required' => false,
	            'type' => 'boolean',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $metaBoxTableName = self::metaBoxTableName($belongsTo);
	    $lazy = isset($args['lazy']) ? $args['lazy'] : false;

        $metaBoxQuery = null;
        $metaBoxArgs = [];

        $results = [];

        // query for boxes
        switch($belongsTo){
            case MetaTypes::CUSTOM_POST_TYPE:
                $metaBoxQuery = "
                    SELECT 
                        id, 
                        meta_box_name as name,
                        post_type,
                        sort
                    FROM `".$metaBoxTableName."`
                    WHERE post_type = %s
                ";
                $metaBoxArgs[] = $args['find'];

                if(isset($args['boxName'])){
                    $metaBoxQuery .= " AND meta_box_name = %s";
                    $metaBoxArgs[] = $args['boxName'];
                }

                if(isset($args['id'])){
                    $metaBoxQuery .= " AND id = %s";
                    $metaBoxArgs[] = $args['id'];
                }

                $metaBoxQuery .= " ORDER BY sort;";

                break;

            case MetaTypes::TAXONOMY:
                $metaBoxQuery = "
                    SELECT 
                        id, 
                        meta_box_name as name,
                        taxonomy,
                        sort
                    FROM `".$metaBoxTableName."`
                    WHERE taxonomy = %s
                ";
                $metaBoxArgs[] = $args['find'];

                if(isset($args['boxName'])){
                    $metaBoxQuery .= " AND meta_box_name = %s";
                    $metaBoxArgs[] = $args['boxName'];
                }

                if(isset($args['id'])){
                    $metaBoxQuery .= " AND id = %s";
                    $metaBoxArgs[] = $args['id'];
                }

                $metaBoxQuery .= " ORDER BY sort;";
                break;

            case MetaTypes::USER:
                $metaBoxQuery = "
                    SELECT 
                        uf.id, 
                        uf.meta_box_name as name,
                        uf.sort
                    FROM `".$metaBoxTableName."` uf
                    WHERE 1=1
                    ";

                if(isset($args['boxName'])){
                    $metaBoxQuery .= " AND uf.meta_box_name = %s";
                    $metaBoxArgs[] = $args['boxName'];
                }

                if(isset($args['id'])){
                    $metaBoxQuery .= " AND uf.id = %s";
                    $metaBoxArgs[] = $args['id'];
                }

                $metaBoxQuery .= " ORDER BY uf.sort;";
                break;
        }

        if(!empty($metaBoxQuery)){
            $boxes = ACPT_Lite_DB::getResults($metaBoxQuery, $metaBoxArgs);

            // then fields
            foreach ($boxes as $boxIndex => $box){

                $boxModel = null;

                switch ($belongsTo){
                    case MetaTypes::CUSTOM_POST_TYPE:
                        $boxModel = CustomPostTypeMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'postType' => $box->post_type,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;

                    case MetaTypes::TAXONOMY:
                        $boxModel = TaxonomyMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'taxonomy' => $box->taxonomy,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;

                    case MetaTypes::USER:
                        $boxModel = UserMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;
                }

	            if($boxModel !== null and $box->label){
		            $boxModel->changeLabel($box->label);
	            }

                if($lazy === false){
	                $sql = "
	                    SELECT
	                        id,
	                        field_name as name,
	                        field_type,
	                        field_default_value,
	                        field_description,
	                        required,
	                        showInArchive,
	                        sort
	                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
	                    WHERE meta_box_id = %s
	                ";

	                if(isset($args['excludeFields'])){
		                $sql .= " AND id NOT IN ('".implode("','", $args['excludeFields'])."')";
	                }

	                $sql .= " ORDER BY sort;";

	                $fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

	                // Meta box fields
	                foreach ($fields as $fieldIndex => $field){
		                $fieldModel = self::hydrateMetaBoxFieldModel($field, $boxModel);
		                $boxModel->addField($fieldModel);
	                }
                }

                $results[] = $boxModel;
            }
        }

        return $results;
    }

    /**
     * Hydrate the meta field object
     *
     * @param $field
     * @param AbstractMetaBoxModel $boxModel
     * @return CustomPostTypeMetaBoxFieldModel
     * @throws \Exception
     */
    public static function hydrateMetaBoxFieldModel($field, AbstractMetaBoxModel $boxModel)
    {
        $fieldModel = null;

        switch ($boxModel->metaType()){
            case MetaTypes::CUSTOM_POST_TYPE:
                $fieldModel = CustomPostTypeMetaBoxFieldModel::hydrateFromArray([
                    'id' => $field->id,
                    'metaBox' => $boxModel,
                    'title' => $field->name,
                    'type' => $field->field_type,
                    'required' => $field->required,
                    'defaultValue' => isset($field->field_default_value) ? $field->field_default_value : null,
                    'description' => isset($field->field_description) ? $field->field_description : null,
                    'showInArchive' => $field->showInArchive,
                    'sort' => $field->sort
                ]);
                break;

            case MetaTypes::TAXONOMY:
                $fieldModel = TaxonomyMetaBoxFieldModel::hydrateFromArray([
                    'id' => $field->id,
                    'metaBox' => $boxModel,
                    'name' => $field->name,
                    'type' => $field->field_type,
                    'required' => $field->required,
                    'defaultValue' => isset($field->field_default_value) ? $field->field_default_value : null,
                    'description' => isset($field->field_description) ? $field->field_description : null,
                    'sort' => $field->sort
                ]);
                break;

            case MetaTypes::USER:
                $fieldModel = UserMetaBoxFieldModel::hydrateFromArray([
                    'id' => $field->id,
                    'metaBox' => $boxModel,
                    'name' => $field->name,
                    'type' => $field->field_type,
                    'required' => $field->required,
                    'defaultValue' => isset($field->field_default_value) ? $field->field_default_value : null,
                    'description' => isset($field->field_description) ? $field->field_description : null,
                    'showInArchive' => $field->showInArchive,
                    'sort' => $field->sort
                ]);
                break;
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
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."`
            WHERE meta_field_id = %s
            ORDER BY sort
        ;", [$field->id]);

        foreach ($options as $option){
            $optionModel = MetaBoxFieldOptionModel::hydrateFromArray([
                'id' => $option->id,
                'metaBoxField' => $fieldModel,
                'label' => $option->label,
                'value' => $option->value,
                'sort' => $option->sort,
            ]);

            $fieldModel->addOption($optionModel);
        }

        return $fieldModel;
    }

    /**
     * @param array $args
     * @return AbstractMetaBoxModel|null
     * @throws \Exception
     */
    public static function getMetaBoxByName(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'boxName' => [
                'required' => true,
                'type' => 'string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $boxName = $args['boxName'];

        $metaBoxes = self::get($args);

        foreach ($metaBoxes as $boxModel){
            if($boxModel->getName() === $boxName){
                return $boxModel;
            }
        }

        return null;
    }

    /**
     * @param array $args
     * @return AbstractMetaBoxFieldModel|null
     * @throws \Exception
     */
    public static function getMetaFieldByName(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'boxName' => [
                'required' => true,
                'type' => 'string',
            ],
            'fieldName' => [
                'required' => true,
                'type' => 'string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $find = isset($args['find']) ? $args['find'] : null;
        $boxName = $args['boxName'];
        $fieldName = $args['fieldName'];

        $metaBoxes = self::get([
            'boxName' => $boxName,
            'belongsTo' => $belongsTo,
            'find' => $find,
        ]);

        foreach ($metaBoxes as $boxModel){
            if($boxModel->getName() === $boxName){
                foreach ($boxModel->getFields() as $fieldModel){
                    if($fieldModel->getName() === $fieldName){
                        return $fieldModel;
                    }
                }
            }
        }



        return null;
    }

    /**
     * @param array $args
     * @return AbstractMetaBoxModel|null
     * @throws \Exception
     */
    public static function getMetaBoxById(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => true,
                'type' => 'integer|string',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $metaBoxTableName = self::metaBoxTableName($belongsTo);
        $id = $args['id'];

        $baseQuery = null;
        $queryArgs = [];

        switch ($belongsTo){
            case MetaTypes::CUSTOM_POST_TYPE:
                $baseQuery = "
                    SELECT 
                        id, 
                        post_type,
                        meta_box_name as name,
                        sort
                    FROM `".$metaBoxTableName."`
                    WHERE id = %s
                ";

                $queryArgs = [$id];
                break;

            case MetaTypes::TAXONOMY:
                $baseQuery = "
                    SELECT 
                        id, 
                        taxonomy,
                        meta_box_name as name,
                        sort
                    FROM `".$metaBoxTableName."`
                    WHERE id = %s
                ";

                $queryArgs = [$id];
                break;

            case MetaTypes::USER:
                $baseQuery = "
                    SELECT 
                        id, 
                        meta_box_name as name,
                        sort
                    FROM `".$metaBoxTableName."`
                    WHERE id = %s
                ";

                $queryArgs = [$id];
                break;
        }

        if(!empty($baseQuery)){
            $boxes = ACPT_Lite_DB::getResults($baseQuery, $queryArgs);

            foreach ($boxes as $box){

	            $boxModel = null;

                switch ($belongsTo){
                    case MetaTypes::CUSTOM_POST_TYPE:
                        $boxModel = CustomPostTypeMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'postType' => $box->post_type,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;

                    case MetaTypes::TAXONOMY:
                        $boxModel = TaxonomyMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'taxonomy' => $box->taxonomy,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;

                    case MetaTypes::USER:
                        $boxModel = UserMetaBoxModel::hydrateFromArray( [
                            'id'       => $box->id,
                            'name'     => $box->name,
                            'sort'     => $box->sort
                        ] );
                        break;
                }

	            if($boxModel !== null and $box->label !== null){
		            $boxModel->changeLabel($box->label);
	            }

	            return $boxModel;
            }
        }

        return null;
    }

    /**
     * @param array $args
     * @return AbstractMetaBoxFieldModel|void|null
     * @throws \Exception
     */
    public static function getMetaField(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'id' => [
                'required' => true,
                'type' => 'integer|string',
            ],
            'lazy' => [
                'required' => false,
                'type' => 'boolean',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $belongsTo = $args['belongsTo'];
        $find = isset($args['find']) ? $args['find'] : null;
        $id = $args['id'];
        $lazy = isset($args['lazy']) ? $args['lazy'] : false;

        $sql = "
            SELECT
                id,
                meta_box_id,
                field_name as name,
                field_default_value as default_value,
                field_description as description,
                field_type,
                required,
                showInArchive,
                sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."`
            WHERE id = %s
        ;";

        $fields = ACPT_Lite_DB::getResults($sql, [$id]);

        foreach ($fields as $fieldIndex => $field) {

            $boxModel = self::getMetaBoxById([
                'belongsTo' => $belongsTo,
                'find' => $find,
                'id' => $field->meta_box_id
            ]);

            if($lazy){
                switch ($belongsTo){
                    case MetaTypes::CUSTOM_POST_TYPE:
                        return CustomPostTypeMetaBoxFieldModel::hydrateFromArray([
                            'id'            => $field->id,
                            'metaBox'       => $boxModel,
                            'title'         => $field->name,
                            'type'          => $field->field_type,
                            'required'      => $field->required,
                            'defaultValue'  => $field->default_value,
                            'description'   => $field->description,
                            'showInArchive' => $field->showInArchive,
                            'sort'          => $field->sort
                        ]);

                    case MetaTypes::TAXONOMY:
                        return TaxonomyMetaBoxFieldModel::hydrateFromArray([
                            'id'            => $field->id,
                            'metaBox'       => $boxModel,
                            'name'         => $field->name,
                            'type'          => $field->field_type,
                            'required'      => $field->required,
                            'defaultValue'  => $field->default_value,
                            'description'   => $field->description,
                            'sort'          => $field->sort
                        ]);

                    case MetaTypes::USER:
                        return UserMetaBoxFieldModel::hydrateFromArray([
                            'id'            => $field->id,
                            'metaBox'       => $boxModel,
                            'name'         => $field->name,
                            'type'          => $field->field_type,
                            'required'      => $field->required,
                            'defaultValue'  => $field->default_value,
                            'description'   => $field->description,
                            'showInArchive' => $field->showInArchive,
                            'sort'          => $field->sort
                        ]);
                }

                return null;
            }

            return self::hydrateMetaBoxFieldModel(
                $field,
                self::getMetaBoxById([
                    'belongsTo' => $belongsTo,
                    'id' => $field->meta_box_id
                ]));
        }

        return null;
    }

	/**
	 * @param array $args
	 *
	 * @return AbstractMetaBoxFieldModel[]|null
	 * @throws \Exception
	 */
    public static function getMetaFields(array $args)
    {
	    $mandatoryKeys = self::mandatoryKeys([
		    'types' => [
			    'required' => false,
			    'type' => 'array',
		    ],
		    'lazy' => [
			    'required' => false,
			    'type' => 'boolean',
		    ],
	    ]);

	    self::validateArgs($mandatoryKeys, $args);

	    $belongsTo = isset($args['belongsTo']) ? $args['belongsTo'] : null;
	    $find = isset($args['find']) ? $args['find'] : null;
	    $lazy = isset($args['lazy']) ? $args['lazy'] : false;
	    $types = isset($args['types']) ? $args['types'] : null;

	    $queryArgs = [];
	    $sql = "
            SELECT
                f.id,
                f.meta_box_id,
                f.field_name as name,
                f.field_default_value as default_value,
                f.field_description as description,
                f.field_type,
                f.required,
                f.showInArchive,
                f.sort
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
        ";

	    if($find){
		    switch ($belongsTo){
			    case MetaTypes::CUSTOM_POST_TYPE:
				    $sql .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b ON b.id = f.meta_box_id";
				    $queryArgs[] = $find;
			    	break;

			    case MetaTypes::TAXONOMY:
				    $sql .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` b ON b.id = f.meta_box_id";
				    $queryArgs[] = $find;
				    break;

			    case MetaTypes::USER:
				    $sql .= " LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."` b ON b.id = f.meta_box_id";
				    break;
		    }
	    }

	    $sql .= " WHERE 1 = 1";

	    if($types){
		    $sql .= " AND f.field_type IN ('".implode("','", $types)."')";
	    }

	    if($find){
		    switch ($belongsTo){
			    case MetaTypes::CUSTOM_POST_TYPE:
				    $sql .= " AND b.post_type = %s";
				    break;

			    case MetaTypes::TAXONOMY:
				    $sql .= " AND b.taxonomy = %s";
				    break;
		    }
	    }

	    $sql .= ' GROUP BY f.id ORDER BY f.field_name ASC;';

	    $results = [];
	    $fields = ACPT_Lite_DB::getResults($sql, $queryArgs);

	    foreach ($fields as $fieldIndex => $field) {

		    $boxModel = self::getMetaBoxById([
			    'belongsTo' => $belongsTo,
			    'find' => $find,
			    'id' => $field->meta_box_id
		    ]);

		    if($boxModel !== null){
			    if($lazy){
				    switch ($belongsTo){
					    case MetaTypes::CUSTOM_POST_TYPE:
						    $results[] = CustomPostTypeMetaBoxFieldModel::hydrateFromArray([
							    'id'            => $field->id,
							    'metaBox'       => $boxModel,
							    'title'         => $field->name,
							    'type'          => $field->field_type,
							    'required'      => $field->required,
							    'defaultValue'  => $field->default_value,
							    'description'   => $field->description,
							    'showInArchive' => $field->showInArchive,
							    'sort'          => $field->sort
						    ]);
						    break;

					    case MetaTypes::TAXONOMY:
						    $results[] = TaxonomyMetaBoxFieldModel::hydrateFromArray([
							    'id'            => $field->id,
							    'metaBox'       => $boxModel,
							    'name'          => $field->name,
							    'type'          => $field->field_type,
							    'required'      => $field->required,
							    'defaultValue'  => $field->default_value,
							    'description'   => $field->description,
							    'sort'          => $field->sort
						    ]);
						    break;

					    case MetaTypes::USER:
						    $results[] = UserMetaBoxFieldModel::hydrateFromArray([
							    'id'            => $field->id,
							    'metaBox'       => $boxModel,
							    'name'          => $field->name,
							    'type'          => $field->field_type,
							    'required'      => $field->required,
							    'defaultValue'  => $field->default_value,
							    'description'   => $field->description,
							    'showInArchive' => $field->showInArchive,
							    'sort'          => $field->sort
						    ]);
						    break;
				    }
			    } else {
				    $results[] = self::hydrateMetaBoxFieldModel(
					    $field,
					    self::getMetaBoxById([
						    'belongsTo' => $belongsTo,
						    'id' => $field->meta_box_id
					    ]));
			    }
		    }
	    }

	    return $results;
    }

    /**
     * @param AbstractMetaBoxModel $metaBoxModel
     * @throws \Exception
     */
    public static function saveMetaBox(AbstractMetaBoxModel $metaBoxModel)
    {
        ACPT_Lite_DB::startTransaction();

        try {
            $metaType = $metaBoxModel->metaType();

            switch ($metaType){
                case MetaTypes::CUSTOM_POST_TYPE:

                    PostMetaSync::updatePostMetaWhenBoxNameChanges($metaBoxModel);

                    $sql = "
                        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` 
                        (
                            `id`,
                            `post_type`,
                            `meta_box_name`,
                            `sort`
                        ) VALUES (
                            %s,
                            %s,
                            %s,
                            %d
                        ) ON DUPLICATE KEY UPDATE 
                            `post_type` = %s,
                            `meta_box_name` = %s,
                            `sort` = %d
                    ;";

                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaBoxModel->getId(),
                        $metaBoxModel->getPostType(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort(),
                        $metaBoxModel->getPostType(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort()
                    ]);
                    break;

                case MetaTypes::TAXONOMY:
                    $sql = "
                        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` 
                        (
                            `id`,
                            `taxonomy`,
                            `meta_box_name`,
                            `sort`
                        ) VALUES (
                            %s,
                            %s,
                            %s,
                            %d
                        ) ON DUPLICATE KEY UPDATE 
                            `taxonomy` = %s,
                            `meta_box_name` = %s,
                            `sort` = %d
                    ;";

                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaBoxModel->getId(),
                        $metaBoxModel->getTaxonomy(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort(),
                        $metaBoxModel->getTaxonomy(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort()
                    ]);
                    break;

                case MetaTypes::USER:
                    $sql = "
                        INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."` 
                        (
                            `id`,
                            `meta_box_name`,
                            `sort`
                        ) VALUES (
                            %s,
                            %s,
                            %d
                        ) ON DUPLICATE KEY UPDATE 
                            `meta_box_name` = %s,
                            `sort` = %d
                    ;";

                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $metaBoxModel->getId(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort(),
                        $metaBoxModel->getName(),
                        $metaBoxModel->getSort()
                    ]);
                    break;
            }

            foreach ($metaBoxModel->getFields() as $fieldModel){
                self::saveMetaBoxField($fieldModel);
            }

        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
        }

        ACPT_Lite_DB::commitTransaction();
    }

    /**
     * @param AbstractMetaBoxFieldModel $fieldModel
     * @throws \Exception
     */
    public static function saveMetaBoxField(AbstractMetaBoxFieldModel $fieldModel)
    {
        $showInArchive = $fieldModel->isShowInArchive() ? '1' : '0';
        $isRequired = $fieldModel->isRequired() ? '1' : '0';
        $metaBoxModel = $fieldModel->getMetaBox();


        if($fieldModel->getMetaBox()->metaType() === MetaTypes::CUSTOM_POST_TYPE){
            PostMetaSync::updatePostMetaWhenFieldNameChanges($fieldModel);
        }

        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` 
            (
                `id`,
                `meta_box_id`,
                `field_name`,
                `field_type`,
                `field_default_value`,
                `field_description`,
                `showInArchive`,
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
                %d
            ) ON DUPLICATE KEY UPDATE 
                `meta_box_id` = %s,
                `field_name` = %s,
                `field_type` = %s,
                `field_default_value` = %s,
                `field_description` = %s,
                `showInArchive` = %s,
                `required` = %s,
                `sort` = %d
        ;";

        $params = [
            $fieldModel->getId(),
            $metaBoxModel->getId(),
            $fieldModel->getName(),
            $fieldModel->getType(),
            $fieldModel->getDefaultValue(),
            $fieldModel->getDescription(),
            $showInArchive,
            $isRequired,
            $fieldModel->getSort(),
            $metaBoxModel->getId(),
            $fieldModel->getName(),
            $fieldModel->getType(),
            $fieldModel->getDefaultValue(),
            $fieldModel->getDescription(),
            $showInArchive,
            $isRequired,
            $fieldModel->getSort(),
        ];


        ACPT_Lite_DB::executeQueryOrThrowException($sql, $params);

        foreach ($fieldModel->getOptions() as $optionModel){
            $sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` 
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
                        %d
                    ) ON DUPLICATE KEY UPDATE 
                        `meta_box_id` = %s,
                        `meta_field_id` = %s,
                        `option_label` = %s,
                        `option_value` = %s,
                        `sort` = %d
                ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $optionModel->getId(),
                $metaBoxModel->getId(),
                $fieldModel->getId(),
                $optionModel->getLabel(),
                $optionModel->getValue(),
                $optionModel->getSort(),
                $metaBoxModel->getId(),
                $fieldModel->getId(),
                $optionModel->getLabel(),
                $optionModel->getValue(),
                $optionModel->getSort()
            ]);
        }
    }

    /**
     * @param array $args
     * @throws \Exception
     */
    public static function removeMetaOrphans(array $args)
    {
        $mandatoryKeys = self::mandatoryKeys([
            'ids' => [
                'required' => false,
                'type' => 'array',
            ],
        ]);

        self::validateArgs($mandatoryKeys, $args);

        $ids = $args['ids'];
        $belongsTo = $args['belongsTo'];
        $find = isset($args['find']) ? $args['find'] : null;

        // Delete metadata
        $deleteMetadata = SettingsRepository::getSingle('delete_metadata');

        if($deleteMetadata !== null and $deleteMetadata->getValue() == 1){
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    $baseQuery = "
                        SELECT 
                            f.id
                        FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                        WHERE f.id NOT IN ('".implode("','", $ids['fields'])."') AND f.parent_id IS NULL
                    ";

                    $fieldsToBeDeleted = ACPT_Lite_DB::getResults($baseQuery);

                    $fieldIds = [];
                    foreach ($fieldsToBeDeleted as $fieldToBeDeleted){
                        $fieldIds[] = $fieldToBeDeleted->id;
                    }

                    if(!empty($fieldIds)){
                        self::deletePostMetaData($fieldIds);
                    }
                    break;

                // @TODO User and Taxonomy
            }
        }

        if(isset($ids['fields'])){
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id=f.meta_box_id WHERE b.post_type = '".$find."' AND f.id NOT IN ('".implode("','",$ids['fields'])."');");
                    break;

                case MetaTypes::TAXONOMY:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` b on b.id=f.meta_box_id WHERE b.taxonomy = '".$find."' AND f.id NOT IN ('".implode("','",$ids['fields'])."');");
                    break;

                case MetaTypes::USER:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."` b on b.id=f.meta_box_id WHERE f.id NOT IN ('".implode("','",$ids['fields'])."');");
                    break;
            }
        }

        if(isset($ids['options'])){
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` o LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id=o.meta_box_id WHERE b.post_type = '".$find."' AND o.id NOT IN ('".implode("','",$ids['options'])."');");
                    break;

                case MetaTypes::TAXONOMY:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` o LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` b on b.id=o.meta_box_id WHERE b.taxonomy = '".$find."' AND o.id NOT IN ('".implode("','",$ids['options'])."');");
                    break;
                case MetaTypes::USER:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_OPTION)."` o LEFT JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."` b on b.id=o.meta_box_id WHERE o.id NOT IN ('".implode("','",$ids['options'])."');");
                    break;
            }

        }

        if(isset($ids['boxes'])){
            switch ($belongsTo) {
                case MetaTypes::CUSTOM_POST_TYPE:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` WHERE post_type = '".$args['find']."' AND id NOT IN ('".implode("','",$ids['boxes'])."');");
                    break;

                case MetaTypes::TAXONOMY:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX)."` WHERE taxonomy = '".$args['find']."' AND id NOT IN ('".implode("','",$ids['boxes'])."');");
                    break;

                case MetaTypes::USER:
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX)."` WHERE id NOT IN ('".implode("','",$ids['boxes'])."');");
                    break;
            }
        }
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
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_FIELD)."` f
                    JOIN `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX)."` b on b.id = f.meta_box_id
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
                'required' => true,
                'type' => 'string',
                'enum' => [
                    MetaTypes::CUSTOM_POST_TYPE,
                    MetaTypes::TAXONOMY,
                    MetaTypes::USER,
                ],
            ],
            'find' => [
                'required' => false,
                'type' => 'string',
            ],
        ];

        return array_merge($keys, $mandatoryKeys);
    }

    /**
     * @param array $mandatoryKeys
     * @param array $args
     * @throws \Exception
     */
    private static function validateArgs(array $mandatoryKeys = [], array $args = [])
    {
        $validator = new ArgumentsArrayValidator();

        if(!$validator->validate(self::mandatoryKeys($mandatoryKeys), $args)){
            throw new \Exception('Invalid parameters');
        }
    }

    /**
     * @param $belongsTo
     * @return string|null
     */
    private static function metaBoxTableName($belongsTo)
    {
        switch ($belongsTo){
            case MetaTypes::CUSTOM_POST_TYPE:
                return ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_CUSTOM_POST_TYPE_META_BOX);

            case MetaTypes::TAXONOMY:
                return ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_TAXONOMY_META_BOX);
                break;

            case MetaTypes::USER:
                return ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_USER_META_BOX);
                break;
        }

        return null;
    }
}