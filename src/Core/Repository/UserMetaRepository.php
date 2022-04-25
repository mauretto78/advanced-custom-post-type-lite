<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\UserMetaBoxModel;
use ACPT_Lite\Core\Models\UserMetaFieldModel;
use ACPT_Lite\Core\Models\UserMetaFieldOptionModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class UserMetaRepository
{
    /**
     * Delete all meta
     *
     * @return string|null
     * @throws \Exception
     * @since    1.0.60
     */
    public static function deleteAll()
    {
        $meta = self::get();

        ACPT_Lite_DB::startTransaction();

        foreach ($meta as $metaBoxModel){
            self::deleteMetaBox($metaBoxModel);
        }

        ACPT_Lite_DB::commitTransaction();

        return true;
    }

    /**
     * @param $id
     * @return bool
     * @throws \Exception
     */
    public static function deleteMetaById($id)
    {
        if( null !== $metaBoxModel = self::getMetaBox($id)) {
            self::deleteMetaBox($metaBoxModel);
        }

        return false;
    }

    /**
     * Delete a meta box
     *
     * @param UserMetaBoxModel $metaBoxModel
     * @throws \Exception
     */
    private static function deleteMetaBox(UserMetaBoxModel $metaBoxModel)
    {
        ACPT_Lite_DB::startTransaction();

        $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::TABLE_USER_META_BOX."`
                        WHERE id = %s
                    ";

        try {
            ACPT_Lite_DB::executeQueryOrThrowException($sql, [$metaBoxModel->getId()]);
        } catch (\Exception $exception){
            ACPT_Lite_DB::rollbackTransaction();
            throw new \Exception($exception->getMessage());
        }

        foreach ($metaBoxModel->getFields() as $fieldModel){
            $sql = "
                    DELETE
                        FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD."`
                        WHERE id = %s
                    ";

            try {
                ACPT_Lite_DB::executeQueryOrThrowException($sql, [$fieldModel->getId()]);
            } catch (\Exception $exception){
                ACPT_Lite_DB::rollbackTransaction();
                throw new \Exception($exception->getMessage());
            }

            foreach ($fieldModel->getOptions() as $optionModel){
                $sql = "
                        DELETE
                            FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."`
                            WHERE id = %s
                        ";

                try {
                    ACPT_Lite_DB::executeQueryOrThrowException($sql, [$optionModel->getId()]);
                } catch (\Exception $exception){
                    ACPT_Lite_DB::rollbackTransaction();
                    throw new \Exception($exception->getMessage());
                }
            }
        }

        ACPT_Lite_DB::commitTransaction();
    }

    /**
     * @param array $meta
     *
     * @return UserMetaBoxModel[]
     * @throws \Exception
     */
    public static function get(array $meta = [])
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                uf.id, 
                uf.meta_box_name as name,
                uf.sort
            FROM `".ACPT_Lite_DB::TABLE_USER_META_BOX."` uf
            WHERE 1=1
            ";

        if(isset($meta['id'])){
            $baseQuery .= " AND uf.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['excludeFields'])){
            $baseQuery .= " AND uf.id NOT IN ('".implode("','", $meta['excludeFields'])."')";
        }

        $baseQuery .= " ORDER BY uf.sort;";
        $boxes = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($boxes as $box){
            $boxModel = UserMetaBoxModel::hydrateFromArray([
                    'id' => $box->id,
                    'name' => $box->name,
                    'sort' => $box->sort
            ]);

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
                        FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD."`
                        WHERE user_meta_box_id = %s
                        ORDER BY sort;
                    ";

            $fields = ACPT_Lite_DB::getResults($sql, [$box->id]);

            foreach ($fields as $fieldIndex => $field){
                $fieldModel = UserMetaFieldModel::hydrateFromArray([
                        'id' => $field->id,
                        'metaBox' => $boxModel,
                        'name' => $field->name,
                        'type' => $field->field_type,
                        'required' => $field->required,
                        'defaultValue' => $field->field_default_value,
                        'description' => $field->field_description,
                        'showInArchive' => $field->showInArchive,
                        'sort' => $field->sort
                ]);

                $options = ACPT_Lite_DB::getResults("
                    SELECT
                        id,
                        user_meta_box_id as boxId,
                        user_meta_field_id as fieldId,
                        option_label as label,
                        option_value as value,
                        sort
                    FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."`
                    WHERE user_meta_field_id = %s
                    ORDER BY sort
                ;", [$field->id]);

                foreach ($options as $option){
                    $optionModel = UserMetaFieldOptionModel::hydrateFromArray([
                            'id' => $option->id,
                            'userMetaBox' => $boxModel,
                            'userField' => $fieldModel,
                            'label' => $option->label,
                            'value' => $option->value,
                            'sort' => $option->sort,
                    ]);

                    $fieldModel->addOption($optionModel);
                }

                $boxModel->addField($fieldModel);
            }

            $results[] = $boxModel;
        }

        return $results;
    }

    /**
     * @param $id
     *
     * @return UserMetaBoxModel
     * @throws \Exception
     */
    public static function getMetaBox($id)
    {
        $boxes = ACPT_Lite_DB::getResults("
            SELECT 
                id, 
                post_type,
                meta_box_name as name,
                sort
            FROM `".ACPT_Lite_DB::TABLE_USER_META_BOX."`
            WHERE id = %s
        ;", [$id]);

        foreach ($boxes as $boxIndex => $box) {
            return UserMetaBoxModel::hydrateFromArray( [
                    'id'       => $box->id,
                    'name'     => $box->name,
                    'sort'     => $box->sort
            ] );
        }
    }

    /**
     * @param $id
     *
     * @return UserMetaFieldModel
     * @throws \Exception
     */
    public static function getField($id)
    {
        $sql = "
            SELECT
                id,
                user_meta_box_id,
                field_name as name,
                field_default_value as default_value,
                field_description as description,
                field_type,
                required,
                showInArchive,
                sort
            FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD."`
            WHERE id = %s
        ;";

        $fields = ACPT_Lite_DB::getResults($sql, [$id]);

        foreach ($fields as $fieldIndex => $field) {
            return UserMetaFieldModel::hydrateFromArray( [
                    'id'            => $field->id,
                    'metaBox'       => self::getMetaBox($field->user_meta_box_id),
                    'title'         => $field->name,
                    'type'          => $field->field_type,
                    'required'      => $field->required,
                    'defaultValue'  => $field->default_value,
                    'description'   => $field->description,
                    'showInArchive' => $field->showInArchive,
                    'sort'          => $field->sort
            ] );
        }

        return null;
    }

    /**
     * Save meta box
     *
     * @param UserMetaBoxModel $metaBoxModel
     *
     * @throws \Exception
     */
    public static function save(UserMetaBoxModel $metaBoxModel)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::TABLE_USER_META_BOX."` 
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

        foreach ($metaBoxModel->getFields() as $fieldModel){

            $showInArchive = $fieldModel->isShowInArchive() ? '1' : '0';
            $isRequired = $fieldModel->isRequired() ? '1' : '0';

            $sql = "
                INSERT INTO `".ACPT_Lite_DB::TABLE_USER_META_FIELD."` 
                (
                    `id`,
                    `user_meta_box_id`,
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
                    `user_meta_box_id` = %s,
                    `field_name` = %s,
                    `field_type` = %s,
                    `field_default_value` = %s,
                    `field_description` = %s,
                    `showInArchive` = %s,
                    `required` = %s,
                    `sort` = %d
            ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
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
            ]);

            foreach ($fieldModel->getOptions() as $optionModel){
                $sql = "
                    INSERT INTO `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."` 
                    (`id`,
                    `user_meta_box_id` ,
                    `user_meta_field_id` ,
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
                        `user_meta_box_id` = %s,
                        `user_meta_field_id` = %s,
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
    }

    /**
     * @param $ids
     *
     * @throws \Exception
     */
    public static function removeOrphans($ids)
    {
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD."` f LEFT JOIN `".ACPT_Lite_DB::TABLE_USER_META_BOX."` b on b.id=f.user_meta_box_id WHERE f.id NOT IN ('".implode("','",$ids['fields'])."');");
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::TABLE_USER_META_FIELD_OPTION."` o LEFT JOIN `".ACPT_Lite_DB::TABLE_USER_META_BOX."` b on b.id=o.user_meta_box_id WHERE o.id NOT IN ('".implode("','",$ids['options'])."');");
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::TABLE_USER_META_BOX."` WHERE id NOT IN ('".implode("','",$ids['boxes'])."');");
    }
}