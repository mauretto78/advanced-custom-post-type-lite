<?php

namespace ACPT_Lite\Core\Repository;

use ACPT_Lite\Core\Models\WooCommerceProductDataFieldModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataFieldOptionModel;
use ACPT_Lite\Core\Models\WooCommerceProductDataModel;
use ACPT_Lite\Includes\ACPT_Lite_DB;

class WooCommerceProductDataRepository
{
    /**
     * @throws \Exception
     */
    public static function clear()
    {
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."`");
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."`");
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."`");
    }

    /**
     * @param $id
     *
     * @return bool
     * @throws \Exception
     */
    public static function delete($id)
    {
        if(self::exists($id)){

            $productDataModel = self::get([
                    'id' => $id
            ]);

            /** @var WooCommerceProductDataFieldModel $field */
            foreach ($productDataModel[0]->getFields() as $field){

                /** @var WooCommerceProductDataFieldOptionModel $option */
                foreach ($field->getOptions() as $option){
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."` WHERE id = %s;", [$option->getId()]);
                }

                ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."` WHERE id = %s;", [$field->getId()]);
            }

            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."` WHERE id = %s;", [$id]);

            return true;
        }

        return false;
    }

    /**
     * @param $id
     * @param $fieldId
     *
     * @return bool
     * @throws \Exception
     */
    public static function deleteField($id, $fieldId)
    {
        /** @var WooCommerceProductDataFieldModel $productDataFieldModel */
        $productDataFieldModel = self::getField($id, $fieldId);

        if(null === $productDataFieldModel){
            return false;
        }

        /** @var WooCommerceProductDataFieldOptionModel $option */
        foreach ($productDataFieldModel->getOptions() as $option){
            ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."` WHERE id = %s;", [$option->getId()]);
        }

        ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."` WHERE id = %s;", [$productDataFieldModel->getId()]);

        return true;
    }

    /**
     * @param $id
     *
     * @return bool
     * @throws \Exception
     */
    public static function deleteFields($id)
    {
        if(self::exists($id)){

            $productDataModel = self::get([
                    'id' => $id
            ]);

            /** @var WooCommerceProductDataFieldModel $field */
            foreach ($productDataModel[0]->getFields() as $field){

                /** @var WooCommerceProductDataFieldOptionModel $option */
                foreach ($field->getOptions() as $option){
                    ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."` WHERE id = %s;", [$option->getId()]);
                }

                ACPT_Lite_DB::executeQueryOrThrowException("DELETE FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."` WHERE id = %s;", [$field->getId()]);
            }

            return true;
        }

        return false;
    }

    /**
     * Check if a WC product data exists
     *
     * @since    1.0.1
     * @param $id
     *
     * @return bool
     */
    public static function exists($id)
    {
        $baseQuery = "
            SELECT 
                id
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."`
            WHERE id = %s
            ";

        $posts = ACPT_Lite_DB::getResults($baseQuery, [$id]);

        return count($posts) === 1;
    }

    /**
     * @param array $meta
     *
     * @return WooCommerceProductDataModel[]
     * @throws \Exception
     */
    public static function get(array $meta = [])
    {
        $results = [];
        $args = [];

        $baseQuery = "
            SELECT 
                pd.id, 
                pd.product_data_name as name,
                pd.icon,
                pd.visibility,
                pd.show_in_ui,
                pd.content
            FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."` pd
            WHERE 1=1
            ";

        if(isset($meta['id'])){
            $baseQuery .= " AND pd.id = %s";
            $args[] = $meta['id'];
        }

        if(isset($meta['name'])){
            $baseQuery .= " AND pd.name = %s";
            $args[] = $meta['name'];
        }

        $baseQuery .= " GROUP BY pd.id";

        if(isset($meta['page']) and isset($meta['perPage'])){
            $baseQuery .= " LIMIT ".$meta['perPage']." OFFSET " . ($meta['perPage'] * ($meta['page'] - 1));
        }

        $baseQuery .= ';';
        $productData = ACPT_Lite_DB::getResults($baseQuery, $args);

        foreach ($productData as $productDatum){

            $productDataModel = WooCommerceProductDataModel::hydrateFromArray([
                    'id' => $productDatum->id,
                    'name' => $productDatum->name,
                    'icon' => json_decode($productDatum->icon),
                    'showInUI' => $productDatum->show_in_ui == '0' ? false : true,
                    'visibility' => json_decode($productDatum->visibility),
            ]);

            $fields = ACPT_Lite_DB::getResults("
                SELECT 
                    id, 
                    product_data_id, 
                    field_name as name, 
                    field_type as type, 
                    field_default_value as defaultValue, 
                    field_description as description,
                    required, 
                    sort
                FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."`
                WHERE product_data_id = %s
                ORDER BY sort
            ;", [$productDatum->id]);

            foreach ($fields as $fieldIndex => $field){

                $productDataFieldModel = WooCommerceProductDataFieldModel::hydrateFromArray([
                        'id' => $field->id,
                        'productDataModel' => $productDataModel,
                        'name' => $field->name,
                        'type' => $field->type,
                        'defaultValue' => $field->defaultValue,
                        'required' => $field->required == "1",
                        'description' => $field->description,
                        'sort' => (int)$field->sort,
                ]);

                $options = ACPT_Lite_DB::getResults("
                    SELECT
                        id,
                        product_data_id as productDataId,
                        product_data_field_id as fieldId,
                        option_label as label,
                        option_value as value,
                        sort
                    FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."`
                    WHERE product_data_field_id = %s
                    ORDER BY sort
                ;", [$field->id]);

                foreach ($options as $option){
                    $optionModel = WooCommerceProductDataFieldOptionModel::hydrateFromArray([
                            'id' => $option->id,
                            'productDataField' => $productDataFieldModel,
                            'label' => $option->label,
                            'value' => $option->value,
                            'sort' => $option->sort,
                    ]);

                    $productDataFieldModel->addOption($optionModel);
                }

                $productDataModel->addField($productDataFieldModel);
            }

            $results[] = $productDataModel;
        }

        return $results;
    }

    /**
     * @param $id
     * @param $fieldId
     *
     * @return array
     * @throws \Exception
     */
    public static function getField($id, $fieldId)
    {
        $fields = self::getFields($id);

        if(empty($fields)){
            return [];
        }

        $filteredFields = array_filter($fields, function ($field) use ($fieldId) {
            return $fieldId === $field->getId();
        });

        if(empty($filteredFields)){
            return [];
        }

        return $filteredFields[0];
    }

    /**
     * @param $id
     *
     * @return WooCommerceProductDataFieldModel[]
     * @throws \Exception
     */
    public static function getFields($id)
    {
        $productData = self::get([
                'id' => $id
        ]);

        if(!isset($productData[0])){
            return [];
        }

        return $productData[0]->getFields();
    }

    /**
     * @param $productDataName
     * @param $field
     *
     * @return WooCommerceProductDataFieldModel|mixed|null
     * @throws \Exception
     */
    public static function getSingleField( $productDataName, $field)
    {
        $productData = self::get();

        foreach ($productData as $item){
            if($item->getName() === $productDataName){
                foreach ($item->getFields() as $fieldModel){
                    if($fieldModel->getName() === $field){
                        return $fieldModel;
                    }
                }
            }
        }

        return null;
    }

    /**
     * @param WooCommerceProductDataModel $productDataModel
     *
     * @throws \Exception
     */
    public static function save(WooCommerceProductDataModel $productDataModel)
    {
        $sql = "
            INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA)."` 
            (`id`,
            `product_data_name` ,
            `icon` ,
            `visibility`,
            `show_in_ui`,
            `content`
            ) VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            ) ON DUPLICATE KEY UPDATE 
                `product_data_name` = %s,
                `icon` = %s,
                `visibility` = %s,
                `show_in_ui` = %s,
                `content` = %s
        ;";

        ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                $productDataModel->getId(),
                $productDataModel->getName(),
                json_encode($productDataModel->getIcon()),
                json_encode($productDataModel->getVisibility()),
                $productDataModel->isShowInUI(),
                $productDataModel->getContent(),
                $productDataModel->getName(),
                json_encode($productDataModel->getIcon()),
                json_encode($productDataModel->getVisibility()),
                $productDataModel->isShowInUI(),
                $productDataModel->getContent(),
        ]);

        if( !empty($productDataModel->getFields()) ){
            WooCommerceProductDataRepository::saveFields($productDataModel->getFields());
        }
    }

    /**
     * @param WooCommerceProductDataFieldModel[] $fields
     *
     * @throws \Exception
     */
    public static function saveFields(array $fields)
    {
        foreach ($fields as $fieldModel){

            $isRequired = $fieldModel->isRequired() ? '1' : '0';

            $sql = "
                INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."` 
                (
                    `id`,
                    `product_data_id`,
                    `field_name`,
                    `field_type`,
                    `field_default_value`,
                    `field_description`,
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
                    %d
                ) ON DUPLICATE KEY UPDATE 
                    `product_data_id` = %s,
                    `field_name` = %s,
                    `field_type` = %s,
                    `field_default_value` = %s,
                    `field_description` = %s,
                    `required` = %s,
                    `sort` = %d
            ;";

            ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                    $fieldModel->getId(),
                    $fieldModel->getProductData()->getId(),
                    $fieldModel->getName(),
                    $fieldModel->getType(),
                    $fieldModel->getDefaultValue(),
                    $fieldModel->getDescription(),
                    $isRequired,
                    $fieldModel->getSort(),
                    $fieldModel->getProductData()->getId(),
                    $fieldModel->getName(),
                    $fieldModel->getType(),
                    $fieldModel->getDefaultValue(),
                    $fieldModel->getDescription(),
                    $isRequired,
                    $fieldModel->getSort(),
            ]);

            foreach ($fieldModel->getOptions() as $optionModel){
                $sql = "
                    INSERT INTO `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."` 
                    (`id`,
                    `product_data_id` ,
                    `product_data_field_id` ,
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
                        `product_data_id` = %s,
                        `product_data_field_id` = %s,
                        `option_label` = %s,
                        `option_value` = %s,
                        `sort` = %d
                ;";

                ACPT_Lite_DB::executeQueryOrThrowException($sql, [
                        $optionModel->getId(),
                        $fieldModel->getProductData()->getId(),
                        $fieldModel->getId(),
                        $optionModel->getLabel(),
                        $optionModel->getValue(),
                        $optionModel->getSort(),
                        $fieldModel->getProductData()->getId(),
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
     * @throws \Exception
     */
    public static function removeFieldsOrphans($ids)
    {
        $optionsIds = [];
        $fieldIds = [];
        $productDataIds = [];

        foreach ($ids as $id){
            $fieldIds[] = $id['field'];
            $productDataIds[] = $id['product_data_id'];

            foreach ($id['options'] as $optionId){
                $optionsIds[] = $optionId;
            }
        }

        ACPT_Lite_DB::executeQueryOrThrowException("DELETE f FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_FIELD)."` f WHERE f.product_data_id IN ('".implode("','",$productDataIds)."') AND f.id NOT IN ('"
                .implode("','",$fieldIds)."');");
        ACPT_Lite_DB::executeQueryOrThrowException("DELETE o FROM `".ACPT_Lite_DB::prefixedTableName(ACPT_Lite_DB::TABLE_WOOCOMMERCE_PRODUCT_DATA_OPTION)."` o WHERE o.product_data_id IN ('".implode("','",$productDataIds)."') AND o.id NOT IN ('"
                .implode("','",$optionsIds)."');");
    }
}